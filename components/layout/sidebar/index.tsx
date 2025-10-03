"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from 'next/link';

import { useSystemStore } from "@/stores/systemStore";
import { SettingsService } from "@/services/settings.service";
import { fetchClient } from "@/lib/fetchClient";
import DynamicIcon from "@/components/ui/dynamic-icon";

export const Sidebar = () => {
  const { expanded } = useSystemStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuList, setMenuList] = useState<any[]>([]);

  useEffect(() => {
    getMenuList()
  }, [openMenu]);

  const getMenuList = async () => {
    try {
      const data = await fetchClient(SettingsService.menuList())
      if (data) setMenuList(data)
    } catch (error) {
      console.error('Error Sidebar -> getMenuList:', error)
    }
  };

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

	// const isProd = process.env.NODE_ENV === 'production'
  const baseUrl = '' // isProd ? '/eas-system-frontend' : '';
  return (
    <aside id="sidebar" className={`max-sm:hidden border-r dark:border-gray-600 border-gray-300 flex flex-col justify-start items-center transition-all duration-300 ${expanded ? "w-64" : "w-20"}`}>
      <nav className={`flex-1 mt-4 space-y-2 ${expanded ? "w-full" : ""}`}>
        { menuList.map((menu) => {
          return (
            <div key={menu.name}>
              <Link
                key={menu.name}
                href={menu.path}
                className={`w-full flex items-center py-3 px-6 rounded hover:bg-gray-700 transition-colors text-inherit  ${expanded ? "gap-2" : ""}`}
                onClick={() => toggleMenu(menu.code)}
              >
                <DynamicIcon name={menu.icon ? menu.icon : "Home"} props={{ size: 20 }} />
                <span
                  className={` overflow-hidden whitespace-nowrap transition-all duration-300
                  ${expanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}
                >
                  { menu.name }
                </span>
                { menu && menu.children && menu.children.length > 0 && (
                  openMenu === menu.code ? <ChevronDown size={20} /> : <ChevronRight size={20} />
                ) }
              </Link>
              { openMenu === menu.code && menu && menu.children && (
                <div className={`${openMenu ? 'ml-4 mr-2' : 'space-y-1 ml-6'} `}>
                  { menu.children.map((subMenu: any) => {
                    return (
                      <Link
                        key={subMenu.name}
                        href={`/admin/${subMenu.path}`}
                        className={`flex items-center py-3 px-4 rounded hover:bg-gray-700 transition-colors text-inherit ${expanded ? "gap-2" : ""}`}
                      >
                        { subMenu.icon && (
                          <DynamicIcon name={subMenu.icon ? subMenu.icon : "Minus"} props={{ size: 20 }} />
                        ) }
                        <span
                          className={` overflow-hidden whitespace-nowrap transition-all duration-300
                          ${expanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}
                        >{subMenu.name}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          );
        }) }
      </nav>
    </aside>
  );
};
