import TransactionHistoryPage from "@/src/components/TransactionHistory/TransactionHistoryPage";
import { SearchParamProps } from "@/src/types";

const TransactionHistory = ({ params, searchParams }: SearchParamProps) => {
  return <TransactionHistoryPage params={params} searchParams={searchParams} />;
};
export default TransactionHistory;
