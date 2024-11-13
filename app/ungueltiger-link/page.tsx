"use client";
import Typography from "@/components/typography";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MIDDLEWARE_STATUS_CLUB_NOT_FOUND,
  MIDDLEWARE_STATUS_UNAUTHORIZED,
} from "@/constants/middlewareConstants";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const InvalidLinkPage = () => {
  const searchParams = useSearchParams();
  const [statusText, setStatusText] = useState("");
  useEffect(() => {
    const statusCode = searchParams.get("statusCode");
    let statusText =
      "Es ist ein unerwarteter Fehler aufgetreten. Bitte kontaktiere einen Administrator.";
    if (statusCode === MIDDLEWARE_STATUS_UNAUTHORIZED)
      statusText =
        "Authentifizierung fehlgeschlagen. Bitte überprüfe, ob der Link gültig ist und kontaktiere deinen Mannschaftsführer.";
    if (statusCode === MIDDLEWARE_STATUS_CLUB_NOT_FOUND)
      statusText = "Der von dir gesuchte Verein wurde nicht gefunden";
    setStatusText(statusText);
  }, []);

  const skeletonLinesCount = 3;

  return (
    <div className="w-full px-6 pb-6 pt-16">
      <Typography variant="h3">Fehler aufgetreten</Typography>
      {!statusText && (
        <div className="flex gap-2 flex-col pt-1 mt-2">
          {Array.from({ length: skeletonLinesCount }).map((_, id) => (
            <Skeleton className="w-full h-5" key={id} />
          ))}
        </div>
      )}
      {statusText && (
        <Typography variant="p-gray" className="mt-2">
          {statusText}
        </Typography>
      )}
    </div>
  );
};

export default InvalidLinkPage;
