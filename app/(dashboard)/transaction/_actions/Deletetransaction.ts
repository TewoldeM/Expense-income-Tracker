"use server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function Deletetransaction(id:string){
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const transaction = await prisma.transaction.findMany({
    where: {
      userId: user.id,
    },
  });

  if (!transaction.length) {
    throw new Error("No transactions found for this user");
  }

  // Check if the transaction with the given id belongs to the user
  const transactionToDelete = transaction.find((tx) => tx.id === id);
  if (!transactionToDelete) {
    throw new Error("Transaction not found or does not belong to the user");
  }

  await prisma.$transaction([
    // Delete transaction from db
    prisma.transaction.delete({
      where: {
        id: transactionToDelete.id,
        userId: user.id,
      },
    }),
    // Update the month history (you can add your logic here)
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transactionToDelete.date.getUTCDate(),
          month: transactionToDelete.date.getUTCMonth(),
          year: transactionToDelete.date.getUTCFullYear(),
        },
      },
      data: {
       ...(transactionToDelete.type === "expense" && {
        expense: transactionToDelete.amount,
        }),
        ...(transactionToDelete.type === "income" && {
            income: transactionToDelete.amount,
            }),
      },
    }),
    prisma.yearHistory.update({
        where: {
          month_year_userId: {
            userId: user.id,
            month: transactionToDelete.date.getUTCMonth(),
            year: transactionToDelete.date.getUTCFullYear(),
          },
        },
        data: {
         ...(transactionToDelete.type === "expense" && {
          expense: transactionToDelete.amount,
          }),
          ...(transactionToDelete.type === "income" && {
              income: transactionToDelete.amount,
              }),
        },
      }),
  ]);
}
