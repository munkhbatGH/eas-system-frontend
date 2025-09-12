"use client";

import { useState } from "react";
import { Home, Settings } from "lucide-react";

import { useSystemStore } from "@/stores/systemStore";

export const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
    const { expanded } = useSystemStore();

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
  return (
    //   <aside className="max-sm:hidden w-64 border-r shadow-md p-4">
    //     <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

    //     <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-700">
    //       Dashboard
    //     </Link>

    //     <button
    //       onClick={() => toggleMenu("users")}
    //       className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-gray-700"
    //     >
    //       <span>Users</span>
    //       {openMenu === "users" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
    //     </button>
    //     {openMenu === "users" && (
    //       <div className="ml-6 space-y-1">
    //         <Link href="/users/list" className="block px-3 py-1 hover:bg-gray-700 rounded">
    //           List
    //         </Link>
    //         <Link href="/users/create" className="block px-3 py-1 hover:bg-gray-700 rounded">
    //           Create
    //         </Link>
    //       </div>
    //     )}

    //     <button
    //       onClick={() => toggleMenu("settings")}
    //       className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-gray-700"
    //     >
    //       <span>Settings</span>
    //       {openMenu === "settings" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
    //     </button>
    //     {openMenu === "settings" && (
    //       <div className="ml-6 space-y-1">
    //         <Link href="/settings/profile" className="block px-3 py-1 hover:bg-gray-700 rounded">
    //           Profile
    //         </Link>
    //         <Link href="/settings/security" className="block px-3 py-1 hover:bg-gray-700 rounded">
    //           Security
    //         </Link>
    //       </div>
    //     )}
    // </aside>

    <aside id="sidebar" className={`max-sm:hidden border-r dark:border-gray-600 border-gray-300 flex flex-col justify-start items-center transition-all duration-300 ${expanded ? "w-64" : "w-16"}`}>

      <nav className={`flex-1 mt-4 space-y-2 ${expanded ? "w-full" : ""}`}>
        <a
          href="/dashboard"
          className={`flex items-center py-3 px-8 rounded hover:bg-gray-700 transition-colors text-inherit  ${expanded ? "gap-2" : ""}`}
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
          href="/settings"
          className={`flex items-center py-3 px-8 rounded hover:bg-gray-700 transition-colors text-inherit ${expanded ? "gap-2" : ""}`}
        >
          <Settings size={20} />
          <span
            className={` overflow-hidden whitespace-nowrap transition-all duration-300 
            ${expanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"}`}
          >
            Settings
          </span>
        </a>
      </nav>
    </aside>
  );
};
