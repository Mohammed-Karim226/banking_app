"use client";
import { sidebarLinks } from "@/src/constants";
import { cn } from "@/lib/utils";
import { SiderbarProps } from "@/src/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAccount } from "@/src/utils/actions/user.actions";
import { motion } from "framer-motion";
import { FaShieldAlt, FaStar, FaGem } from "react-icons/fa";

const SideBar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
    const logout = await logoutAccount();
    if (logout) {
      router.push("/sign-in");
    }
  };
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link
          href={"#"}
          className="mb-12 flex justify-start items-center cursor-pointer gap-2"
        >
          <Image src={"/icons/logo.png"} alt="logo" width={34} height={34} />
          <h1 className="sidebar-logo">Bank_Logo</h1>
        </Link>
        {sidebarLinks.map((link, idx) => {
          const isActive =
            pathname === link?.route || pathname.startsWith(`${link.route}/`);
          return (
            <Link
              href={link.route}
              key={idx}
              className={cn("sidebar-link", {
                "bg-bank-gradient": isActive,
              })}
            >
              <div className="size-6 relative">
                <Image
                  src={link.imgURL}
                  alt="link"
                  fill
                  className={cn({
                    "brightness-[3] invert-0": isActive,
                  })}
                />
              </div>
              <p
                className={cn("sidebar-label", {
                  "!text-white": isActive,
                })}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
        UserInfo
      </nav>
      <footer className="flex pt-4 border-t-2 border-slate-100 justify-center items-center gap-2">
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
              "text-xs font-medium uppercase  flex mt-[1px] items-center justify-center px-1 py-[1px] rounded-md", // Base styling
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
