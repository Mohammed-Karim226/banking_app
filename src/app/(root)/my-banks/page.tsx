import MyBanksPage from "@/src/components/MyBanks/MyBanksPage";
import { SearchParamProps } from "@/src/types";

const MyBanks = ({ params, searchParams }: SearchParamProps) => {
  return <MyBanksPage params={params} searchParams={searchParams} />;
};

export default MyBanks;
