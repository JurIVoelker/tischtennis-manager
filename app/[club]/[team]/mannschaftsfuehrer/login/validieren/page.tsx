"use client";
import Typography from "@/components/typography";
import { getAPI } from "@/lib/APIUtils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ValidateLeaderLoggedInPage = () => {
  const [error, setError] = useState<string | null>(null);
  const { push } = useRouter();
  const verifyToken = async () => {
    try {
      const response = await getAPI("/api/verify-auth");
      const { leaderAt, admin } = response.data || {};
      if (leaderAt) {
        localStorage.setItem("leaderAt", JSON.stringify(leaderAt));
      }
      if (admin) {
        localStorage.setItem("admin", "true");
      }
      push("../../");
    } catch (error) {
      setError("Verifizierung fehlgeschlagen. Bitte  versuche es erneut.");
      console.error("Error verifying token:", error);
    }
  };

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-center flex-col h-svh  ">
        {!error && (
          <>
            <div>
              <Loader2 className="animate-spin" size={32} />
            </div>
            <Typography variant="p-gray" className="leading-10 mt-2">
              Dein Konto wird validiert. Bitte warte einen Moment.
            </Typography>
          </>
        )}
        {error}
      </div>
    </div>
  );
};

export default ValidateLeaderLoggedInPage;
