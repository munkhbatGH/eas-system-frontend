'use client';

import { useEffect } from 'react';
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useSystemStore } from "@/stores/systemStore";

export default function ToggleModeButton() {
  const { expanded, toggle } = useSystemStore();

  useEffect(() => {
    console.log('-------expanded-------', expanded)
  });

  return (
    <button
      onClick={toggle}
      className="ml-20 max-sm:m-0 p-4 transition-colors cursor-pointer"
    >
      <span
        className={`inline-block transition-transform duration-300 ease-in-out ${
          expanded ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
        }`}
      >
        {expanded ? <PanelRightOpen size={24} /> : <PanelRightClose size={24} />}
      </span>
    </button>
  );
}