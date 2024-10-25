"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { cn, formUrlQuery } from "@/lib/utils";
import { BankTabItemProps } from "@/src/types";

const TabsTriggerItem = ({ account, appwriteItemId }: BankTabItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = appwriteItemId === account?.appwriteItemId;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.appwriteItemId,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div
      onClick={handleBankChange}
      className={cn(`banktab-item dark:border-slate-600 `, {
        "border-blue-600 dark:border-slate-700": isActive,
      })}
    >
      <p
        className={cn(
          `text-16 line-clamp-1 flex-1 font-medium dark:text-slate-600 text-gray-500`,
          {
            " text-blue-600 dark:text-slate-700": isActive,
          }
        )}
      >
        {account.name}
      </p>
    </div>
  );
};

export default TabsTriggerItem;
