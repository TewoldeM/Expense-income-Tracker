import { HandCoins } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center justify-center gap-2">
      <HandCoins className="stroke w-11 h-11 stroke-green-500 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        ExpenseEye
      </p>
    </Link>
  );
};

export function MobileLogo() {
  return (
    <Link href="/" className="flex items-center justify-center gap-2">
      <p className="bg-gradient-to-r from-emerald-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        ExpenseEye
      </p>
    </Link>
  );
}

export default Logo;
