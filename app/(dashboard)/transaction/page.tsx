"use client";
// import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constant";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import TransactionTable from "./_components/TransactionTable";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const Transactionpage = () => {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
      });
  return (
    <>
    <div className="border-b bg-card">
      <div className="container flex flex-wrap items-center justify-between py-8 gap-6 ">
        <p className="text-3xl ">Transaction History</p>
        <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            onUpdate={(value) => {
              const { from, to } = value.range;
              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The Selected date range is too big. Max allow range is ${MAX_DATE_RANGE_DAYS}days`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
      </div>
    </div>
    <div className="container">
        <TransactionTable from={dateRange.from} to={dateRange.to}  />
        </div>
    </>
    

  );
};

export default Transactionpage;
