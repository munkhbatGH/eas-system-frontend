"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Home, Link, Settings } from "lucide-react";

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

	const isProd = process.env.NODE_ENV === 'production'
  const baseUrl = isProd ? '/eas-system-frontend' : '';
  return (
    <aside id="sidebar" className={`max-sm:hidden border-r dark:border-gray-600 border-gray-300 flex flex-col justify-start items-center transition-all duration-300 ${expanded ? "w-64" : "w-16"}`}>

      <nav className={`flex-1 mt-4 space-y-2 ${expanded ? "w-full" : ""}`}>
        <a
          href="/dashboard"
          className={`w-full flex items-center py-3 px-8 rounded hover:bg-gray-700 transition-colors text-inherit  ${expanded ? "gap-2" : ""}`}
        >
          <Home size={20} />
          <span
            className={` overflow-hidden whitespace-nowrap transition-all duration-300
            ${expanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}
          >
            Dashboard
          </span>
        </a>
        
        <a
          href="#"
          onClick={() => toggleMenu("settings")}
          className={`flex items-center py-3 px-8 rounded hover:bg-gray-700 transition-colors text-inherit ${expanded ? "gap-2" : ""}`}
        >
          <Settings size={20} />
          <span>Тохиргоо</span>
          {openMenu === "settings" ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </a>
        {openMenu === "settings" && (
          <div className="ml-6 space-y-1">
            <a
              href={`${baseUrl}/admin/settings/mod`}
              className={`flex items-center py-3 px-8 rounded hover:bg-gray-700 transition-colors text-inherit ${expanded ? "gap-2" : ""}`}
            >
              <span>Модуль</span>
            </a>
            <a
              href={`${baseUrl}/admin/settings/menu`}
              className={`flex items-center py-3 px-8 rounded hover:bg-gray-700 transition-colors text-inherit ${expanded ? "gap-2" : ""}`}
            >
              <span>Цэс</span>
            </a>
          </div>
        )}

      </nav>
    </aside>
  );
};
