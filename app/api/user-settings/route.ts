import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    redirect("sign-in");
  }

  let userSettings = await prisma.userSetting.findUnique({
    where: {
      userId: user.id,
    },
  });
  
  if (!userSettings) {
    userSettings = await prisma.userSetting.create({
      data: {
        userId: user.id,
        currency: "USD",
      },
    });

  }
  revalidatePath("/")
  return Response.json(userSettings)
}
