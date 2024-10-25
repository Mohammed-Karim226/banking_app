import { SearchParamProps } from "@/src/types";
import { getLoggedInUser } from "@/src/utils/actions/user.actions";
import { getAccount, getAccounts } from "@/src/utils/actions/bank.actions";
import Pagination from "../ui/Pagination";
import TransactionsTable from "../RecentTransactions/TransactionsTable";
import { formatAmount } from "@/lib/utils";
import MainHeader from "../Layouts/MainHeader/MainHeader";

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
  const currentPage = Number(page) || 1;

  const userInfo = await getLoggedInUser();
  const accounts = await getAccounts({ userId: userInfo?.$id });

  if (!accounts) return null;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  const rowPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowPerPage);
  const indexOfLastTransaction = currentPage * rowPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowPerPage;
  const currentTransactions = account?.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <section className="transactions dark:bg-neutral-600">
      <div className="transactions-header">
        <MainHeader
          title="Transaction History"
          subtext="Gain Insights and Track Your Transactions Over Time"
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account dark:bg-neutral-500 dark:!border-neutral-800">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white dark:text-slate-600">
              {account?.data?.name}
            </h2>
            <p className="text-14 text-blue-25 dark:text-slate-600">
              {account?.data?.officialName}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white dark:text-slate-600">
              ●●●● ●●●● ●●●●{" "}
              <span className="text-16 dark:text-slate-600">
                {account?.data.mask}
              </span>
            </p>
          </div>

          <div className="transactions-account-balance">
            <p className="text-14 dark:text-slate-600">Current Balance</p>
            <p className="text-24 text-center font-bold dark:text-slate-600">
              {formatAmount(account?.data?.currentBalance)}
            </p>
          </div>
        </div>

        <section className="flex flex-col gap-6 w-full">
          <TransactionsTable
            history={true}
            transactions={currentTransactions}
          />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default TransactionHistoryPage;
