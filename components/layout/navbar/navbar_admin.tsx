import { ThemeSwitch } from "@/components/theme-switch";
import {  Apps, Logo } from "@/components/icons";
import { useSystemStore } from "@/stores/systemStore";
import { BellRing, Menu } from "lucide-react";
import { Avatar } from "@heroui/avatar";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";

export const NavbarAdmin = () => {
  const { expanded, toggle } = useSystemStore();

  return (
    <nav className="sticky top-0 w-full h-[4rem] z-10 px-[1rem] border-b before:absolute before:inset-0 before:backdrop-blur-md before:-z-10 z-30 max-lg:shadow-xs dark:border-gray-600 border-gray-300">
      <div className="flex w-full h-full justify-between items-center">
        <div className="flex justify-start items-center">
          <Logo />
          <p className="font-bold text-inherit">EZ систем</p>

          <button
            onClick={toggle}
            aria-controls="sidebar"
            aria-expanded={expanded}
            className="ml-20 p-4 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>
        <div className="flex items-center gap-2 mr-2">
          <Apps />
          <BellRing />
          <ThemeSwitch />
          <div className="w-[1px] h-[1.3rem] bg-gray-900 dark:bg-white mr-2"></div>

          <Dropdown>
            <DropdownTrigger>
              <Avatar size="sm" isBordered color="success" src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
            </DropdownTrigger>
            <DropdownMenu aria-label="Action event example">
              <DropdownItem key="profile" href="/admin/profile">
                Хэрэглэгч
              </DropdownItem>
              <DropdownItem key="logout" className="text-danger" color="danger" href="/login">
                Гарах
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};
