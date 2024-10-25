"use client";

import { TotlaBalanceBoxProps } from "@/src/types";
import CountUp from "react-countup";
import DoughnutChart from "./DoughnutChart";

const TotalBalanceBox = ({
  accounts = [],
  totalCurrentBalance,
  totalBanks,
}: TotlaBalanceBoxProps) => {
  return (
    <section className="total-balance dark:!border-slate-600">
      <div className="total-balance-chart">
        <DoughnutChart accounts={accounts} />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2 dark:text-slate-600">
          Bank Accounts: {totalBanks!}
        </h2>
        <div className="flex flex-col gap-1">
          <p className="total-balance-label dark:text-slate-600">
            Total Current Balance
          </p>
          <p className="total-balance-amount dark:text-slate-700">
            <CountUp
              start={0}
              end={totalCurrentBalance}
              duration={2.5}
              decimals={2}
              prefix="$"
            />
          </p>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
