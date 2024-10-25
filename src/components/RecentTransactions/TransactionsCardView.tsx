"use client";

import {
  Transaction,
  TransactionTableProps,
  CategoryBadgeProps,
} from "@/src/types";
import { Card, CardContent } from "../ui/card";
import {
  cn,
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";
import { transactionCategoryStyles } from "@/src/constants";

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    transactionCategoryStyles[
      category as keyof typeof transactionCategoryStyles
    ] || transactionCategoryStyles.default;

  return (
    <div
      className={cn(
        "category-badge flex items-center gap-2 px-2 py-1 rounded-full",
        borderColor,
        "shadow-sm",
        chipBackgroundColor
      )}
    >
      <div className={cn("w-2 h-2 rounded-full", backgroundColor)} />
      <p className={cn("text-[12px] font-medium truncate", textColor)}>
        {category}
      </p>
    </div>
  );
};

interface TransactionsCardViewProps extends TransactionTableProps {
  onTransactionClick: (transaction: Transaction) => void;
}

const TransactionsCardView = ({
  transactions,
  onTransactionClick,
}: TransactionsCardViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {transactions?.map((transaction: Transaction) => {
        const status = getTransactionStatus(new Date(transaction.date));
        const amount = formatAmount(transaction.amount);
        const isDebit = transaction.type === "debit";
        const isCredit = transaction.type === "credit";

        return (
          <Card
            key={transaction.id}
            className={cn(
              "transition-transform transform hover:scale-[1.02] cursor-pointer overflow-hidden shadow-lg rounded-lg",
              isDebit || amount[0] === "-"
                ? "bg-gradient-to-r from-[#FFFBFA] to-[#FFE0E0] dark:bg-neutral-700"
                : "bg-gradient-to-r from-[#F6FEF9] to-[#DFFFE4] dark:bg-neutral-600"
            )}
            onClick={() => onTransactionClick(transaction)}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-mono font-semibold text-[#344054] dark:text-neutral-200 truncate">
                  {removeSpecialCharacters(transaction.name)}
                </h3>
                <CategoryBadge category={transaction.category} />
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={cn(
                    "text-xl font-bold",
                    isDebit || amount[0] === "-"
                      ? "text-[#f04438]"
                      : "text-[#039855]"
                  )}
                >
                  {isDebit ? `-${amount}` : isCredit ? amount : amount}
                </span>
                <CategoryBadge category={status} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>
                  Date: {formatDateTime(new Date(transaction.date)).dateTime}
                </p>
                <p>Channel: {transaction.paymentChannel}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TransactionsCardView;
