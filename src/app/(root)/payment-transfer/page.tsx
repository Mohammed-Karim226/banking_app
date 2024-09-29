import TransferPage from "@/src/components/TransferPage/TransferPage";
import { SearchParamProps } from "@/src/types";

const PaymentTransfer = ({ params, searchParams }: SearchParamProps) => {
  return <TransferPage params={params} searchParams={searchParams} />;
};

export default PaymentTransfer;
