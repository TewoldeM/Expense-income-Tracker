import Navbar from "@/components/custom/Navbar";
import React, { Children, ReactNode } from "react";
import {
  ClerkProvider,
} from "@clerk/nextjs";
const layout = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider>
      <div className="relative flex h-screen w-full flex-col">
        <Navbar />
        <div className="flex justify-center items-center mt-16">{children}</div>
      </div>
    </ClerkProvider>
  );
};

export default layout;
