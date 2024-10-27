import { Account, SearchParamProps } from "@/src/types";
import MainHeader from "../Layouts/MainHeader/MainHeader";
import { getLoggedInUser } from "@/src/utils/actions/user.actions";
import { getAccount, getAccounts } from "@/src/utils/actions/bank.actions";
import BankCard from "../BankCard/BankCard";
import { formatAmount } from "@/lib/utils";

const MyBanksPage = async ({ searchParams }: SearchParamProps) => {
  const id = Array.isArray(searchParams.id)
    ? searchParams.id[0]
    : searchParams.id;

  const userInfo = await getLoggedInUser();
  const accounts = await getAccounts({
    userId: userInfo?.$id ?? "",
  });

  if (!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;

  return (
    <section className="flex">
      <div className="my-banks dark:bg-neutral-600">
        <MainHeader
          title="My Bank Accounts"
          subtext="Effortlessly Manage Your Banking Activities."
        />
        <div className="space-y-4">
          <h2 className="header-2 dark:text-neutral-800">Your Cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts &&
              accounts.data.map((account: Account) => {
                const balancePercentage = Math.min(
                  (account.availableBalance / 10000) * 100,
                  100
                );

                return (
                  <div className="flex flex-col gap-2" key={account.id}>
                    <BankCard
                      account={account}
                      userName={userInfo?.firstName}
                    />
                    <div className="flex justify-between items-center w-full">
                      <p className="text-slate-700 text-sm font-medium dark:text-neutral-900">
                        Spending this month
                      </p>
                      <p className="text-slate-600 text-sm font-normal dark:text-neutral-800">
                        {formatAmount(account.availableBalance)}
                      </p>
                    </div>
                    <div className="flex overflow-hidden rounded-xl bg-slate-100 justify-start items-center w-full">
                      <span
                        className="block h-2 bg-blue-500"
                        style={{ width: `${balancePercentage}%` }}
                      ></span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBanksPage;
