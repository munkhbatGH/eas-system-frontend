'use client';

import { useState, useEffect } from 'react';
import { TextAlignJustify, X } from "lucide-react";
import Link from 'next/link';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 text-gray-800 dark:text-gray-200 focus:outline-none md:hidden z-50 relative ${isOpen ? 'hidden' : ''}`}
      >
        <TextAlignJustify className="w-7 h-7" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center space-y-8 transition-opacity duration-300 ease-in-out before:absolute before:inset-0 before:backdrop-blur-md before:-z-10 z-30 max-lg:shadow-xs">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-800 dark:text-gray-200 focus:outline-none"
          >
            <X className="w-7 h-7" />
          </button>

          <nav className="flex flex-col items-center space-y-6 text-lg font-semibold">
            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/settings/module"
              onClick={() => setIsOpen(false)}
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Module
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
