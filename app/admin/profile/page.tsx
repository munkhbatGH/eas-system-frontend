"use client"

import { title } from "@/components/primitives";
import axios from "@/lib/axios";
import { useEffect } from "react";

export default function Profile() {
  
  useEffect(() => {
    getUserInfo()
  }, []);

  const getUserInfo = async () => {
    try {
      const res = (await axios.get('/auth/profile')).data
      console.log('----getUserInfo-----', res)
    } catch (error) {
      console.log('Error during login:', error);
    }
  };

  return (
    <div>
      <h1 className={title()}>Profile</h1>
    </div>
  );
}
