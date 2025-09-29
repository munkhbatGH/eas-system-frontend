"use client"

import { Logo } from "@/components/icons";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {Form} from "@heroui/form";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import Cookies from "js-cookie";
import { fetchClient } from "@/lib/fetchClient";
import { addToast } from "@heroui/toast";
// import axios from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter()
  const { setToken } = useUserStore();

  const onSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const options = {
        method: 'POST', body: JSON.stringify(data)
      }
      const res = await fetchClient('/auth/login', options)
      // const res = (await axios.post('/auth/login', data)).data
      if (res?.access_token) {
        setToken(res.access_token);
        Cookies.set(process.env.NEXT_PUBLIC_TOKEN || 'eas-token', res.access_token, { expires: 7 }); // 1 Day = 24 Hrs = 24*60*60 = 86400
        router.push("/admin");
      }
    } catch (error: any) {
      addToast({
        title: error.toString(),
        // color: "danger",
      })
    }
  };
  
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto h-10 w-auto text-center flex justify-center items-center">
          <Logo size={80} />
        </div>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Системд тавтай морил</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="w-full max-w-xs space-y-6" onSubmit={onSubmit}>
          <Input type="username" name="username" placeholder="username" className="w-[320px]" isRequired errorMessage="Please enter a valid username" />
          <Input type="password" name="password" placeholder="password" className="w-[320px]" isRequired errorMessage="Please enter a valid password" />

          {/* <Button
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Нэвтрэх
          </Button> */}
          <Button
            className="bg-linear-to-tr from-pink-500 to-yellow-500 shadow-lg flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            radius="full"
            type="submit"
          >
            Нэвтрэх
          </Button>
        </Form>

        <p className="mt-10 text-center font-semibold text-indigo-400 hover:text-indigo-300">
          Та бүртгэлгүй бол?
        </p>
      </div>
    </div>
  );
}
