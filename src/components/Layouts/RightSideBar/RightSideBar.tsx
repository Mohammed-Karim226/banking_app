"use client";
import { cn } from "@/lib/utils";
import { RightSidebarProps } from "@/src/types";
import { AddSquare } from "iconsax-react";
import Link from "next/link";
import BankCard from "../../BankCard/BankCard";
import { motion } from "framer-motion";
import { FaShieldAlt, FaStar, FaGem } from "react-icons/fa";

const RightSideBar = ({ user, transactions, banks }: RightSidebarProps) => {
  return (
    <aside className={cn("right-sidebar")}>
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <motion.div
            initial={{ opacity: 0, translateX: -100 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 1 }}
            exit={{ opacity: 0, translateX: -100 }}
            className="profile-img"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              exit={{ opacity: 0 }}
              className="text-5xl text-blue-500 font-bold"
            >
              {user?.name[0]}
            </motion.span>
          </motion.div>
          <div className="profile-details">
            <motion.h1
              initial={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 1 }}
              className="profile-name"
            >
              {user?.name ?? ""}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 1 }}
              className="profile-email"
            >
              {user?.email}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className={cn(
                "text-sm font-medium uppercase flex items-center justify-center px-2 py-[2px] rounded-md", // Base styling
                user?.labels[0] === "admin"
                  ? "bg-red-100 text-red-600 border-l-2 border-red-500" // Admin styling
                  : user?.labels[0] === "mvp"
                  ? "bg-blue-100 text-blue-600 border-l-2 border-blue-500" // MVB styling
                  : user?.labels[0] === "premium"
                  ? "bg-yellow-100 text-yellow-600 border-l-2 border-yellow-500" // Premium styling
                  : "bg-gray-100 text-slate-600" // Default styling for regular users
              )}
            >
              {user?.labels[0] === "admin" && (
                <FaShieldAlt className="w-4 h-4 mr-1" /> // Admin icon
              )}
              {user?.labels[0] === "mvp" && (
                <FaStar className="w-4 h-4 mr-1" /> // MVB icon
              )}
              {user?.labels[0] === "premium" && (
                <FaGem className="w-4 h-4 mr-1" /> // Premium icon
              )}
              {user?.labels[0] ?? "UserEmail@io.com"}
            </motion.p>
          </div>
        </div>
      </section>
      <section className="banks">
        <div className="w-full flex justify-between">
          <motion.h1
            initial={{ opacity: 0, translateX: -100 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 1 }}
            className="header-2"
          >
            My Banks
          </motion.h1>
          <Link href={"/"} className="flex gap-1 justify-center items-center">
            <motion.div
              initial={{ opacity: 0, translateX: 100 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ duration: 1 }}
              className="flex gap-1 justify-center items-center"
            >
              <AddSquare size="20" color="#475467" />{" "}
              <h2 className="text-16 text-gray-600 font-semibold">Add Bank</h2>
            </motion.div>
          </Link>
        </div>
        {banks?.length > 0 && (
          <div className="relative flex flex-col justify-center items-center gap-5 flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="z-10 relative "
            >
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user?.name ?? ""}`}
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
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user?.name ?? ""}`}
                  showBalance={false}
                />
              </motion.div>
            )}
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSideBar;
