import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const Container = ({className, children}: {className?: string, children: ReactNode}) => {
  return  (
    <div className={cn("max-w-[1240px] mx-auto w-full", className)}>
      {children}
    </div>
  );
}

export default Container;