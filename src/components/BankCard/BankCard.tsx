"use client";
import { formatAmount } from "@/lib/utils";
import { CreditCardProps } from "@/src/types";
import Image from "next/image";
import Link from "next/link";
import Copy from "./Copy";

const BankCard = ({
  account,
  userName,
  showBalance = true,
}: CreditCardProps) => {
  return (
    <div className="flex flex-col ">
      <Link
        href={`transaction-history/?id=${account?.appwriteItemId}`}
        className="bank-card dark:!border-slate-600"
      >
        <div className="bank-card_content ">
          <div>
            <h1 className="text-16 font-semibold text-white dark:text-stone-700">
              {account?.name ?? userName}
            </h1>
            <p className="font-ibm-plex-serif font-black text-white dark:text-stone-700">
              {formatAmount(account?.currentBalance ?? 0)}
            </p>
          </div>
          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white dark:text-stone-700">
                {userName ?? ""}
              </h1>
              <h2 className="text-12 font-semibold text-white dark:text-stone-700">
                ●● / ●●
              </h2>
            </div>
            <p className="text-14 font-semibold tracking-[1.1px] dark:text-stone-700 text-white">
              ●●●● ●●●● ●●●●{" "}
              <span className="text-16">{account?.mask ?? "123"}</span>
            </p>
          </article>
        </div>
        <div className="bank-card_icon">
          <Image src={"/icons/Paypass.svg"} alt="pay" width={45} height={32} />
          <Image
            src={"/icons/mastercard.svg"}
            alt="master card"
            width={20}
            height={24}
          />
        </div>
        <Image
          src={"/icons/lines.svg"}
          alt="lines"
          width={316}
          height={160}
          className="absolute top-0 left-0 dark:text-stone-700"
        />
      </Link>
      {showBalance && <Copy title={account?.sharaebleId} />}
    </div>
  );
};

export default BankCard;
