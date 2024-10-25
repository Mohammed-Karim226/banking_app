"use client";
import { cn, countTransactionCategories } from "@/lib/utils";
import { CategoryCount, RightSidebarProps } from "@/src/types";
import BankCard from "../../BankCard/BankCard";
import { motion } from "framer-motion";
import CategoryItem from "./CategoryItem";
import PlaidLink from "../../Auth/SignUp/PlaidLink";
import GetNotes from "./GetNotes";

const RightSideBar = ({ user, transactions, banks }: RightSidebarProps) => {
  const categories: CategoryCount[] = countTransactionCategories(transactions);

  return (
    <aside className={cn("right-sidebar !gap-2 dark:bg-stone-400")}>
      <section className="flex flex-col">
        <div className="profile-banner dark:bg-stone-400" />
        <div className="profile dark:bg-stone-400">
          <motion.div
            initial={{ opacity: 0, translateX: -100 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0, translateX: -100 }}
            className="profile-img dark:bg-stone-400 dark:!border-gray-300"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              exit={{ opacity: 0 }}
              className="text-5xl capitalize text-blue-500 dark:text-slate-500 font-bold"
            >
              {user?.firstName[0]}
            </motion.span>
          </motion.div>
          <div className="profile-details dark:bg-stone-400">
            <motion.h1
              initial={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 1 }}
              className="profile-name capitalize dark:text-slate-600"
            >
              {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 1 }}
              className="profile-email dark:text-slate-600"
            >
              {user?.email}
            </motion.p>
          </div>
        </div>
      </section>
      <section className="banks dark:bg-stone-400">
        <div className="w-full flex justify-between dark:bg-stone-400">
          <motion.h1
            initial={{ opacity: 0, translateX: -100 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center text-gray-900 dark:text-slate-600 text-lg font-semibold items-center"
          >
            My Banks
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, translateX: 100 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 1 }}
            className="flex gap-1 justify-center items-center"
          >
            <PlaidLink user={user} variant="ghost" />
          </motion.div>
        </div>
        {banks?.length >= 0 && (
          <div className="relative flex flex-col justify-center items-center gap-5 flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="z-10 relative "
            >
              <BankCard
                key={banks[0]?.$id}
                account={banks[0]}
                userName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                showBalance={false}
              />
            </motion.div>
            {banks[1] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute right-0 w-[90%] top-8 z-0"
              >
                <BankCard
                  key={banks[1]?.$id}
                  account={banks[1]}
                  userName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                  showBalance={false}
                />
              </motion.div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-6 flex-1 mt-10">
          <h2 className="header-2 dark:text-slate-600">Top Categories</h2>
          <div className="space-y-5 ">
            {categories.map((c, index) => (
              <CategoryItem key={c.name} category={c} />
            ))}
          </div>
        </div>
        <div className="w-full flex justify-start items-start">
          <GetNotes userId={user.$id} />
        </div>
      </section>
    </aside>
  );
};

export default RightSideBar;
