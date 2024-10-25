"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "../ui/select";
import { formUrlQuery, formatAmount } from "@/lib/utils";
import { Account, BankDropdownProps } from "@/src/types";

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSeclected] = useState(accounts[0]);

  const handleBankChange = (id: string) => {
    const account = accounts.find((account) => account.appwriteItemId === id)!;

    setSeclected(account);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: id,
    });
    router.push(newUrl, { scroll: false });

    if (setValue) {
      setValue("senderBank", id);
    }
  };

  return (
    <Select
      defaultValue={selected.id}
      onValueChange={(value) => handleBankChange(value)}
    >
      <SelectTrigger
        className={`flex w-full bg-white dark:bg-neutral-500 gap-3 md:w-[512px] max-sm:w-[320px] dark:border-neutral-800 ${otherStyles}`}
      >
        <Image
          src="icons/credit-card.svg"
          width={20}
          height={20}
          alt="account"
        />
        <p className="line-clamp-1 w-full text-left">{selected.name}</p>
      </SelectTrigger>
      <SelectContent
        className={`w-full focus-visible:dark:ring-offset-0 dark:border-neutral-800 bg-white dark:bg-neutral-500 md:w-[512px] max-sm:w-[320px] ${otherStyles}`}
        align="end"
      >
        <SelectGroup className="dark:border-neutral-800">
          <SelectLabel className="py-2 font-normal text-gray-500 dark:text-neutral-800 ">
            Select a bank to display
          </SelectLabel>
          {accounts.map((account: Account) => (
            <SelectItem
              key={account.id}
              value={account.appwriteItemId}
              className="cursor-pointer border-t dark:!text-neutral-800 dark:border-neutral-800 "
            >
              <div className="flex flex-col ">
                <p className="text-16 font-medium dark:!text-neutral-800  ">
                  {account.name}
                </p>
                <p className="text-14 font-medium text-blue-600 dark:!text-neutral-800 ">
                  {formatAmount(account.currentBalance)}
                </p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
