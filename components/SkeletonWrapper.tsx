import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

function SkeletonWrapper({children,isLoading,fullWidth,}: {
  children: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
}) {
if (!isLoading) {
  return <>{children}</>; // ✅ always valid JSX
}

  return (
    <div>
      <Skeleton className={cn(fullWidth && "w-full")}>
        <div className="opacity-0">{children}</div>
      </Skeleton>
    </div>
  );
}
export default SkeletonWrapper;
