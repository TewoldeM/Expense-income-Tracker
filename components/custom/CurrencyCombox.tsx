"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Currency } from "@/lib/currency";
import { Currencies } from "../../lib/currency";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "../SkeletonWrapper";
import { UserSetting } from "@prisma/client";
import { UpdateUserCurrency } from "@/app/wizard/_actions/usersettings";
import { toast } from "sonner";

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOptions, setSelectedOptions] = React.useState<Currency | null>(
    null
  );
  const userSettings = useQuery<UserSetting>({
    queryKey: ["userSettings"],
    queryFn: () =>
      // Fetch user settings from your backend API
      fetch("api/user-settings").then((res) => res.json()),
  });
  React.useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );
    if (userCurrency) setSelectedOptions(userCurrency);
  }, [userSettings.data]);
  const mution = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSetting) => {
      toast.success(`Currency updated successfully 🎉`, {
        id: "update-currency",
      });
      setSelectedOptions(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },
    onError: (e) => {
      console.error(e);
      toast.error("some thing went wrong", {
        id: "update-currency",
      });
    },
  });
  const selctedOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error(`please slecet currency`);
        return;
      }
      toast.loading("updating currency...", {
        id: "update-currency",
      });
      mution.mutate(currency.value);
    },
    [mution]
  );
  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={mution.isPending}
            >
              {selectedOptions ? (
                <>{selectedOptions.label}</>
              ) : (
                <>+ Set Currency</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selctedOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mution.isPending}
          >
            {selectedOptions ? (
              <>{selectedOptions.label}</>
            ) : (
              <>+ Set currency</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selctedOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
