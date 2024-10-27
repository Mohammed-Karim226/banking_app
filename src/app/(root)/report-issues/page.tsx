import ReportIssues from "@/src/components/ReportIssues/ReportIssues";
import { getIssue, getLoggedInUser } from "@/src/utils/actions/user.actions";

const page = async () => {
  const userInfo = await getLoggedInUser();
  const issues = await getIssue({ userId: userInfo?.$id ?? "" });

  return <ReportIssues issues={issues} />;
};

export default page;
