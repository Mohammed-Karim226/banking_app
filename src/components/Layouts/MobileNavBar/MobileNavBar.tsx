"use client";
import { SiderbarProps } from "@/src/types";

import { SheetTrigger, SheetContent, Sheet, SheetFooter } from "../../ui/sheet";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import Image from "next/image";
import { SidebarLinks } from "@/src/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logoutAccount } from "@/src/utils/actions/user.actions";
import { Button } from "../../ui/button";
import { NotificationsDropdown } from "../../Notifications/Notifications";
import PlaidLink from "../../Auth/SignUp/PlaidLink";

const MobileNavBar = ({ user }: SiderbarProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { setTheme } = useTheme();

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
    <section className="w-full max-w-[264px] ">
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
          className="border-none dark:bg-stone-400 bg-white flex flex-col justify-between"
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
              <h1 className="text-26 font-medium dark:text-slate-600">
                NexPay
              </h1>
            </Link>
            {SidebarLinks.map((link, idx) => {
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
                        "brightness-[3] invert-0 dark:brightness-150": isActive,
                      })}
                    />
                  </div>
                  <p
                    className={cn(
                      "text-16 dark:text-slate-700 font-semibold text-black-2",
                      {
                        "text-white": isActive,
                      }
                    )}
                  >
                    {link.label}
                  </p>
                </Link>
              );
            })}
            <PlaidLink user={user} isOpen={open} />
            <NotificationsDropdown />
          </div>
          <SheetFooter>
            <footer className="flex pt-4 border-t-2 dark:border-slate-600 border-slate-100 justify-center items-center gap-3">
              <div className="flex justify-center items-center size-10 overflow-hidden rounded-full bg-slate-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="overflow-hidden"
                    >
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
                          className="overflow-hidden w-full dark:border-stone-800 dark:text-slate-700"
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
                        <DropdownMenuItem
                          onClick={() => setTheme("system")}
                          className="cursor-pointer dark:text-gray-800"
                        >
                          System
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* second */}
                    <Link
                      href={"/user-info"}
                      className="flex justify-center rounded-md items-center border mt-1 p-2 dark:border-stone-800 dark:text-slate-700 font-normal"
                    >
                      View Profile
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col justify-start items-start gap-[1px]">
                <h2 className="text-slate-700 text-sm font-semibold">
                  {`${user?.firstName} ${user?.lastName}` ?? "User Name"}
                </h2>
                <p className="text-slate-600 text-sm font-normal">
                  {user?.email ?? "UserEmail@io.com"}
                </p>
              </div>
              <div className="flex size-9 justify-center items-center">
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
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNavBar;
