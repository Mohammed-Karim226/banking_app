"use client";
import { SiderbarProps } from "@/src/types";

import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
  SheetFooter,
} from "../../ui/sheet";
import Image from "next/image";
import { sidebarLinks } from "@/src/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logoutAccount } from "@/src/utils/actions/user.actions";
import { motion } from "framer-motion";
import { FaShieldAlt, FaStar, FaGem } from "react-icons/fa";

const MobileNavBar = ({ user }: SiderbarProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const logout = await logoutAccount();
    if (logout) {
      router.push("/sign-in");
    }
  };
  const handleSheetClose = () => {
    setOpen(false);
  };
  return (
    <section className="w-full max-w-[264px]">
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger>
          <Image
            src={"/icons/hamburger.svg"}
            alt="menu icon"
            width={30}
            height={30}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent
          side={"left"}
          className="border-none bg-white flex flex-col justify-between"
        >
          <div>
            <Link
              href={"#"}
              className="mb-12 flex justify-start items-center cursor-pointer gap-2"
            >
              <Image
                src={"/icons/logo.png"}
                alt="logo"
                width={34}
                height={34}
              />
              <h1 className="text-26 font-medium">Bank_Logo</h1>
            </Link>
            {sidebarLinks.map((link, idx) => {
              const isActive =
                pathname === link?.route ||
                pathname.startsWith(`${link.route}/`);
              return (
                <Link
                  href={link.route}
                  key={idx}
                  className={cn("w-full mobilenav-sheet_close", {
                    "bg-bank-gradient": isActive,
                  })}
                  onClick={handleSheetClose}
                >
                  <div className="size-6 relative">
                    <Image
                      src={link.imgURL}
                      alt="link"
                      width={20}
                      height={20}
                      className={cn({
                        "brightness-[3] invert-0": isActive,
                      })}
                    />
                  </div>
                  <p
                    className={cn("text-16 font-semibold text-black-2", {
                      "text-white": isActive,
                    })}
                  >
                    {link.label}
                  </p>
                </Link>
              );
            })}
          </div>
          <SheetFooter>
            <footer className="flex pt-4 border-t-2 border-slate-100 justify-center items-center gap-3">
              <div className="flex justify-center items-center size-10 overflow-hidden rounded-full bg-slate-100">
                <Image
                  src={"/icons/avatar-svgrepo-com.svg"}
                  alt="user"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col justify-start items-start gap-[1px]">
                <h2 className="text-slate-700 text-sm font-semibold">
                  {user?.name ?? "User Name"}
                </h2>
                <p className="text-slate-600 text-sm font-normal">
                  {user?.email ?? "UserEmail@io.com"}
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  className={cn(
                    "text-xs font-normal flex mt-[1px] items-center justify-center px-1 py-[1px] rounded-md", // Base styling
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
                    <FaShieldAlt className="w-2 h-2 mr-1" /> // Admin icon
                  )}
                  {user?.labels[0] === "mvp" && (
                    <FaStar className="w-2 h-2 mr-1" /> // MVB icon
                  )}
                  {user?.labels[0] === "premium" && (
                    <FaGem className="w-2 h-2 mr-1" /> // Premium icon
                  )}
                  {user?.labels[0] ?? "UserEmail@io.com"}
                </motion.p>
              </div>
              <div className="flex size-9 justify-center items-center">
                <button onClick={handleLogout}>
                  <Image
                    src={"/icons/logout.svg"}
                    alt="user"
                    width={15}
                    height={15}
                    className="rounded-full"
                  />
                </button>
              </div>
            </footer>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNavBar;
