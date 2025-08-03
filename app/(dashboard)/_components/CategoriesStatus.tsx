"use client";

import { GetCategoriesStatusResponseType } from "@/app/api/status/categoriesforstatus/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { TransactionType } from "@/lib/TransactionType";
import { UserSetting } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
interface Props {
  from: Date;
  to: Date;
  userSettings: UserSetting;
}
const CategoriesStatus = ({ from, to, userSettings }: Props) => {
  const statusQuery = useQuery<GetCategoriesStatusResponseType>({
    queryKey: ["overview", "status", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/status/categoriesforstatus?from=${DateToUTCDate(
          from
        )}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });
  const Formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statusQuery.isFetching}>
        <Categoriescard
          formatter={Formatter}
          type="income"
          data={statusQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statusQuery.isFetching}>
        <Categoriescard
          formatter={Formatter}
          type="expense"
          data={statusQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};
export default CategoriesStatus;

function Categoriescard({
  formatter,
  type,
  data,
}: {
  formatter: Intl.NumberFormat;
  type: TransactionType;
  data: GetCategoriesStatusResponseType;
}) {
  const dataArray = Array.isArray(data) ? data : [data]; // Ensure data is an array
  const filtredeData = dataArray.filter((el) => el.type === type);
  const total = filtredeData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );
  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle
          className="grid grid-flow-row justify-between 
        gap-2 text-muted-foreground md:grid-flow-col"
        >
          {type === "income" ? "Income" : "Expense"}
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-center gap-2">
        {filtredeData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            No data fro the Selecetd period
            <p className="text-sm text-muted-foreground">
              Try selecting a different period or try adding new
              {type === "income" ? "incomes" : "expense"}
            </p>
          </div>
        )}
        {filtredeData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filtredeData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);
                return (
                  <div key={item.category} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-400">
                        {item.categoryIcon} {item.category}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatter.format(amount)}
                      </span>
                    </div>

                <Progress
                value={percentage}
                indictor={type === "income" ? "bg-emerald-500" : "bg-red-500"}
                />

                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
