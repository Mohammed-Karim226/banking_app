import MainHeader from "../Layouts/MainHeader/MainHeader";
import PaymentTransferForm from "./PaymentTransferForm";
import { getLoggedInUser } from "@/src/utils/actions/user.actions";
import { getAccounts } from "@/src/utils/actions/bank.actions";

const TransferPage = async () => {
  const userInfo = await getLoggedInUser();
  const accounts = await getAccounts({
    userId: userInfo?.$id ?? "",
  });

  if (!accounts) return;

  const accountsData = accounts?.data;

  return (
    <section className="payment-transfer dark:bg-neutral-600">
      <MainHeader
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />
      <section className="size-full">
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  );
};

export default TransferPage;
