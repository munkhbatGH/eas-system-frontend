"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Home, Settings } from "lucide-react";
import Link from 'next/link';

import { useSystemStore } from "@/stores/systemStore";

export const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
    const { expanded } = useSystemStore();

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  useEffect(() => {
    console.log('----openMenu-----', openMenu, openMenu === "settings")
  }, [openMenu]);

	// const isProd = process.env.NODE_ENV === 'production'
  const baseUrl = '' // isProd ? '/eas-system-frontend' : '';
  return (
    <aside id="sidebar" className={`max-sm:hidden border-r dark:border-gray-600 border-gray-300 flex flex-col justify-start items-center transition-all duration-300 ${expanded ? "w-64" : "w-16"}`}>

      <nav className={`flex-1 mt-4 space-y-2 ${expanded ? "w-full" : ""}`}>
        <Link
          href={`${baseUrl}/admin`}
          className={`w-full flex items-center py-3 px-8 rounded hover:bg-gray-700 transition-colors text-inherit  ${expanded ? "gap-2" : ""}`}
        >
          <Home size={20} />
          <span
            className={` overflow-hidden whitespace-nowrap transition-all duration-300
            ${expanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}
          >
            Хянах самбар
          </span>
        </Link>
        
        <Link
          href="#"
          onClick={() => toggleMenu("settings")}
          className={`flex items-center py-3 px-8 rounded hover:bg-gray-700 transition-colors text-inherit ${expanded ? "gap-2" : ""}`}
        >
          <Settings size={20} />
          <span className={`${expanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}>Тохиргоо</span>
          {openMenu === "settings" ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </Link>
        {openMenu === "settings" && (
          <div className="ml-6 space-y-1">
            <Link
              href={`${baseUrl}/admin/settings/mod`}
              className={`flex items-center py-3 px-8 rounded hover:bg-gray-700 transition-colors text-inherit ${expanded ? "gap-2" : ""}`}
            >
              <span>Модуль</span>
            </Link>
            <Link
              href={`${baseUrl}/admin/settings/menu`}
              className={`flex items-center py-3 px-8 rounded hover:bg-gray-700 transition-colors text-inherit ${expanded ? "gap-2" : ""}`}
            >
              <span>Цэс</span>
            </Link>
            <Link
              href={`${baseUrl}/admin/settings/role`}
              className={`flex items-center py-3 px-8 rounded hover:bg-gray-700 transition-colors text-inherit ${expanded ? "gap-2" : ""}`}
            >
              <span>Дүр</span>
            </Link>
          </div>
        )}

      </nav>
    </aside>
  );
};
