"use client";

import {
  CategoryBadgeProps,
  Transaction,
  TransactionTableProps,
} from "@/src/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  cn,
  exportToCSV,
  exportToPDF,
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";
import { transactionCategoryStyles } from "@/src/constants";

const CategoryBage = ({ category }: CategoryBadgeProps) => {
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    transactionCategoryStyles[
      category as keyof typeof transactionCategoryStyles
    ] || transactionCategoryStyles.default;
  return (
    <div className={cn("category-badge", borderColor, chipBackgroundColor)}>
      <div className={cn("size-2 rounded-full", backgroundColor)} />
      <p className={cn("text-[12px] font-medium", textColor)}>{category}</p>
    </div>
  );
};

interface ITableProps extends TransactionTableProps {
  onTransactionClick?: (transaction: Transaction) => void;
  history?: boolean;
}

const TransactionsTable = ({
  transactions,
  onTransactionClick,
  history,
}: ITableProps) => {
  const handleExportCSV = () => {
    exportToCSV(transactions);
  };

  const handleExportPDF = () => {
    exportToPDF(transactions);
  };

  return (
    <div className="w-full flex flex-col gap-3  mt-3">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold dark:text-slate-700">
          Transactions
        </h2>
        <div className="max-sm:flex max-sm:flex-col max-sm:justify-end max-sm:gap-1 max-sm:items-center">
          <button
            onClick={handleExportCSV}
            className="mr-2 max-sm:mr-0 px-4 py-2 dark:bg-blue-500/30 dark:text-blue-900 bg-blue-500 text-white font-semibold rounded-sm shadow-md transition duration-200 hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Export to CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-green-500 dark:bg-green-500/30 dark:text-green-900 text-white font-semibold rounded-sm shadow-md transition duration-200 hover:bg-green-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Export to PDF
          </button>
        </div>
      </div>
      <Table>
        <TableHeader className="bg-[#f9fafb] dark:bg-neutral-600">
          <TableRow className="dark:!border-neutral-900">
            <TableHead className="px-2 dark:text-slate-900">
              Transactions
            </TableHead>
            <TableHead className="px-2 dark:text-slate-900">Amount</TableHead>
            <TableHead className="px-2 dark:text-slate-900">Status</TableHead>
            <TableHead className="px-2 dark:text-slate-900">Date</TableHead>
            <TableHead className="px-2 max-md:hidden dark:text-slate-900">
              Chanel
            </TableHead>
            <TableHead className="px-2 max-md:hidden dark:text-slate-900">
              Category
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction: Transaction) => {
            const status = getTransactionStatus(new Date(transaction.date));
            const amount = formatAmount(transaction.amount);
            const isDepit = transaction.type === "depit";
            const isCredit = transaction.type === "credit";

            return (
              <TableRow
                onClick={() =>
                  onTransactionClick && onTransactionClick(transaction)
                }
                key={transaction.id}
                className={`${
                  isDepit || amount[0] === "-"
                    ? "bg-[#FFFBFA] dark:bg-neutral-700"
                    : "bg-[#F6FEF9] dark:bg-neutral-600"
                } !over:bg-none dark:!border-neutral-900 !border-b-default ${
                  history === true ? "" : "!cursor-pointer"
                }`}
              >
                <TableCell className="max-w-[250px] pl-2 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054] dark:text-neutral-900">
                      {removeSpecialCharacters(transaction.name)}
                    </h1>
                  </div>
                </TableCell>
                <TableCell
                  className={`pl-2 pr-10 font-semibold ${
                    isDepit || amount[0] === "-"
                      ? "text-[#f04438]"
                      : "text-[#039855]"
                  }`}
                >
                  {isDepit ? `-${amount}` : isCredit ? amount : amount}
                </TableCell>
                <TableCell className={`pl-2 pr-10`}>
                  <CategoryBage category={status} />
                </TableCell>
                <TableCell className={`pl-2 pr-10 min-w-32`}>
                  {formatDateTime(new Date(transaction.date)).dateTime}
                </TableCell>
                <TableCell className={`pl-2 pr-10 capitalize min-w-24`}>
                  {transaction.paymentChannel}
                </TableCell>
                <TableCell className={`pl-2 pr-10 max-md:hidden`}>
                  <CategoryBage category={transaction.category} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
