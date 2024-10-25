"use client";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { SiderbarProps } from "@/src/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAccount } from "@/src/utils/actions/user.actions";

import PlaidLink from "../../Auth/SignUp/PlaidLink";
import { Button } from "../../ui/button";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { SidebarLinks } from "@/src/constants";
import { NotificationsDropdown } from "../../Notifications/Notifications";

const SideBar = ({ user }: SiderbarProps) => {
  const [open, setOpen] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const logout = await logoutAccount();
    if (logout) {
      router.push(`/sign-in`);
    }
  };
  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };
  const { setTheme } = useTheme();
  return (
    <section
      className={cn(
        "sidebar dark:bg-stone-400 !transition-all !duration-500",

        {
          "!w-[100px]": !open,
        }
      )}
    >
      <nav className="flex flex-col gap-4">
        <div className="w-full flex justify-betweeen items-center relative">
          <Link
            href={"#"}
            className="mb-12 flex justify-start items-center cursor-pointer gap-2"
          >
            <Image src={"/icons/logo.png"} alt="logo" width={40} height={40} />
            <h1
              className={cn("sidebar-logo dark:text-slate-600", {
                hidden: !open,
              })}
            >
              NexPay
            </h1>
          </Link>

          <Button
            className={cn(
              " absolute right-[-45px] top-1  z-10 text-white dark:text-slate-600",
              open ? "rotate-90" : "-rotate-90 right-[-56px]"
            )}
            onClick={toggleSidebar}
          >
            <Image
              src={"/icons/arrow-down.png"}
              alt="arrow"
              width={20}
              height={20}
              className="dark:text-gray-500 z-50"
            />
          </Button>
        </div>
        {SidebarLinks.map((link, idx) => {
          const isActive =
            pathname === link?.route || pathname.startsWith(`${link.route}/`);
          return (
            <Link
              href={link.route}
              key={idx}
              className={cn("sidebar-link", {
                "bg-bank-gradient": isActive,
                "dark:bg-gray-300": isActive,
              })}
            >
              <div className="size-6 relative">
                <Image
                  src={link.imgURL}
                  alt="link"
                  fill
                  className={cn({
                    "brightness-[3] invert-0 dark:brightness-150": isActive,
                  })}
                />
              </div>
              <p
                className={cn(
                  "sidebar-label dark:text-slate-700 transition-opacity duration-700",
                  {
                    "!text-white dark:!text-slate-600": isActive,
                    "opacity-100": open,
                    "opacity-0 hidden": !open,
                  }
                )}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
        <PlaidLink user={user} isOpen={open} />
        <NotificationsDropdown open={open} />
      </nav>
      <footer className="flex pt-4 border-t-2 border-slate-300 dark:border-slate-600 justify-center items-center gap-2 ">
        <div className="flex justify-center items-center size-10 overflow-hidden rounded-full  bg-slate-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="overflow-hidden">
                <Image
                  src={"/icons/avatar-svgrepo-com.svg"}
                  alt="user"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white translate-x-6 dark:bg-stone-500 dark:border-transparent"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden text-base
                    font-semibold w-full dark:border-stone-800 dark:text-slate-700"
                  >
                    Dark Mode
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white mb-1 dark:border-slate-700 translate-x-1 dark:bg-gray-400"
                >
                  <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="cursor-pointer dark:text-gray-800 "
                  >
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="cursor-pointer dark:text-gray-800"
                  >
                    Dark
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* second */}
              <Link
                href={"/user-info"}
                className="flex justify-center rounded-md items-center border text-base mt-1 p-2 dark:border-stone-800 dark:text-slate-700 font-semibold"
              >
                View Profile
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          className={cn("flex flex-col justify-start items-start gap-[1px]", {
            hidden: !open,
          })}
        >
          <h2 className="capitalize text-slate-700 text-sm font-semibold">
            {user?.name ?? "User Name"}
          </h2>
          <p className="text-slate-600 text-sm font-normal">
            {user?.email ?? "UserEmail@io.com"}
          </p>
        </div>
        <div
          className={cn("flex size-9 justify-center items-center", {
            hidden: !open,
          })}
        >
          <button onClick={handleLogout}>
            <Image
              src={"/icons/logout.svg"}
              alt="user"
              width={25}
              height={25}
              className="rounded-full"
            />
          </button>
        </div>
      </footer>
    </section>
  );
};

export default SideBar;
