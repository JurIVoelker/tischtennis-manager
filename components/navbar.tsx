"use client";

import Typography from "./typography";
import { Button } from "./ui/button";
import { Menu01Icon } from "hugeicons-react";
import { useSidebar } from "./ui/sidebar";

interface NavbarProps {
  title: string | undefined;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { toggleSidebar } = useSidebar();
  return (
    <nav className="p-6 flex justify-between items-center bg-secondary sticky top-0">
      <Typography variant="h3">{title || ""}</Typography>
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon-lg"
        className="md:hidden"
      >
        <Menu01Icon size={24} />
      </Button>
    </nav>
  );
};

export default Navbar;
