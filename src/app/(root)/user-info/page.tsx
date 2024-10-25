import UserInfo from "@/src/components/Auth/UserInfo/UserInfo";
import { SearchParamProps } from "@/src/types";
import { getLoggedInUser } from "@/src/utils/actions/user.actions";

const page = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const userInfo = await getLoggedInUser();

  return (
    <section className="flex flex-col justify-center items-center">
      <UserInfo info={userInfo} />
    </section>
  );
};

export default page;
