import { ThemeSwitch } from "@/components/theme-switch";
import {  Logo } from "@/components/icons";
import { useSystemStore } from "@/stores/systemStore";
import { Menu } from "lucide-react";

export const NavbarAdmin = () => {
  const { expanded, toggle } = useSystemStore();

  return (
    <nav className="sticky top-0 w-full h-[4rem] z-10 px-[1rem] border-b before:absolute before:inset-0 before:backdrop-blur-md before:-z-10 z-30 max-lg:shadow-xs">
      <div className="flex w-full h-full justify-between items-center">
        <div className="flex justify-start items-center">
          <Logo />
          <p className="font-bold text-inherit">EZ систем</p>

          {/* Toggle Button */}
          <button
            onClick={toggle}
            aria-controls="sidebar"
            aria-expanded={expanded}
            className="p-4 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>
        <div className="flex items-center">
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
};
