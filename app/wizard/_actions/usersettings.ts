"use server";

import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function UpdateUserCurrency(currency: string): 
     Promise<{userId: string; currency: string;}> {
  const parseBody = UpdateUserCurrencySchema.safeParse({ currency });
  if (!parseBody.success) {
    throw new Error(parseBody.error.message);
  }
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userSettings = await prisma.userSetting.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  });
  return { userId: user.id, currency: userSettings.currency };
}