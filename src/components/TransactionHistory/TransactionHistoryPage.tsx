import { SearchParamProps } from "@/src/types";
import MainHeader from "../Layouts/MainHeader/MainHeader";
import { getLoggedInUser } from "@/src/utils/actions/user.actions";
import { getAccount, getAccounts } from "@/src/utils/actions/bank.actions";
import { formatAmount } from "@/lib/utils";
import TransactionsTable from "../RecentTransactions/TransactionsTable";

const TransactionHistoryPage = async ({
  params,
  searchParams,
}: SearchParamProps) => {
  const id = Array.isArray(searchParams.id)
    ? searchParams.id[0]
    : searchParams.id;
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;

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
    <section className="transactions">
      <div className="transactions-header">
        <MainHeader
          title="Transaction History"
          subtext="Gain Insights and Track Your Transactions Over Time"
        />
      </div>
      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.data?.name}
            </h2>
            <p className="text-14 text-blue-25">
              {account?.data?.officialName}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●●{" "}
              <span className="text-16">{account?.data.mask}</span>
            </p>
          </div>
          <div className="transactions-account-balance">
            <p className="text-14">Current Balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(account?.data?.currentBalance)}
            </p>
          </div>
        </div>
        <section className="flex flex-col gap-6 w-full">
          <TransactionsTable transactions={account?.transactions} />
        </section>
      </div>
    </section>
  );
};

export default TransactionHistoryPage;
