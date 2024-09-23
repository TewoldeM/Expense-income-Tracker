import prisma from "@/lib/prisma";
import { Period, Timeframe } from "@/lib/TransactionType";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { tree } from "next/dist/build/templates/app-page";
import { redirect } from "next/navigation";
import { z } from "zod";
// z.coerce is used to transform the input data into a specific type,
//while also performing validation
//z.coerce.number(): This tells Zod to attempt to convert the input value to a number.
// If the input value is a string that can be parsed as a number (e.g., "2022"), Zod will convert it to a number (2022)
const getHistoryDateSchema = z.object({
  timeframe: z.enum(["month", "year"]),
  year: z.coerce.number().min(2000),
  month: z.coerce.number().min(0).max(11),
});

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe");
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const queryParams = getHistoryDateSchema.safeParse({
    timeframe,
    year,
    month,
  });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 });
  }
  const data = await getHistoryData(user.id, queryParams.data.timeframe, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });
  //getHistoryData(user.id, queryParams.data.timeframe, queryParams.data.month, queryParams.data.year)
  //The reason we didn't do this is because the getHistoryData function is defined to take three arguments:
  //userId, timeframe, and period. The period argument is expected to be an object with month and year properties.
return Response.json(data, { status: 200});
}
export type GetHistoryDateResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;
async function getHistoryData(
  userId: string,
  timeframe: Timeframe,
  period: Period
) {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
    default:
      throw new Error("Invalid timeframe");
  }
}
type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};
async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [{ month: "asc" }],
  });
  if (!result || result.length === 0) return [];
  const history: HistoryData[] = [];
  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;
    const month = result.find((row) => row.month === i);
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }
    history.push({
      year,
      month: i,
      expense,
      income,
    });
  }
  return history;
}
async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number
) {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      month,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [{ day: "asc" }],
  });
  if (!result || result.length === 0) return [];
  const history:HistoryData[] = [];
  const daysInMonth=getDaysInMonth(new Date(year, month))
  for (let j = 0;  j <daysInMonth; j++) {
    let expense = 0;
    let income = 0;
    const day = result.find((d) => d.day === j);
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }
    history.push({
        year,
        month,
        day: j,
        expense,
        income,
    })
  }
  return history;
}
