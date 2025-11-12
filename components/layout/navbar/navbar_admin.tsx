"use client";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { BellRing, LayoutGrid } from "lucide-react";
import { Avatar } from "@heroui/avatar";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";
import ToggleModeButton from "@/components/button/toggleModeButton";
import MobileMenu from "@/components/layout/menu/mobile";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const NavbarAdmin = () => {
  const router = useRouter()

  const logout = () => {
    const token_name = process.env.NEXT_PUBLIC_TOKEN || 'eas-token';
    Cookies.remove(token_name);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 w-full h-[4rem] z-10 px-[1rem] border-b before:absolute before:inset-0 before:backdrop-blur-md before:-z-10 z-30 max-lg:shadow-xs dark:border-gray-600 border-gray-300">
      <div className="flex w-full h-full justify-between items-center">
        <div className="flex justify-start items-center">
          <Logo />
          <p className="font-bold text-inherit">EZ систем</p>
          <div className="max-sm:hidden">
            <ToggleModeButton />
          </div>
          <MobileMenu />
        </div>
        <div className="flex items-center gap-4 mr-2 !text-default-500">
          <LayoutGrid className="cursor-pointer transition-opacity hover:opacity-80 cursor-pointer" />
          <BellRing className="cursor-pointer transition-opacity hover:opacity-80 cursor-pointer" />
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
              <DropdownItem key="logout" className="text-danger" color="danger" onPress={logout}>
                Гарах
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};
