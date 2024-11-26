import GoogleLoginButton from "@/components/google-login-button";
import Typography from "@/components/typography";

const LeaderLoginPage = () => {
  return (
    <div className="w-full">
      <div className="px-6 pb-6 pt-16 ">
        <Typography variant="h3">Login für Mannschaftsführer</Typography>
        <GoogleLoginButton />
      </div>
    </div>
  );
};

export default LeaderLoginPage;
