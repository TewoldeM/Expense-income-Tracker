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
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
async function page() {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  return (
    <div className="flex max-w-2xl flex-col items-cneter justify-center gap-4">
      <div>
        <h1 className="text-center text-3xl">
          Welcome <span>{user.firstName}!</span> 🙋‍♂️
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          personal budget tracker, where you can easily manage your expenses and
          income.
        </h2>
        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          Just create an account or sign in to get started. <br />
          {/* You can change this setting any time */}
        </h3>
      </div>
      <Separator />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions and
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
        <Separator />
        <Button className="w-full" asChild>
        <div className="flex gap-2">
        <ArrowRight size={20} />
        <Link href="/"> Got to Dashboard</Link>
        </div>
        </Button>
        <div className="mt-8">
          <Logo />
        </div>
      </Card>
    </div>
  );
}

export default page;
