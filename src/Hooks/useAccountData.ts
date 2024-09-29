import { useEffect, useState } from "react";
import { SearchParamProps, TErrorResponse } from "../types";
import { getLoggedInUser } from "../utils/actions/user.actions";
import { getAccount, getAccounts } from "../utils/actions/bank.actions";

const useAccountData = ({ id, page }: SearchParamProps["searchParams"]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [userInfo, setUserInfo] = useState(null);
  const [accountsData, setAccountsData] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCurrentPage(Number(page) || 1);

        const user = await getLoggedInUser();
        setUserInfo(user);

        if (!user) return;

        const accounts = await getAccounts({ userId: user?.$id });

        if (!accounts) return;

        const accountsList = accounts?.data;
        setAccountsData(accountsList);

        const appwriteItemId = id || accountsList[0].appwriteItemId;
        const accountDetails = await getAccount({ appwriteItemId });
        setAccount(accountDetails);
      } catch (error) {
        const err = error as TErrorResponse;
        throw err.message;
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, page]);
  return { currentPage, userInfo, accountsData, account, loading };
};

export default useAccountData;
