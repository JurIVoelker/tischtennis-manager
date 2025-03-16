"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { useUserStore } from "@/store/store";

const LoginLink = () => {
  const { clubSlug } = useUserStore();
  return (
    <>
      {clubSlug && (
        <Link
          href={`/${clubSlug}/mannschaftsfuehrer/login`}
          className={cn(buttonVariants({ variant: "default" }), "w-full")}
        >
          Login
        </Link>
      )}
      {!clubSlug && (
        <Button className="w-full" disabled>
          Laden...
        </Button>
      )}
    </>
  );
};

export default LoginLink;
