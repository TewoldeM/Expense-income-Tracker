"use client";

import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import CreateCategoryDilog from "./CreateCategoryDilog"; // your client dialog
import { TransactionType } from "@/lib/TransactionType";
import CategoryPicker from "./categoryPicker";

// If you have a hook/mutation to create transaction, import it and replace placeholder.
interface Props {
  trigger: React.ReactNode;
  type: TransactionType;
}

export default function CreateTransactionDialog({ trigger, type }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // called when CategoryPicker changes selection
  const onCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  // called when CreateCategoryDilog creates a new category
  const onCategoryCreated = useCallback((category: any) => {
    // category is the created Category object from your mutation
    // Update local selection and show toast
    setSelectedCategory(category.name);
    toast.success(`Category "${category.name}" created`);
    // Optionally close any UI or re-open picker, etc.
  }, []);

  // Replace this with real mutation (fetch/axios/react-query mutation) that creates transaction
  const createTransaction = useCallback(async () => {
    if (!selectedCategory) {
      toast.error("Pick a category first");
      return;
    }

    try {
      setIsCreating(true);

      // Example placeholder: call your API to create transaction
      // const res = await fetch("/api/transactions", { method: "POST", body: JSON.stringify({ type, category: selectedCategory }) })
      // const data = await res.json()

      // Fake delay for UX:
      await new Promise((r) => setTimeout(r, 600));

      toast.success(`${type} created in category "${selectedCategory}"`);
      console.log("Created transaction:", { type, category: selectedCategory });

      setOpen(false); // close dialog after success
      setSelectedCategory(null); // reset selection if desired
    } catch (err) {
      console.error(err);
      toast.error("Failed to create transaction");
    } finally {
      setIsCreating(false);
    }
  }, [selectedCategory, type]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create {type} Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category picker - updates selectedCategory on change */}
          <div>
            <p className="mb-2 text-sm text-muted-foreground">
              Select category
            </p>
            <CategoryPicker type={type} onChange={onCategoryChange} />
            {selectedCategory && (
              <p className="mt-2 text-sm">
                Selected: <strong>{selectedCategory}</strong>
              </p>
            )}
          </div>

          {/* Create new category dialog - pass onCategoryCreated as a client->client callback */}
          <div>
            <p className="mb-2 text-sm text-muted-foreground">
              Or create a new category
            </p>
            <CreateCategoryDilog
              type={type}
              // This is client -> client. Allowed.
              successCallback={onCategoryCreated}
              trigger={
                <Button variant="ghost" className="p-2">
                  + Create new
                </Button>
              }
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedCategory(null);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={createTransaction} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
