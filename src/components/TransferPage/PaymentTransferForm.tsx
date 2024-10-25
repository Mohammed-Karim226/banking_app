"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

import { Input } from "../ui/input";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});

import { useState } from "react";
import { Loader } from "lucide-react";
import { PaymentTransferFormProps, TErrorResponse } from "@/src/types";
import { BankDropdown } from "./BankDropdwon";
import { toast } from "react-hot-toast";
import { decryptId } from "@/lib/utils";
import { getBank, getBankByAccountId } from "@/src/utils/actions/user.actions";
import { createTransaction } from "@/src/utils/actions/transaction.action";
import { createTransfer } from "@/src/utils/actions/dwolla.actions";
import { useRouter } from "next/navigation";

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      sharableId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const receiverAccountId = decryptId(values?.sharableId);
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });

      const senderBank = await getBank({ documentId: values?.senderBank });

      const transformParams = {
        sourceFundingSourceUrl: senderBank?.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: values?.amount,
      };

      const transfer = await createTransfer(transformParams);

      if (transfer) {
        const transaction = {
          name: values?.name,
          amount: values?.amount,
          senderId: senderBank.userId.$id,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.$id,
          email: values?.email,
        };
        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          toast.success("Funds have been transferred without any issues!.", {
            position: "bottom-right",
          });
          form.reset();
          router.push("/");
        }
      }
    } catch (error) {
      const err = error as TErrorResponse;
      toast.error(`${err.message}`, {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="size-full flex justify-start items-start flex-col gap-4">
      <div className="flex flex-col border-b dark:border-neutral-800 border-gray-200 justify-start items-start gap-[1px] mt-2 w-full py-4">
        <p className="text-gray-900 font-semibold text-lg dark:text-neutral-800">
          Transfer details
        </p>
        <p className="text-slate-600 text-sm font-normal dark:text-neutral-800">
          Enter the details of the recipient
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="senderBank"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex max-sm:flex-col border-b dark:border-neutral-800 border-gray-200 justify-start items-start gap-6 w-full pb-4 pt-1">
                    <div className="flex flex-col max-w-[280px] justify-start items-start gap-[1px]">
                      <p className="text-gray-900 font-semibold text-sm dark:text-neutral-800">
                        Select Source Bank
                      </p>
                      <p className="text-slate-600 text-xs font-normal dark:text-neutral-800">
                        Choose the bank account from which you are transferring
                        funds.
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <BankDropdown
                        accounts={accounts}
                        setValue={form.setValue}
                        otherStyles=""
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex max-sm:flex-col border-b dark:border-neutral-800 border-gray-200 justify-start items-start gap-6 w-full pb-4 pt-1">
                    <div className="flex flex-col max-w-[280px] justify-start items-start gap-[1px]">
                      <p className="text-gray-900 font-semibold text-sm dark:text-neutral-800">
                        Transfer Note (Optional)
                      </p>
                      <p className="text-slate-600 text-xs font-normal dark:text-neutral-800">
                        Please provide any additional information or
                        instructions related to the transfer
                      </p>
                    </div>
                    <div className="flex justify-center items-center dark:text-neutral-800">
                      <Textarea
                        placeholder="Add Msg."
                        {...field}
                        className="w-[512px] focus-visible:dark:ring-offset-0 dark:border-neutral-800 min-h-[140px] max-sm:w-[320px] dark:text-neutral-800 dark:bg-neutral-500"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col border-b border-gray-200 dark:border-neutral-800 justify-start items-start gap-[1px] w-full pb-4">
            <p className="text-gray-900 font-semibold text-lg dark:text-neutral-800">
              Bank account details
            </p>
            <p className="text-slate-600 text-sm font-normal dark:text-neutral-800">
              Enter the bank account details of the recipient
            </p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex max-sm:flex-col border-b dark:border-neutral-800 border-gray-200 justify-start items-start gap-6 w-full pb-4 ">
                    <div className="flex flex-col max-w-[280px] justify-start items-start gap-[1px]">
                      <p className="text-gray-900 font-semibold text-sm dark:text-neutral-800">
                        Recipient's Email Address
                      </p>
                      <p className="text-slate-600 text-xs font-normal dark:text-neutral-800">
                        Enter the recipient's email for confirmation and
                        communication purposes.
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <Input
                        placeholder="Email"
                        {...field}
                        className="w-[512px] focus-visible:dark:ring-offset-0 dark:border-neutral-800 max-sm:w-[320px] dark:bg-neutral-500"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sharableId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex max-sm:flex-col border-b dark:border-neutral-800 border-gray-200 justify-start items-start gap-6 w-full pb-4 ">
                    <div className="flex flex-col max-w-[280px] justify-start items-start gap-[1px]">
                      <p className="text-gray-900 font-semibold text-sm dark:text-neutral-800">
                        Recipient's Bank Account Number
                      </p>
                      <p className="text-slate-600 text-xs font-normal dark:text-neutral-800">
                        Provide the correct account number to transfer funds
                        securely.
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <Input
                        placeholder="Enter the account number"
                        {...field}
                        className="w-[512px] focus-visible:dark:ring-offset-0 dark:border-neutral-800 max-sm:w-[320px] dark:bg-neutral-500"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex max-sm:flex-col border-b dark:border-neutral-800 border-gray-200 justify-start items-start gap-6 w-full pb-4">
                    <div className="flex flex-col max-w-[280px] justify-start items-start gap-[1px]">
                      <p className="text-gray-900 font-semibold text-sm dark:text-neutral-800">
                        Amount
                      </p>
                      <p className="text-slate-600 text-xs font-normal dark:text-neutral-800">
                        Specify the amount of money you want to transfer as you
                        want.
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <Input
                        placeholder="40000"
                        {...field}
                        className="w-[512px] max-sm:w-[320px] focus-visible:dark:ring-offset-0 dark:border-neutral-800 dark:bg-neutral-500"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="payment-transfer_btn dark:!text-neutral-800 "
          >
            {isLoading ? (
              <Loader style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              "Transfer Funds"
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default PaymentTransferForm;
