import { cn } from "@/lib/utils";
import React from "react";

interface TypographyProps {
  variant:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "p"
    | "p-gray"
    | "blockquote"
    | "inline-code"
    | "lead"
    | "large"
    | "small"
    | "muted"
    | "error";
  children: React.ReactNode;
  className?: string;
}

interface VariantProps {
  component: keyof JSX.IntrinsicElements;
  className: string;
}

const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className,
}) => {
  const variants: Record<TypographyProps["variant"], VariantProps> = {
    h1: {
      component: "h1",
      className:
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    },
    h2: {
      component: "h2",
      className:
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
    },
    h3: {
      component: "h3",
      className: "scroll-m-20 text-2xl font-semibold tracking-tight",
    },
    h4: {
      component: "h4",
      className: "scroll-m-20 text-xl font-semibold tracking-tight",
    },
    h5: {
      component: "h5",
      className: "scroll-m-20 font-semibold tracking-tight",
    },
    p: {
      component: "p",
      className: "leading-7",
    },
    "p-gray": {
      component: "p",
      className: "leading-7 text-muted-foreground",
    },
    blockquote: {
      component: "blockquote",
      className: "mt-6 border-l-2 pl-6 italic",
    },
    "inline-code": {
      component: "code",
      className:
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
    },
    lead: {
      component: "p",
      className: "text-xl text-muted-foreground",
    },
    large: {
      component: "div",
      className: "text-lg font-semibold",
    },
    small: {
      component: "small",
      className: "text-sm font-medium leading-none",
    },
    muted: {
      component: "p",
      className: "text-sm text-muted-foreground",
    },
    error: {
      component: "p",
      className: "text-sm text-red-600",
    },
  };

  if (!Object.keys(variants).includes(variant)) return <p>{children}</p>;
  const selectedVariant = variants[variant];
  return React.createElement(
    selectedVariant.component,
    { className: cn(selectedVariant.className, className || "") },
    children
  );
};

export default Typography;
