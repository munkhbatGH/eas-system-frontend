"use client"

import { title } from "@/components/primitives";
import { fetchClient } from "@/lib/fetchClient";
import { useEffect } from "react";

export default function Profile() {
  
  useEffect(() => {
    getUserInfo()
  }, []);

  const getUserInfo = async () => {
    try {
      const res = await fetchClient('/auth/profile')
      console.log('----getUserInfo-----', res)
    } catch (error) {
      console.log('Error Profile:', error);
    }
  };

  return (
    <div>
      <h1 className={title()}>Profile</h1>
    </div>
  );
}
