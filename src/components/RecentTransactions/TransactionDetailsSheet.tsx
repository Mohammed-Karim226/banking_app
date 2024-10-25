"use client";

import { Transaction } from "@/src/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

import { formatAmount, formatDateTime } from "@/lib/utils";
import { Printer, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import ReportIssueForm from "./ReportIssueForm";

interface TransactionDetailsSheetProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function TransactionDetailsSheet({
  transaction,
  isOpen,
  onClose,
  userId,
}: TransactionDetailsSheetProps) {
  if (!transaction) return null;

  const handlePrintReceipt = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Transaction Receipt</title>
            <style>
              body { font-family: monospace; margin: 20px; }
              h1 { text-align: center; }
              .receipt { border: 1px solid #000; padding: 10px; width: 300px; margin: auto; }
              .receipt div { margin: 5px 0; }
              .total { font-weight: bold; }
              .footer { text-align: center; font-size: 0.8em; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <h1>Receipt</h1>
              <div><strong>Name:</strong> ${transaction.name}</div>
              <div><strong>Amount:</strong> ${formatAmount(
                transaction.amount
              )}</div>
              <div><strong>Date:</strong> ${
                formatDateTime(new Date(transaction.date)).dateTime
              }</div>
              <div><strong>Category:</strong> ${transaction.category}</div>
              <div><strong>Payment Channel:</strong> ${
                transaction.paymentChannel
              }</div>
              <div><strong>Transaction ID:</strong> ${transaction.id}</div>
              <div class="total"><strong>Status:</strong> ${
                transaction.status || "Pending"
              }</div>
            </div>
            <div class="footer">
              Thank you for your business!<br>
              Please keep this receipt for your records.
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-white dark:border-transparent dark:bg-stone-600 p-6 max-sm:w-full rounded-lg shadow-lg">
        <SheetHeader className="text-center">
          <SheetTitle className="text-xl font-bold flex items-center justify-between space-x-2 dark:text-gray-100">
            <span>Transaction Details</span>
          </SheetTitle>
          <SheetDescription className="text-center text-gray-500 dark:text-gray-400">
            Receipt for transaction #{transaction.id}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4 text-sm font-mono text-gray-800 dark:text-gray-300">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{transaction.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {formatAmount(transaction.amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{formatDateTime(new Date(transaction.date)).dateTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Category:</span>
            <span>{transaction.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Payment Channel:</span>
            <span>{transaction.paymentChannel}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Transaction ID:</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {transaction.id}
            </span>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span>{transaction.status || "Pending"}</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <Button
            onClick={handlePrintReceipt}
            className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg shadow-md dark:shadow-none"
          >
            <Printer className="mr-2 h-5 w-5 text-white" />
            Print Receipt
          </Button>

          <ReportIssueForm
            transactionId={transaction.id}
            transaction={transaction}
            userId={userId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
