"use client";

import Image from "next/image";

import { topCategoryStyles } from "@/src/constants";
import { CategoryProps } from "@/src/types";
import { Progress } from "../../ui/progress";
import { cn, formatAmount } from "@/lib/utils";

const CategoryItem = ({ category }: CategoryProps) => {
  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
    icon,
  } = topCategoryStyles[category?.name as keyof typeof topCategoryStyles] ||
  topCategoryStyles.default;

  return (
    <div className={cn("flex p-4 rounded-xl gap-3", bg)}>
      <figure className={cn("flex-center size-10 rounded-full", circleBg)}>
        <Image src={icon} width={20} height={20} alt={category.name} />
      </figure>
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-center">
          <h2 className={cn("text-sm font-medium", main)}>{category?.name}</h2>
          <h3 className={cn("text-sm font-normal", count)}>
            {formatAmount(category?.count)}
          </h3>
        </div>
        <Progress
          value={(category.count / category.totalCount) * 100}
          className={cn("h-2 w-full", progressBg)}
          indicatorClassName={cn("h-2 w-full", indicator)}
        />
      </div>
    </div>
  );
};

export default CategoryItem;
