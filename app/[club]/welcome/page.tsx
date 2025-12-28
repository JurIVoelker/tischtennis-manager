import Headline from "@/components/headline";
import IndexLoginManager from "@/components/index-login-manager";
import LoginLink from "@/components/login-link";
import Typography from "@/components/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

const IndexPage = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-1 flex items-center justify-center px-4 py-12 w-full">
        <Card className="w-full max-w-2xl shadow-none border-none p-1 md:shadow-lg md:p-8 md:border-solid">
          <CardHeader className="p-0">
            <Headline>Tischtennis Manager</Headline>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 p-0">
            <Typography variant="p" className="leading-6">
              Willkommen beim TT-Manager. Um einer Mannschaft beizutreten, musst
              du den Einladungslink, den du von deinem Mannschaftsführer
              bekommen hast öffnen.
            </Typography>

            <div className="p-3.5 border rounded-md space-y-2">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertCircle className="size-5 shrink-0 text-destructive" />
                Ungültiger Link
              </div>
              <div className="text-sm">
                Der Link, den du aufgerufen hast, ist kein gültiger
                Einladungslink. Bitte versuche es erneut oder kontaktiere deinen
                Mannschaftsführer.{" "}
                <Link
                  href="/guide/link-kopieren"
                  className="text-primary underline font-semibold"
                >
                  Hier
                </Link>{" "}
                erfährst du wie man den richtigen Link kopiert.
              </div>
            </div>

            <IndexLoginManager />

            <Separator className="my-2" />

            <div className="space-y-2">
              <Typography variant="h4" className="mb-2">
                Login für Mannschaftsführer
              </Typography>
              <Typography variant="p" className="leading-6">
                Falls du Mannschaftsführer bist, kannst du dich hier anmelden,
                um deiner Mannschaft beizutreten.
              </Typography>

              <div className="flex justify-start pt-2">
                <LoginLink />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexPage;
