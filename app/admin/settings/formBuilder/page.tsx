"use client"

import { title } from "@/components/primitives";
import { useCallback, useEffect, useRef, useState } from "react";
import DynamicFormBuilder from "@/components/ui/formBuilder";

export default function Organization() {
  const [loading, setLoading] = useState(true)


  //#region API calls



  //#endregion

  //#region Handlers

 

  //#endregion

  //#region Actions

  

  //#endregion

  // if (loading) {
  //   return <p>Уншиж байна ...</p>
  // }

  return (
    <div className="w-full max-sm:w-[325px]">
      <h1 className={title()}>🧩 Form Builder</h1>

      <div className="mt-5">
        <DynamicFormBuilder />
      </div>
    </div>
  );
}
