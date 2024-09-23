"use client";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { UserSetting } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { MAX_DATE_RANGE_DAYS } from "../../../lib/constant";
import { toast } from "sonner";
import Statuscards from "./StatusCard";
import Categories from "./CategoriesStatus";
import CategoriesStatus from "./CategoriesStatus";

const OverView = ({ usersetings }: { usersetings: UserSetting }) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
//  ? Initial State
// The initial state is set to an object with the following properties:
// from: The first day of the current month, obtained using the startOfMonth function from the date-fns library.
// to: The current date, obtained using the new Date() constructor.
//?startOfMonth Function
// The startOfMonth function from the date-fns library returns the first day of the month for a given date.
// ?new Date() Constructor
// The new Date() constructor returns the current date and time.

//? What is the range?
//The range is the period of time between the from date and the to date. 
//In this case, the range is the entire month, from the first day of the month to the current date.
  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
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

      <div className="container flex w-full flex-col gap-0">
        <Statuscards
          from={dateRange.from}
          to={dateRange.to}
          userSettings={usersetings}
        />
        <CategoriesStatus
          from={dateRange.from}
          to={dateRange.to}
          userSettings={usersetings}
        />
      </div>
    </>
  );
};

export default OverView;
