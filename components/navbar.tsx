import Typography from "./typography";
import { Button } from "./ui/button";

interface NavbarProps {
  title: string | undefined;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <nav className="p-6 flex justify-between items-center">
      <Typography variant="h3">{title || ""}</Typography>
      <Button variant="ghost">---</Button>
    </nav>
  );
};

export default Navbar;
