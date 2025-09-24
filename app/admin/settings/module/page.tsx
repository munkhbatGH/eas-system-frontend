"use client"

import { title } from "@/components/primitives";
import axios from "@/lib/axios";
import { useEffect } from "react";
import EasTable from "@/components/ui/table";

export default function Profile() {
  
  useEffect(() => {
    list()
  }, []);

  const list = async () => {
    try {
      const data = (await axios.get('/schema/list/User')).data
      console.log('--module--list-----', data)
    } catch (error) {
      console.log('Error during login:', error)
    }
  };

  return (
    <div>
      <h1 className={title()}>Module</h1>
      <EasTable />
    </div>
  );
}
