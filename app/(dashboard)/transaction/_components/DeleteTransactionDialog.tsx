"use client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Button } from "@/components/ui/button";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/lib/TransactionType";
import React, { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import {
  useMutation,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {} from "@/components/ui/alert-dialog";
import { Deletetransaction } from "../_actions/Deletetransaction";
interface Props {
  open: boolean;
  setOpen: (open:boolean) => void;
  transactionId: string;
}
function DeleteTransactionDialog({ open, setOpen, transactionId }: Props) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: Deletetransaction,
    onSuccess: async () => {
      toast.success("Transaction deleted successfully", {
        id: "transactionId",
      });
      await queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
    onError: () => {
      toast.error("something went wrong", {
        id: "transactionId",
      });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutly sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting this transaction will remove all its associated expenses
            and incomes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting category...", {
                id: "transactionId",
              });
              deleteMutation.mutate(transactionId)
            }}
          >
            Continue
            {/* 
            git config --global user.name "tewolde marie"
git config --global user.email "tewoldemarie6@gmail.com"
            */}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteTransactionDialog;
