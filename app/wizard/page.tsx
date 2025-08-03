import { CurrencyComboBox } from "@/components/custom/CurrencyCombox";
import Logo from "@/components/custom/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currentUser } from "@clerk/nextjs/server";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex max-w-2xl flex-col items-center justify-center gap-4 p-4 mx-auto">
      <div>
        <h1 className="text-center text-3xl">
          Welcome <span>{user.firstName}!</span> 🙋‍♂️
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Personal budget tracker, where you can easily manage your expenses and
          income.
        </h2>
        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          Just create an account or sign in to get started. <br />
        </h3>
      </div>

      <Separator />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions and reports.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <CurrencyComboBox />
        </CardContent>

        <Separator className="mt-4" />

        {/* ✅ FIXED BUTTON-WRAPPED LINK */}
        <Button asChild className="w-full mt-4" variant="default">
          <Link href="/">
            <ArrowRight size={20} className="mr-2" />
            Go to Dashboard
          </Link>
        </Button> 

        <div className="mt-8">
          <Logo />
        </div>
      </Card>
    </div>
  );
}
