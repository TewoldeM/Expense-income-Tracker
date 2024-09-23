"use client";
import { GetBalanceStatusResponseType } from "@/app/api/status/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSetting } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpDown, ArrowUpLeft, ArrowUpRight, SquareArrowDownLeft, SquareArrowUpRight, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup";
interface Props {
  from: Date;
  to: Date;
  userSettings: UserSetting;
}
// The Statuscards function is the main component that renders a set of status cards.
// It's a container component that fetches data from an API and renders three status 
//cards: Income, Expense, and Balance.

//Here's a high-level overview of what the Statuscards function does:

// It fetches data from an API using the useQuery hook from react-query.
// It extracts the income, expense, and balance values from the API response.
// It renders three status cards using the StatusCard component.
// It passes the formatter, value, title, and icon as props to each StatusCard component.
function Statuscards({ from, to, userSettings }: Props) {
  const statusQuery = useQuery<GetBalanceStatusResponseType>({
    queryKey: ["overview", "status", from, to],
    queryFn: () =>
      fetch(
        `/api/status/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);
  const income = statusQuery.data?.income || 0;
  const expense = statusQuery.data?.expense || 0;
  const balance = income - expense;
  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <div className="flex justify-center items-center">
        <div className="flex gap-8 md:gap-32 md:flex-row flex-col justify-center items-center p-2 mb-2">
          <SkeletonWrapper isLoading={statusQuery.isFetching}>
            <StatusCard
              formatter={formatter}
              value={income}
              title="Income"
              icon={
                <SquareArrowUpRight className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
              }
            />
          </SkeletonWrapper>
          <SkeletonWrapper isLoading={statusQuery.isFetching}>
            <StatusCard
              formatter={formatter}
              value={expense}
              title=" Expense"
              icon={
                <SquareArrowDownLeft className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
              }
            />
          </SkeletonWrapper>

          <SkeletonWrapper isLoading={statusQuery.isFetching}>
            <StatusCard
              formatter={formatter}
              value={balance}
              title="Balance"
              icon={
                <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
              }
            />
          </SkeletonWrapper>
        </div>
      </div>
    </div>
  );
}
export default Statuscards;

//The StatusCard function uses the CountUp component from react-countup to animate the value. 
//It also uses the formatter prop to format the value as a currency string.
//? Here's a high-level overview of what the StatusCard function does:
// It takes in props from the Statuscards component, including the formatter, value, title, and icon.
// It renders a card with the icon, title, and value.
// It uses the CountUp component to animate the value.
// It uses the formatter prop to format the value as a currency string.
function StatusCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  title: String;
  icon: ReactNode;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-4 p-12">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
