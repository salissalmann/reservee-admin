import { cn } from "@/lib/utils";
import React from "react";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        `max-w-screen-2xl px-5 md:px-14 mx-auto w-full dark:bg-tertiary`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default SectionContainer;
