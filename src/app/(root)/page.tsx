import MainHeader from "@/src/components/Layouts/MainHeader/MainHeader";
import RightSideBar from "@/src/components/Layouts/RightSideBar/RightSideBar";
import RecentTransactions from "@/src/components/RecentTransactions/RecentTransactions";
import CreateNote from "@/src/components/Reusable/Notes/CreateNote";
import TotalBalanceBox from "@/src/components/TotalBalanceBox/TotalBalanceBox";
import { SearchParamProps } from "@/src/types";
import { getAccount, getAccounts } from "@/src/utils/actions/bank.actions";
import { getLoggedInUser } from "@/src/utils/actions/user.actions";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;

  const userInfo = await getLoggedInUser();

  const accounts = await getAccounts({
    userId: userInfo?.$id,
  });

  if (!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  return (
    <section className="home dark:bg-neutral-500">
      <div className="home-content">
        <header className="home-header">
          <MainHeader
            type="greeting"
            user={`${userInfo?.firstName} ${userInfo?.lastName}` ?? "Guest"}
            subtext="Access & manage your account and transactions efficiently."
            title="Welcome"
          />
          <div className="w-full flex items-center justify-end">
            <CreateNote userId={userInfo?.$id} />
          </div>
          <TotalBalanceBox
            accounts={accountsData ?? []}
            totalCurrentBalance={accounts?.totalCurrentBalance ?? 0}
            totalBanks={accounts?.totalBanks ?? 0}
          />
        </header>
        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
          userId={userInfo?.$id}
        />
      </div>
      <RightSideBar
        user={userInfo}
        transactions={account?.transactions ?? 0}
        banks={accountsData?.slice(0, 2) ?? []}
      />
    </section>
  );
};

export default Home;
