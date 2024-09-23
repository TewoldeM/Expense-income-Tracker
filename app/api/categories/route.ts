import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  // Validate the user first
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  // Get the type from the request parameters
  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");
  const validator = z.enum(["expense", "income"]).nullable();
  const queryParams = validator.safeParse(paramType);

  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }
  const type = queryParams.data;

  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: user.id,
        ...(type && {type})
      },
      orderBy:{
        name:"asc"
      }
    });
    return Response.json(categories);
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Error fetching categories" }, { status: 500 });
  }
}