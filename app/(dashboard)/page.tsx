import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import OverView from "./_components/OverView";
import History from "./_components/History"
async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("sign-in");
  }
  const UserSetting = await prisma.userSetting.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!UserSetting) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background">
      
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">Hello, {user.firstName} 🐦‍🔥</p>
          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-500 bg-emerald-950
             text-white hover:bg-emerald-700 hover:text-white"
                >
                  New income
                </Button>
              }
              type="income"
              successCallback={(category) => {
                console.log("Income transaction created with category:", category);
              }}
            ></CreateTransactionDialog>
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-500 bg-rose-950
             text-white hover:bg-rose-700 hover:text-white"
                >
                  New Expensive
                </Button>
              }
              type="expense"
              successCallback={(category) => {
                console.log("Expense transaction created with category:", category);
              }}
            ></CreateTransactionDialog>
          </div>
        </div>
      </div>
      <OverView usersetings={UserSetting} />
      <History userSettings={UserSetting} />
    </div>
  );
}

export default page;
