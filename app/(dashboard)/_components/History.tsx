"use client";
import { Period, Timeframe } from "@/lib/TransactionType";
import { UserSetting } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import { GetFormatterForCurrency } from "../../../lib/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HistoryperiodSelector from "./HistoryperiodSelector";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

const History = ({ userSettings }: { userSettings: UserSetting }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeroid] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);
  //
  ///
  const historyDataQuery = useQuery({
    queryKey: ["overview", "history", timeframe, period],
    queryFn: () =>
      fetch(
        `api/history-data?timeframe=${timeframe}&year=${period.year}&month=${period.month}`
      ).then((res) => res.json()),
  });
  const dataAvailable =Array.isArray(historyDataQuery.data) && historyDataQuery.data.length > 0;
  return (
    <div className="container">
      <h2 className="mt-12 text-3xl font-bold">History</h2>
      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryperiodSelector
              period={period}
              setPeriod={setPeroid}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />
            <div className="flex h-10 gap-2">
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                Income
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Here's a breakdown of the chart components: 
         > BarChart: This is the main
          component that renders the chart. 
         >CartesianGrid: This component
          renders the grid lines on the chart. 
        
        > XAxis and YAxis: These components
          render the x-axis and y-axis labels and lines. 
         > Bar: This component
          renders the bars for the income and expense data. Tooltip: This
          component renders a tooltip that displays additional information when
          a bar is hovered. */}
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable && (
              <ResponsiveContainer width={"100%"} height={300}>
                <BarChart
                  height={300}
                  data={historyDataQuery.data}
                  barCategoryGap={5}
                >
                  <defs>
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset={"0"}
                        stopColor="#10b981"
                        stopOpacity={"1"}
                      />
                      <stop
                        offset={"1"}
                        stopColor="#10b981"
                        stopOpacity={"0"}
                      />
                    </linearGradient>
                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset={"0"}
                        stopColor="#ef4444"
                        stopOpacity={"1"}
                      />
                      <stop
                        offset={"1"}
                        stopColor="#ef4444"
                        stopOpacity={"0"}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="5 5"
                    strokeOpacity={"0.2"}
                    vertical={false}
                  />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      //?The toLocaleString() method is used to format a date object into
                      //a string according to the locale and options provided.
                      //? In this case, month:"long" means that the month should be displayed
                      // in its full name (e.g., "January", "February", etc.).
                      //?So, when timeframe === "year", this statement returns the month name
                      // in its full form, without the day or year.
                      //Example Output:
                      //If the date is January 1, 2022, the output would be "January".
                      //?So, when timeframe !== "year", this statement returns the day of the month as a two-digit number, without the month or year.

                      // Example Output:

                      // If the date is January 1, 2022, the output would be "01".
                      // If the date is January 12, 2022, the output would be "12".
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeframe === "year") {
                        return date.toLocaleString("default", {
                          month: "long",
                        });
                      }
                      return date.toLocaleString("default", {
                        day: "2-digit",
                      });
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey={"income"}
                    label="Income"
                    fill="url(#incomeBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Bar
                    dataKey={"expense"}
                    label="Expense"
                    fill="url(#expenseBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => (
                      <CustomTooltip formatter={formatter} {...props} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
            {!dataAvailable && (
              <Card className="flex h-[300px] flex-col items-center justify-center bg-background p-2">
                No data for the selected period
                <p className="text-sm text-muted-foreground">
                  Try selecting a different period or adding new transaction
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
//? The active and payload props are built-in props that are provided by the Recharts library.
// When you use the Tooltip component in Recharts, it automatically passes these props to the custom tooltip component.
//When the CustomTooltip function is called, it receives the payload prop, which is an array of objects. The function then accesses the first object in the array using payload[0], and then accesses the payload property of that object using payload[0].payload.
//? The payload property of the object is an object that contains the actual data for the tooltip.
//  In this case, the data is an object with two properties: expense and income.
function CustomTooltip({ active, payload, formatter }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  const { expense, income } = data;
  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      <TooltipArrow
        formatter={formatter}
        label="Expense"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />
      <TooltipArrow
        formatter={formatter}
        label="Income"
        value={income}
        bgColor="bg-emerald-500"
        textColor="text-emerald-500"
      />
      <TooltipArrow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor="bg-gray-100"
        textColor="text-foreground"
      />
    </div>
  );
}

function TooltipArrow({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
  formatter: Intl.NumberFormat;
}) {
  const formattingFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );
  return (
    <div className="flex itmes-center gap-2">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            formattingFn={formattingFn}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
