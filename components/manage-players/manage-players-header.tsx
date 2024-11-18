"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft01Icon, Copy01Icon } from "hugeicons-react";

const ManagePlayersHeader = () => {
  return (
    <>
      <div className="flex gap-2 ">
        <Button variant="outline" asChild>
          <Link href="../">
            <ArrowLeft01Icon />
            Zurück
          </Link>
        </Button>
        <Button className="w-full">
          <Copy01Icon />
          Infotext kopieren
        </Button>
      </div>
    </>
  );
};

export default ManagePlayersHeader;
