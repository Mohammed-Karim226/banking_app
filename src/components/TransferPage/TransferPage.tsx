import { SearchParamProps } from "@/src/types";
import MainHeader from "../Layouts/MainHeader/MainHeader";
import PaymentTransferForm from "./PaymentTransferForm";
import { getLoggedInUser } from "@/src/utils/actions/user.actions";
import { getAccount, getAccounts } from "@/src/utils/actions/bank.actions";

const TransferPage = async ({ params, searchParams }: SearchParamProps) => {
  const id = Array.isArray(searchParams.id)
    ? searchParams.id[0]
    : searchParams.id;
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;

  const currentPage = Number(page as string) || 1;

  const userInfo = await getLoggedInUser();
  const accounts = await getAccounts({
    userId: userInfo?.$id,
  });

  if (!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  return (
    <section className="payment-transfer dark:bg-neutral-600">
      <MainHeader
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />
      <section className="size-full">
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  );
};

export default TransferPage;
