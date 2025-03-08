"use client";

import { Button } from "./ui/button";
import { Menu01Icon } from "hugeicons-react";
import { useSidebar } from "./ui/sidebar";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <nav className="p-6 flex justify-between items-center bg-secondary sticky top-0 md:hidden z-10">
      <Button onClick={toggleSidebar} variant="ghost" size="icon-lg">
        <Menu01Icon size={24} />
      </Button>
    </nav>
  );
};

export default Navbar;
