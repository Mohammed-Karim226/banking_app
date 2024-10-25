"use server";

import {
  SignUpParams,
  TCreateIssue,
  TCreateNoteParams,
  TErrorResponse,
  TUpdateNoteParams,
  User,
  createBankAccountProps,
  exchangePublicTokenProps,
  getBankByAccountIdProps,
  getBankProps,
  getBanksProps,
  getUserInfoProps,
  signInProps,
} from "@/src/types";
import { createAdminClient, createSessionClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import {
  encryptId,
  extractCustomerIdFromUrl,
  parseStringify,
} from "@/lib/utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";
import dayjs from "dayjs";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
  APPWRITE_NOTES_COLLECTION_ID: NOTE_COLLECTION_ID,
  APPWRITE_ISSUES_COLLECTION_ID: ISSUE_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { dataBases } = await createAdminClient();

    const user = await dataBases.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    const err = error as TErrorResponse;
    throw err.message;
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    const err = error as TErrorResponse;
    throw new Error(err.message);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName, address1, postalCode } = userData;

  let newUserAccount;

  try {
    const { account, dataBases } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    if (!newUserAccount) throw new Error("Error creating user");

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    if (!dwollaCustomerUrl) {
      throw new Error("Error creating Dwolla customer");
    }

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await dataBases.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    const err = error as TErrorResponse;
    throw new Error(err.message);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    const result = await account.get();
    const user = await getUserInfo({ userId: result.$id });
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export async function logoutAccount() {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
}

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth", "transactions"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };
    const res = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: res.data.link_token });
  } catch (error) {
    console.error("Error creating link token:", error);
    return null;
  }
};

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  sharaebleId,
}: createBankAccountProps) => {
  try {
    const { dataBases } = await createAdminClient();

    const bankAccount = await dataBases.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        sharaebleId,
      }
    );
    return parseStringify(bankAccount);
  } catch (error) {
    return null;
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    const res = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = res.data.access_token;
    const itemId = res.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const accountData = accountsResponse?.data?.accounts[0];

    // create a processor token for dwolla using the access token and account id
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData?.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData?.name,
    });

    if (!fundingSourceUrl) throw Error;

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharaebleId: encryptId(accountData.account_id),
    });

    revalidatePath("/");

    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    return null;
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { dataBases } = await createAdminClient();

    // List all documents without filtering by userId to inspect the data
    const queries = userId ? [Query.equal("userId", [userId])] : [];
    const banks = await dataBases.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      queries
    );

    return parseStringify(banks.documents);
  } catch (error) {
    throw new Error("Failed to retrieve banks data.");
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { dataBases } = await createAdminClient();

    const bank = await dataBases.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("$id", [documentId])]
    );

    return parseStringify(bank.documents[0]);
  } catch (error) {
    throw new Error("Failed to retrieve bank data.");
  }
};

export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const { dataBases } = await createAdminClient();

    const bank = await dataBases.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal("accountId", [accountId])]
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const createNote = async ({
  title,
  content,
  userId,
}: TCreateNoteParams) => {
  try {
    const { dataBases } = await createAdminClient();

    const noteId = ID.unique();

    const noteData = {
      id: noteId,
      userId,
      title,
      content,
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"), // Example: 2024-10-05 13:45:30
      updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"), // Example: 2024-10-05 13:45:30
    };

    const newNote = await dataBases.createDocument(
      DATABASE_ID!,
      NOTE_COLLECTION_ID!,
      noteId,
      noteData
    );
    return parseStringify(newNote);
  } catch (error) {
    const err = error as TErrorResponse;
    throw new Error(
      err.message || "An unknown error occurred while creating the note."
    );
  }
};

export const updateNote = async ({
  noteId,
  title,
  content,
}: TUpdateNoteParams) => {
  try {
    const { dataBases } = await createAdminClient();

    const updateNoteData = {
      title,
      content,
      updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"), // Example: 2024-10-05 13:45:30
    };

    const updatedNote = await dataBases.updateDocument(
      DATABASE_ID!,
      NOTE_COLLECTION_ID!,
      noteId,
      updateNoteData
    );
    return parseStringify(updatedNote);
  } catch (error) {
    throw new Error("Failed to update note.");
  }
};

export const deleteNote = async ({ noteId }: { noteId: string }) => {
  try {
    const { dataBases } = await createAdminClient();

    await dataBases.deleteDocument(DATABASE_ID!, NOTE_COLLECTION_ID!, noteId);

    return { message: "Note deleted successfully." };
  } catch (error) {
    throw new Error("Failed to delete note.");
  }
};

export const getNotes = async ({ userId }: { userId: string }) => {
  try {
    const { dataBases } = await createAdminClient();

    const notes = await dataBases.listDocuments(
      DATABASE_ID!,
      NOTE_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(notes.documents);
  } catch (error) {
    const err = error as TErrorResponse;
    throw err.message;
  }
};

export const createIssue = async ({
  userId,
  transactionId,
  subject,
  description,
}: TCreateIssue) => {
  try {
    const issueId = ID.unique();
    const issueData = {
      id: issueId,
      userId,
      transactionId,
      subject,
      description,
    };
    const { dataBases } = await createAdminClient();

    const NewIssue = await dataBases.createDocument(
      DATABASE_ID!,
      ISSUE_COLLECTION_ID!,
      issueId,
      issueData
    );
    return parseStringify(NewIssue);
  } catch (error) {
    const err = error as TErrorResponse;
    throw err.message;
  }
};

export const getIssue = async ({ userId }: { userId: string }) => {
  try {
    const { dataBases } = await createAdminClient();

    const issues = await dataBases.listDocuments(
      DATABASE_ID!,
      ISSUE_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    return parseStringify(issues.documents);
  } catch (error) {
    const err = error as TErrorResponse;
    throw err.message;
  }
};

export const deleteIssue = async ({ id }: { id: string }) => {
  try {
    const { dataBases } = await createAdminClient();

    await dataBases.deleteDocument(DATABASE_ID!, ISSUE_COLLECTION_ID!, id);
    return { message: "Issue deleted successfully." };
  } catch (error) {
    const err = error as TErrorResponse;
    throw err.message;
  }
};
