"use client";
import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { toast } from "sonner";
interface Props {
  trigger: ReactNode;
  category: Category;
}
import { Deletecategory } from "@/app/(dashboard)/_actions/category";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TransactionType } from "@/lib/TransactionType";
function DeletecategoryDialog({ trigger, category }: Props) {
  const categoryIdentifier = `${category.name}-${category.type}`;
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: Deletecategory,
    onSuccess: async () => {
      toast.success("category deleted successfully", {
        id: categoryIdentifier,
      });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("something went wrong", {
        id: categoryIdentifier,
      });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutly sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting this category will remove all its associated expenses and
            incomes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>{
            toast.loading("Deleting category...",{
                id: categoryIdentifier,
            });
            deleteMutation.mutate({
                name:category.name,
                type:category.type as TransactionType,})
          }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeletecategoryDialog;
