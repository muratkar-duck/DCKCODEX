"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes, FC } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-forest-700 text-white hover:bg-forest-600 focus-visible:ring-forest-500",
        secondary: "bg-sun-500 text-forest-950 hover:bg-sun-400 focus-visible:ring-sun-500",
        ghost: "bg-transparent text-forest-800 hover:bg-forest-100 focus-visible:ring-forest-500",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
      asChild: {
        true: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button: FC<ButtonProps> = ({
  className,
  variant,
  size,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};
