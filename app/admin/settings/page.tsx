"use client"

import { title } from "@/components/primitives";
import { fetchClient } from "@/lib/fetchClient";
import { useEffect } from "react";

export default function Settings() {
  
  useEffect(() => {
    list()
  }, []);

  const list = async () => {
    try {
      // const data = await fetchClient('/schema/list')
      // console.log('----list-----', data)
    } catch (error) {
      console.log('Error Settings:', error);
    }
  };

  return (
    <div>
      <h1 className={title()}>Settings</h1>
    </div>
  );
}
