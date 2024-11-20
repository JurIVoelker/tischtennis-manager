"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Cancel01Icon, Tick01Icon } from "hugeicons-react";

const SortPlayersHeader = () => {
  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" asChild className="w-full">
          <Link href="./verwalten">
            <Cancel01Icon />
            Abbrechen
          </Link>
        </Button>
        <Button className="w-full">
          <Tick01Icon />
          Speichern
        </Button>
      </div>
    </>
  );
};

export default SortPlayersHeader;
