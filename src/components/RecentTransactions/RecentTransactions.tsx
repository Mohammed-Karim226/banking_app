"use client";

import { useState } from "react";
import { Account, RecentTransactionsProps, Transaction } from "@/src/types";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import TabsTriggerItem from "./TabsTriggerItem";
import TabsContentItem from "./TabsContentItem";
import TransactionsTable from "./TransactionsTable";
import Pagination from "../ui/Pagination";
import TransactionsCardView from "./TransactionsCardView";
import { Button } from "../ui/button";
import { Menu, TableDocument } from "iconsax-react";
import dynamic from "next/dynamic";

const TransactionDetailsSheet = dynamic(
  () => import("./TransactionDetailsSheet"),
  {
    ssr: false,
  }
);

const RecentTransactions = ({
  accounts,
  transactions,
  appwriteItemId,
  page = 1,
  userId,
}: RecentTransactionsProps) => {
  const [view, setView] = useState("table");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const rowPerPage = 10;
  const totalPages = Math.ceil(transactions?.length / rowPerPage);

  const indexOfLastTransaction = page * rowPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowPerPage;

  const currentTransactions = transactions?.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <section className="recent-transactions">
      <header className="flex justify-between items-center">
        <h2 className="recent-transactions-label dark:text-slate-600">
          Recent transactions
        </h2>
        <Link
          href={`/transaction-history/?id=${appwriteItemId}`}
          className="view-all-btn dark:!border-slate-600"
        >
          View all
        </Link>
      </header>
      <Tabs defaultValue={appwriteItemId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {accounts?.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.appwriteItemId}>
              <TabsTriggerItem
                account={account}
                appwriteItemId={appwriteItemId}
              />
            </TabsTrigger>
          ))}
        </TabsList>
        {accounts?.map((account: Account) => (
          <TabsContent
            key={account.id}
            value={account.appwriteItemId}
            className="space-y-4"
          >
            <TabsContentItem
              account={account}
              type="full"
              appwriteItemId={appwriteItemId}
            />
            <div className="w-full gap-2 flex justify-end items-center">
              <button onClick={() => setView("table")}>
                <TableDocument
                  size="32"
                  color="#292929"
                  className="py-1 px-0 border rounded-md dark:text-slate-600 dark:border-slate-600"
                />
              </button>
              <button onClick={() => setView("card")}>
                <Menu
                  size="32"
                  color="#292929"
                  className="py-1 px-0 border rounded-md dark:text-slate-600 dark:border-slate-600"
                />
              </button>
            </div>
            {view === "table" ? (
              <TransactionsTable
                onTransactionClick={handleTransactionClick}
                transactions={currentTransactions}
                history={false}
              />
            ) : (
              <TransactionsCardView
                transactions={currentTransactions}
                onTransactionClick={handleTransactionClick}
              />
            )}
            <Pagination totalPages={totalPages} page={page} />
          </TabsContent>
        ))}
      </Tabs>
      <TransactionDetailsSheet
        transaction={selectedTransaction}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        userId={userId ?? ""}
      />
    </section>
  );
};

export default RecentTransactions;
