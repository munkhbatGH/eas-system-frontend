"use client"

import { Logo } from "@/components/icons";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter()
  
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto h-10 w-auto text-center flex justify-center items-center">
          <Logo size={80} />
        </div>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Системд тавтай морил</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <Input type="username" placeholder="username" className="w-[320px]" />
          <Input type="password" placeholder="password" className="w-[320px]" />

          {/* <Button
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Нэвтрэх
          </Button> */}
          <Button
            className="bg-linear-to-tr from-pink-500 to-yellow-500 shadow-lg flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            radius="full"
            onPress={() => { router.push("/admin"); }}
          >
            Нэвтрэх
          </Button>
        </form>

        <p className="mt-10 text-center font-semibold text-indigo-400 hover:text-indigo-300">
          Та бүртгэлгүй бол?
        </p>
      </div>
    </div>
  );
}
