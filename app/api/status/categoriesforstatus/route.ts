import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const queryPramas = OverviewQuerySchema.safeParse({ from, to });
  if (!queryPramas.success) {
    return Response.json(queryPramas.error.message, { status: 400 });
    console.log("queryParams:",queryPramas.error)
  }

  const status = await getCategoriesStatus(
    user.id,
    queryPramas.data.from,
    queryPramas.data.to
  );
  {
    return Response.json(status);
  }
}


export type GetCategoriesStatusResponseType = Awaited< 
ReturnType<typeof  getCategoriesStatus> 
>;

  async function getCategoriesStatus(userId: string, from: Date, to: Date) {
    const status = await prisma.transaction.groupBy({
      by: ["type", "category", "categoryIcon"],
      where: {
        userId,
        date: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    });
    return status;
  }

