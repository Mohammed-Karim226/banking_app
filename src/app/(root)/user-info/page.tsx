import UserInfo from "@/src/components/Auth/UserInfo/UserInfo";
import { getLoggedInUser } from "@/src/utils/actions/user.actions";

const page = async () => {
  const userInfo = await getLoggedInUser();

  return (
    <section className="flex flex-col justify-center items-center">
      {userInfo ? (
        <UserInfo info={userInfo} />
      ) : (
        <p>Loading user information...</p>
      )}
    </section>
  );
};

export default page;
