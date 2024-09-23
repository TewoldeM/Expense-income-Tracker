import Navbar from "@/components/custom/Navbar";
import React, { Children, ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex h-screen w-full flex-col">
        <Navbar />
        <div className="flex justify-center items-center mt-16">{children}</div>
    </div>
  );
};

export default layout;
{/* <div className="relative flex h-screen w-full flex-col ">
<Navbar />
<div className="w-full ">{children}</div>
</div> */}