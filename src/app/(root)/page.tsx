import MainHeader from "@/src/components/Layouts/MainHeader/MainHeader";
import RightSideBar from "@/src/components/Layouts/RightSideBar/RightSideBar";
import TotalBalanceBox from "@/src/components/TotalBalanceBox/TotalBalanceBox";
import { getLoggedInUser } from "@/src/utils/actions/user.actions";
import React from "react";

const Home = async () => {
  const userInfo = await getLoggedInUser();
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <MainHeader
            type="greeting"
            user={userInfo?.name ?? "Guest"}
            subtext="Access & manage your account and transactions efficiently."
            title="Welcome"
          />
          <TotalBalanceBox
            accounts={[]}
            totalCurrentBalance={1250.611}
            totalBanks={1}
          />
        </header>
      </div>
      <RightSideBar user={userInfo} transactions={[]} banks={[{}, {}]} />
    </section>
  );
};

export default Home;
