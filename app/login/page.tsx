import GoogleLoginButton from "@/components/google-login-button";
import Navbar from "@/components/navbar";
import Typography from "@/components/typography";

export const AdminLoginPage = () => {
  return (
    <div className="w-full">
      <Navbar title="Anmelden" />
      <div className="px-6 pb-6 pt-16 ">
        <Typography variant="h3"> Test</Typography>
        <GoogleLoginButton />
      </div>
    </div>
  );
};

export default AdminLoginPage;
