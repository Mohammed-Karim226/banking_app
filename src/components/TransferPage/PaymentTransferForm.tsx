"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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

import { Account, PaymentTransferFormProps } from "@/src/types";
import { Loader } from "lucide-react";
import { useState } from "react";
import Select from "react-select";

interface IAccountOption {
  value: string;
  label: string;
}
const PaymentTransferForm = ({
  accounts,
  appwriteItemId,
}: {
  accounts: PaymentTransferFormProps;
  appwriteItemId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

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
  const { setValue, watch } = form;
  const selectedBank = watch("senderBank");
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <section className="size-full flex justify-start items-start flex-col gap-4">
      <div className="flex flex-col border-b border-gray-200 justify-start items-start gap-[1px] mt-2 w-full py-4">
        <p className="text-gray-900 font-semibold text-lg">Transfer details</p>
        <p className="text-slate-600 text-sm font-normal">
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
                  <div className="flex max-sm:flex-col border-b border-gray-200 justify-start items-start gap-6 w-full pb-4 pt-1">
                    <div className="flex flex-col max-w-[280px] justify-start items-start gap-[1px]">
                      <p className="text-gray-900 font-semibold text-sm">
                        Select Source Bank
                      </p>
                      <p className="text-slate-600 text-xs font-normal">
                        Choose the bank account from which you are transferring
                        funds.
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <Select
                        options={accounts?.map((acc: Account) => ({
                          label: String(acc?.name),
                          value: String(acc?.id),
                        }))}
                        className="w-[512px] max-sm:w-[320px]"
                        value={
                          accounts
                            ?.map((acc: Account) => ({
                              label: String(acc?.name),
                              value: String(acc?.id),
                            }))
                            ?.find((option) => option.value === field.value) ??
                          null
                        }
                        onChange={(selectedOption: IAccountOption | null) =>
                          field.onChange(selectedOption?.value ?? "")
                        }
                        onBlur={field.onBlur}
                        name={field.name}
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
                  <div className="flex max-sm:flex-col border-b border-gray-200 justify-start items-start gap-6 w-full pb-4 pt-1">
                    <div className="flex flex-col max-w-[280px] justify-start items-start gap-[1px]">
                      <p className="text-gray-900 font-semibold text-sm">
                        Transfer Note (Optional)
                      </p>
                      <p className="text-slate-600 text-xs font-normal">
                        Please provide any additional information or
                        instructions related to the transfer
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <Textarea
                        placeholder="Add Msg."
                        {...field}
                        className="w-[512px] min-h-[140px] max-sm:w-[320px]"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col border-b border-gray-200 justify-start items-start gap-[1px] w-full pb-4">
            <p className="text-gray-900 font-semibold text-lg">
              Bank account details
            </p>
            <p className="text-slate-600 text-sm font-normal">
              Enter the bank account details of the recipient
            </p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex max-sm:flex-col border-b border-gray-200 justify-start items-start gap-6 w-full pb-4 ">
                    <div className="flex flex-col max-w-[280px] justify-start items-start gap-[1px]">
                      <p className="text-gray-900 font-semibold text-sm">
                        Recipient's Email Address
                      </p>
                      <p className="text-slate-600 text-xs font-normal">
                        Enter the recipient's email for confirmation and
                        communication purposes.
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <Input
                        placeholder="Email"
                        {...field}
                        className="w-[512px] max-sm:w-[320px]"
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
                  <div className="flex max-sm:flex-col border-b border-gray-200 justify-start items-start gap-6 w-full pb-4 ">
                    <div className="flex flex-col max-w-[280px] justify-start items-start gap-[1px]">
                      <p className="text-gray-900 font-semibold text-sm">
                        Recipient's Bank Account Number
                      </p>
                      <p className="text-slate-600 text-xs font-normal">
                        Provide the correct account number to transfer funds
                        securely.
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <Input
                        placeholder="Enter the account number"
                        {...field}
                        className="w-[512px] max-sm:w-[320px]"
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
                  <div className="flex max-sm:flex-col border-b border-gray-200 justify-start items-start gap-6 w-full pb-4">
                    <div className="flex flex-col max-w-[280px] justify-start items-start gap-[1px]">
                      <p className="text-gray-900 font-semibold text-sm">
                        Amount
                      </p>
                      <p className="text-slate-600 text-xs font-normal">
                        Specify the amount of money you want to transfer as you
                        want.
                      </p>
                    </div>
                    <div className="flex justify-center items-center">
                      <Input
                        placeholder="40000"
                        {...field}
                        className="w-[512px] max-sm:w-[320px]"
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
            className="payment-transfer_btn"
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
