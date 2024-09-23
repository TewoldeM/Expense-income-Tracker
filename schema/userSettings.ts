import { z } from "zod";
import { Currencies } from "../lib/currency";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = Currencies.some((c) => c.value === value);

    if (!found) {
      throw new Error(`Invalid currency: ${value}`);
    }
    return value;
  }),
});
