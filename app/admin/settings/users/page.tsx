"use client"

import { title } from "@/components/primitives";
import { useCallback, useEffect, useRef, useState } from "react";
import EasTable from "@/components/ui/table";
import { fetchClient } from "@/lib/fetchClient";
import EasModal from "@/components/ui/modal";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { SchemaService } from "@/services/schema.service";
import { SpinnerIcon } from "@/components/icons";
import { addToast } from "@heroui/toast";
import {Select, SelectItem} from "@heroui/select";

export default function Users() {
  const [columns, setColumns] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialog, setIsDialog] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [dialogTitle, setDialogTitle] = useState<string>('Бүртгэх')
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [initData, setInitData] = useState<any>({
    _id: null,
    roleId: null,
    name: '',
    // password: ''
  });
  const [dialogStatus, setDialogStatus] = useState<string>('create') // create | update
  const tableConfig = {
    columnFilters: true,
    globalFilter: true,
    pagination: true,
    sorting: true,
    tableClasses: "max-sm:max-w-[58%]",
  }
  const [limit, setLimit] = useState<number>(5);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [roleList, setRoleList] = useState<any[]>([]);

  const hasRun = useRef(false);
  
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    fetchInit();
  }, []);


  //#region API calls

  const fetchInit = async () => {
    await getConfig();
    await getList();
    getRoleList()
  };
  const getConfig = async () => {
    try {
      const data = await fetchClient(SchemaService.config('User'))
      setColumns(data)
    } catch (error) {
      console.error('Error Action -> getConfig:', error)
    }
  };
  const getList = async (initPage = 0) => {
    try {
      console.log('page -> getList:', initPage)
      setIsTableLoading(true)
      setLoading(true)
      const res = await fetchClient(SchemaService.list('User') + `?page=${page}&limit=${limit}`)
      if (res.total) {
        setTotal(res.total)
      }
      if (res.list) {
        setList(res.list)
      }
    } catch (error) {
      console.error('Error Action -> getList:', error)
    } finally {
      setIsTableLoading(false)
      setLoading(false)
    }
  };
  const getRoleList = async () => {
    try {
      const res = await fetchClient(SchemaService.listNoLimit('SetRole'))
      if (res.list) {
        setRoleList(res.list)
      }
    } catch (error) {
      console.error('Error Menu -> getModuleList:', error)
    }
  };
  const save = async (data: any) => {
    try {
      setSaveLoading(true)
      const options = {
        method: 'POST', body: JSON.stringify(data)
      }
      await fetchClient(SchemaService.post('User'), options)
      _close()
      await getList()
    } catch (error) {
      console.error('Error Action -> save:', error)
    } finally {
      setSaveLoading(false)
    }
  };
  const update = async (data: any) => {
    try {
      setSaveLoading(true)
      const options = {
        method: 'POST', body: JSON.stringify(data)
      }
      await fetchClient(SchemaService.put('User'), options)
      await getList()
    } catch (error) {
      console.error('Error Action -> update:', error)
    } finally {
      setSaveLoading(false)
    }
  };
  const deleteApi = async (data: any) => {
    console.log('deleteApi:', data)
    try {
      setSaveLoading(true)
      const options = {
        method: 'DELETE', body: JSON.stringify({ id: data })
      }
      await fetchClient(SchemaService.delete('User'), options)
      await getList()
    } catch (error) {
      console.error('Error Action -> deleteApi:', error)
    } finally {
      setSaveLoading(false)
    }
  };

  //#endregion

  //#region Handlers

  const _open = () => {
    setIsDialog(true)
  }
  const _update = () => {
    setDialogTitle('Засварлах')
    setDialogStatus('update')
    if (selectedRows.length === 0 || selectedRows.length > 1) {
      return addToast({ title: `Анхааруулга`, description: `Нэг мөр сонгоно уу!`, color: "danger" })
    }
    const selected = selectedRows[0]
    const row = list.find(item => item._id === selected)
    setInitData(row)
    setIsDialog(true)
  }
  const _close = () => {
    reset()
  }
  const _onSubmit = async (action: any, data: any) => {
    if (action === "create") {
      await save(data)
    } else if (action === "update") {
      await update(Object.assign({ _id: initData._id }, data))
    }
    _close()
    getList()
  };
  const _rowSelection = (data: any[]) => {
    setSelectedRows(data)
  }
  const _changeLimit = (value: number) => {
    setLimit(value);
  }
  const _changePage = useCallback((value: number) => {
    console.log('page -> _changePage:', value)
    setPage(value);
  }, []);
  const _deleteApi = () => {
    if (selectedRows.length === 0 || selectedRows.length > 1) {
      return addToast({ title: `Анхааруулга`, description: `Нэг мөр сонгоно уу!`, color: "danger" })
    }
    const selected = selectedRows[0]
    deleteApi(selected)
  }

  //#endregion

  //#region Actions
  const reset = () => {
    setIsDialog(false)
    setSaveLoading(false)
    setDialogTitle('Бүртгэх')
    setDialogStatus('create')
    setInitData({
      _id: null,
      roleId: null,
      name: '',
      // password: ''
    })
    setSelectedRows([])
  }
  const updateObject = (field: any, value: any) => {
    setInitData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  }
  //#endregion

  if (loading) {
    return <p>Уншиж байна ...</p>
  }

  return (
    <div className="w-full max-sm:w-[325px]">
      <h1 className={title()}>Хэрэглэгчид</h1>
      <div className="mt-5">
        <EasModal title={dialogTitle} isDialog={isDialog} _close={_close} _open={_open} isUpdate={dialogTitle === 'Засварлах'}>
          <Form
            className="w-full py-3" 
            onSubmit={(e: any) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));
              const submitter = e.nativeEvent.submitter as HTMLButtonElement | null;
              const action = submitter?.value;
              _onSubmit(action, data);
            }}
          >
            <Select
              isRequired
              name="roleId"
              className=""
              defaultSelectedKeys={initData.roleId ? [initData.roleId._id] : []}
              label="Дүр сонгох"
              onSelectionChange={(value) => updateObject('roleId', value.currentKey)}
            >
              {roleList.map((item) => (
                <SelectItem key={item._id}>{item.name}</SelectItem>
              ))}
            </Select>
            <Input
              isRequired
              errorMessage="Утга шаардана"
              label="Нэр"
              labelPlacement="outside"
              name="name"
              placeholder="Нэр"
              defaultValue={initData.name}
            />
            {/* <Input
              isRequired
              errorMessage="Утга шаардана"
              label="Нууц үг"
              labelPlacement="outside"
              name="password"
              placeholder="Нууц үг"
              defaultValue={initData.password}
            /> */}
            <div className="flex gap-3">
              {
                dialogStatus === 'create' && (
                  <Button type="submit" as="button" value="create" color="primary" className="mt-3" isLoading={saveLoading} spinner={<SpinnerIcon />}>
                    Бүртгэх
                  </Button>
                )
              }
              {
                dialogStatus === 'update' && (
                  <Button type="submit" as="button" value="update" color="primary" className="mt-3" isLoading={saveLoading} spinner={<SpinnerIcon />}>
                    Засах
                  </Button>
                )
              }
            </div>
          </Form>
        </EasModal>
        <EasTable
          isTableLoading={isTableLoading}
          tableConfig={tableConfig}
          columns={columns}
          rows={list}
          total={total}
          page={page}
          _openDialog={_open}
          _updateDialog={_update}
          _rowSelection={_rowSelection}
          _refreshList={getList}
          _changeLimit={_changeLimit}
          _changePage={_changePage}
          _delete={_deleteApi}
        />
      </div>
    </div>
  );
}
