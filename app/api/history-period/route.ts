import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const period = await getHistoryPeriods(user.id);
  return Response.json(period);
}
export type GetHistoryPeriodResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: [
      {
        year: "asc",
      },
    ],
  });
  const years = result.map((el) => el.year);
  if (years.length === 0) {
    return [new Date().getFullYear()];
  }
  return years;
}
//? The general logic behind select and distinct is to optimize the query and reduce the amount of data that needs to be transferred between the database and the application.

// Here are some general guidelines for using select and distinct:

// Use select to specify which fields should be included in the query results.
// Use distinct to remove duplicate values from the query results.
// Use select and distinct together to optimize the query and reduce the amount of data that needs to be transferred.