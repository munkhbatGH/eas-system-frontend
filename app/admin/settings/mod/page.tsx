"use client"

import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import EasTable from "@/components/ui/table";
import { fetchClient } from "@/lib/fetchClient";
import EasModal from "@/components/ui/modal";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { SchemaService } from "@/services/schema.service";
import { SpinnerIcon } from "@/components/icons";

export default function Profile() {
  const [columns, setColumns] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialog, setIsDialog] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  
  const tableConfig = {
    columnFilters: true,
    globalFilter: true,
    pagination: true,
    sorting: true,
    tableClasses: "max-sm:max-w-[58%]",
  }
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await getConfig();
    await getList();
  };
  const getConfig = async () => {
    try {
      const data = await fetchClient(SchemaService.config('SetModule'))
      setColumns(data)
    } catch (error) {
      console.log('Error Mod -> getConfig:', error)
    }
  };
  const getList = async () => {
    try {
      const data = await fetchClient(SchemaService.list('SetModule'))
      setList(data)
    } catch (error) {
      console.log('Error Mod -> getList:', error)
    } finally {
      setIsTableLoading(false)
      setLoading(false)
    }
  };
  const save = async (data: any) => {
    try {
      setSaveLoading(true)
      const options = {
        method: 'POST', body: JSON.stringify(data)
      }
      await fetchClient(SchemaService.post('SetModule'), options)
      _close()
      await getList()
    } catch (error) {
      console.log('Error Mod -> save:', error)
    } finally {
      setSaveLoading(false)
    }
  };

  const _open = () => {
    setIsDialog(!isDialog)
  }
  const _close = () => {
    setIsDialog(false)
    setSaveLoading(false)
  }
  const _onSubmit = (e: any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    save(data)
  };

  if (loading) {
    return <p>Уншиж байна ...</p>
  }

  return (
    <div className="w-full max-sm:w-[325px]">
      <h1 className={title()}>Модуль</h1>
      <div className="mt-5">
        <EasModal isDialog={isDialog} _close={_close} _open={_open} >
          <Form className="w-full max-w-xs py-3" onSubmit={_onSubmit}>
            <Input
              isRequired
              errorMessage="Утга шаардана"
              label="Код"
              labelPlacement="outside"
              name="code"
              placeholder="Код"
            />
            <Input
              isRequired
              errorMessage="Утга шаардана"
              label="Нэр"
              labelPlacement="outside"
              name="name"
              placeholder="Нэр"
            />
            <Input
              isRequired
              errorMessage="Утга шаардана"
              label="Тайлбар"
              labelPlacement="outside"
              name="desc"
              placeholder="Тайлбар"
            />
            <Button type="submit" color="primary" className="mt-3" isLoading={saveLoading} spinner={<SpinnerIcon />}>
              Бүртгэх
            </Button>
          </Form>
        </EasModal>
        <EasTable isTableLoading={isTableLoading} tableConfig={tableConfig} columns={columns} listData={list} _openDialog={_open} />
      </div>
    </div>
  );
}
