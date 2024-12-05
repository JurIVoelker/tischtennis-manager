import React from "react";
import { toast as setToastMessage } from "@/hooks/use-toast";
import Typography from "@/components/typography";

const returnUnkownError = () => {
  setToastMessage({
    title: "Übermitteln der Anfrage fehlgeschlagen",
    description: (
      <div className="mt-2 w-[340px] flex gap-2">
        <Typography variant="p" className="leading-1">
          {"Fehler: Unbekannter Fehler"}
        </Typography>
      </div>
    ),
  });
};

export const handlePostRequestError = (
  res: { error: string | { message: string }[] },
  customErrorHandler?: {
    message: string;
    callback?: () => void;
    toast?: {
      title: string;
      description: string;
    };
  }[]
) => {
  if (customErrorHandler) {
    let errorFound = false;
    for (const errorHandler of customErrorHandler) {
      const { message, callback, toast } = errorHandler;
      if (
        Array.isArray(res.error) &&
        res.error.some(
          (error: { message: string }) => error.message === message
        )
      ) {
        if (callback) callback();
        if (toast) {
          setToastMessage({
            title: toast.title,
            description: (
              <div className="mt-2 w-[340px] flex gap-2">
                <Typography variant="p" className="leading-1">
                  Mit deinem Account stimmt etwas nicht. Bitte logge dich erneut
                  ein.
                </Typography>
              </div>
            ),
          });
        }
        errorFound = true;
        return;
      }
    }
    if (!errorFound) returnUnkownError();
  } else {
    returnUnkownError();
  }
};
