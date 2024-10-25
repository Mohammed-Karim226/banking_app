import { HeaderBoxProps } from "@/src/types";

const MainHeader = async ({
  type = "title",
  title,
  subtext,
  user,
}: HeaderBoxProps) => {
  return (
    <div className="flex flex-col justify-start items-start gap-1">
      <h1 className="header-box-title dark:text-slate-400">
        {title}
        {type === "greeting" && (
          <span className="text-bankGradient capitalize dark:text-slate-600">
            &nbsp;{user ?? ""}
          </span>
        )}
      </h1>
      <p className="header-box-subtext dark:text-slate-400">{subtext}</p>
    </div>
  );
};

export default MainHeader;
