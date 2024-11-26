"use client";
import Typography from "@/components/typography";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ValidateLeaderLoggedInPage = () => {
  const [error, setError] = useState<string | null>(null);
  const { push } = useRouter();
  const verifyToken = async () => {
    try {
      const response = await axios.get("/api/verify-auth");
      const { leaderAt } = response.data.data || {};
      localStorage.setItem("leaderAt", JSON.stringify(leaderAt));
      push("../../");
    } catch (error) {
      setError("Verifizierung fehlgeschlagen. Bitte versuche es erneut.");
      console.error("Error verifying token:", error);
    }
  };

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      <div className="px-6 pb-6 pt-16 ">
        <Typography variant="h3">Login Validieren</Typography>
        <div className="flex items-center gap-2 mt-4">
          {!error && (
            <>
              <Typography variant="p" className="leading-10">
                Dein Login wird validiert. Bitte warte einen Moment.
              </Typography>
              <div>
                <Loader2 className="animate-spin" size={20} />
              </div>
            </>
          )}
          {error}
        </div>
      </div>
    </div>
  );
};

export default ValidateLeaderLoggedInPage;
