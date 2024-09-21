import MobileNavBar from "@/src/components/Layouts/MobileNavBar/MobileNavBar";
import SideBar from "@/src/components/Layouts/SideBar/SideBar";
import { getLoggedInUser } from "@/src/utils/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userInfo = await getLoggedInUser();

  if (!userInfo) redirect("/sign-in");

  return (
    <main className="flex w-full h-screen font-inter">
      <SideBar user={userInfo} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src={"/icons/logo.png"} width={30} height={30} alt="logo" />
          <div>
            <MobileNavBar user={userInfo} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
