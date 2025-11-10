"use client";
import { CurrencyComboBox } from "@/components/custom/CurrencyCombox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/lib/TransactionType";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, SquareArrowDownLeft, SquareArrowUpRight, TrashIcon, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import CreateCategoryDilog from "../_components/CreateCategoryDilog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import DeletecategoryDialog from "../Deletecategory";

const page = () => {
  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Mange your Currency and categories
            </p>
          </div>
        </div>
      </div>

      {/* Just Heading the above code */}
      <div className="flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Curencey</CardTitle>
            <CardDescription>Set your Currency for transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
};

export default page;

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });
  const AvalibaleData = categoriesQuery.data && categoriesQuery.data.length > 0;
  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <SquareArrowDownLeft className="w-12 h-12 items-center round-gl bg-red-400/10 p-2 text-red-500" />
              ) : (
                <SquareArrowUpRight  className="w-12 h-12 items-center round-gl bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div>
                {type === "expense" ? "Expense" : "Income"} categories
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>
            <CreateCategoryDilog
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="g-2 text-sm">
                  <PlusSquare className="w-4 h-4" />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!AvalibaleData && (
          <div className="flex h-40 w-full flex-col items-center p-4">
            <p>
              No
              <span
                className={cn(
                  "m-l",
                  type === "income" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {type}
              </span>
              categories yet
            </p>
            <p>Create one to get started</p>
          </div>
        )}
        {AvalibaleData && (
          <div
            className="grid grid-flow-row gap-2 
            sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
            border-red-400 p-4
            "
          >
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCrad category={category} key={category.name} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCrad({ category }: { category: Category }) {
  return (
    <div
      className="flex border-separate flex-col 
      justify-between rounded-md border shadow-md
    shadow-black/[0.1]
   dark:shadow-white/[0.1]
     gap-4
 "
    >
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        {category.name}
      </div>
      <DeletecategoryDialog category={category} trigger={ <Button className="flex w-full border-separate items-center
      gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20
      "variant={"secondary"}>
        <TrashIcon className="w-4 h-4" />
        Remove
      </Button>} />
    </div>
  );
}
