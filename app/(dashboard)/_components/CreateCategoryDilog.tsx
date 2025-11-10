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
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/categories";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Category } from "@prisma/client";
import { CreateCategory } from "../_actions/category";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface Props {
  type: TransactionType;
  successCallback: (category: Category) => void;
  trigger?: ReactNode;
}

const CreateCategoryDilog = ({ type, successCallback, trigger }: Props) => {
  const [open, setOpen] = React.useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
      icon: "",
      type,
    },
  });

  const QueryClient = useQueryClient();
  const theme = useTheme();
  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      // Clear form
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(`Category ${data.name} created successfully 🎉`, {
        id: "create-category",
      });
      successCallback(data);
      await QueryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      // When you call invalidateQueries, react-query will remove the cached result of the query from the cache.
      //  This means that the next time the query is executed,
      //  react-query will re-fetch the data from the server instead of returning the cached result.
      setOpen((prev) => !prev);
    },

    onError: () => {
      toast.error("Some thing went to wrong", {
        id: "create-category-error",
      });
    },
  });

  const onSubmit = React.useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading("Create category...", {
        id: "create-category",
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant={"ghost"}
            className="flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
          >
            <PlusSquare className="mr-2 h-4 w-4" />
            Create new
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-50" : "text-red-500"
              )}
            >
              {type}
            </span>
            Category
          </DialogTitle>
          <DialogDescription>
            Category are used tp group your transaction
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="h-[100px] w-full"
                        >
                          {field.value ? ( // Changed from form.watch("icon") to field.value
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to Change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-[48px] w-[48px]" />
                              <p className="text-xs text-muted-foreground">
                                Click to Select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: { native?: string }) => {
                            field.onChange(emoji.native ?? "");
                          }}
                          theme={theme.resolvedTheme}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>You can pick an Icon</FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)}>
            {!isPending && "Create"}
            {isPending && <Loader2 className="animate-spin" />}
            on{" "}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDilog;
