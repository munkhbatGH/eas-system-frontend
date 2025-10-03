"use client"

import { title } from "@/components/primitives";
import { useCallback, useEffect, useRef, useState } from "react";
import EasTable from "@/components/ui/table";
import { fetchClient } from "@/lib/fetchClient";
import EasModal from "@/components/ui/modal";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { SchemaService } from "@/services/schema.service";
import { SpinnerIcon } from "@/components/icons";
import { addToast } from "@heroui/toast";
import {Select, SelectItem} from "@heroui/select";
import {Listbox, ListboxItem} from "@heroui/listbox";
import { PlusIcon, PlusSquare, SquarePen, Trash2 } from "lucide-react";
import { Chip } from "@heroui/chip";
import { useConfirm } from "@/components/ui/confirm/provider";

export default function Menu() {
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
    moduleId: null,
    parentId: null,
    code: '',
    name: '',
    order: 0
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
  const [moduleList, setModuleList] = useState<any[]>([]);
  const [isSaveAction, setIsSaveAction] = useState(false)
  const [actionSaveLoading, setActionSaveLoading] = useState(false)
  const [actionList, setActionList] = useState<any[]>([]);
  const [initAction, setInitAction] = useState<any>({
    _id: null,
    code: '',
    name: '',
    desc: ''
  });
  const confirm = useConfirm();

  const hasRun = useRef(false);
  
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    fetchInit();
  }, []);
  useEffect(() => {
    console.log('(effect) menu -> page:', page);
    getList(page);
  }, [page]);
  useEffect(() => {
    console.log('(effect) menu -> initData:', initData);
    if (!initData?._id) return
    if (initData?._id) {
      getActionList()
    }
  }, [initData]);


  //#region API calls

  const fetchInit = async () => {
    await getConfig();
    await getList();
    getModuleList();
  };
  const getConfig = async () => {
    try {
      const data = await fetchClient(SchemaService.config('SetMenu'))
      setColumns(data)
    } catch (error) {
      console.error('Error Menu -> getConfig:', error)
    }
  };
  const getList = async (initPage = 0) => {
    try {
      console.log('page -> getList:', initPage)
      setIsTableLoading(true)
      setLoading(true)
      const res = await fetchClient(SchemaService.list('SetMenu') + `?page=${page}&limit=${limit}`)
      console.log('page -> getList -> res:', res)
      if (res.total) {
        setTotal(res.total)
      }
      if (res.list) {
        setList(res.list)
      }
    } catch (error) {
      console.error('Error Menu -> getList:', error)
    } finally {
      setIsTableLoading(false)
      setLoading(false)
    }
  };
  const getModuleList = async () => {
    try {
      const res = await fetchClient(SchemaService.listNoLimit('SetModule'))
      if (res.list) {
        setModuleList(res.list)
      }
    } catch (error) {
      console.error('Error Menu -> getModuleList:', error)
    }
  };
  const getActionList = async () => {
    try {
      const res = await fetchClient(SchemaService.listById('SetAction', initData?._id))
      if (res.list) {
        setActionList(res.list)
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
      await fetchClient(SchemaService.post('SetMenu'), options)
      _close()
      await getList()
    } catch (error) {
      console.error('Error Menu -> save:', error)
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
      await fetchClient(SchemaService.put('SetMenu'), options)
      await getList()
    } catch (error) {
      console.error('Error Menu -> update:', error)
    } finally {
      setSaveLoading(false)
    }
  };
  const deleteApi = async (data: any) => {
    try {
      setSaveLoading(true)
      const options = {
        method: 'DELETE', body: JSON.stringify({ id: data })
      }
      await fetchClient(SchemaService.delete('SetMenu'), options)
      await getList()
    } catch (error) {
      console.error('Error Menu -> deleteApi:', error)
    } finally {
      setSaveLoading(false)
    }
  };
  const saveAction = async (data: any) => {
    try {
      setActionSaveLoading(true)
      const body = Object.assign({ menuId: initData._id }, data)
      const options = {
        method: 'POST', body: JSON.stringify(body)
      }
      if (!data._id) {
        await fetchClient(SchemaService.post('SetAction'), options)
      } else {
        await fetchClient(SchemaService.put('SetAction'), options)
      }
      setIsSaveAction(false)
      getActionList()
    } catch (error) {
      console.error('Error Menu -> saveAction:', error)
    } finally {
      setActionSaveLoading(false)
    }
  };
  const deleteAction = async (data: any) => {
    try {
      const options = {
        method: 'DELETE', body: JSON.stringify({ id: data._id })
      }
      await fetchClient(SchemaService.delete('SetAction'), options);
      getActionList()
    } catch (error) {
      console.error('Error Menu -> deleteAction:', error)
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
      if (data.parentId === '') data.parentId = null
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
  const _updateAction = (obj: any) => {
    const data = actionList.find(item => item._id === obj._id)
    setInitAction(data)
    setIsSaveAction(true)
  }
  const _deleteAction = async (obj: any) => {
    const data = actionList.find(item => item._id === obj._id)
    if (data) {
      const result = await confirm({
        title: 'Устгах',
        description: `(${data.name}) Та устгахдаа итгэлтэй байна уу?`,
        confirmText: 'Устгах',
      });
      if (result) {
        deleteAction(data)
      }
    }
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
      moduleId: null,
      parentId: null,
      code: '',
      name: '',
      order: 0
    })
    setSelectedRows([])
    setIsSaveAction(false)
    setActionList([])
    setActionSaveLoading(false)
    setInitAction({
      _id: null,
      code: '',
      name: '',
      desc: ''
    });
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
      <h1 className={title()}>Цэс</h1>
      <div className="mt-5">
        <EasModal title={dialogTitle} isDialog={isDialog} _close={_close} _open={_open} isUpdate={dialogTitle === 'Засварлах'}>
        { !isSaveAction && (
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
              name="moduleId"
              className=""
              defaultSelectedKeys={initData.moduleId ? [initData.moduleId._id] : []}
              label="Модуль сонгох"
              onSelectionChange={(value) => updateObject('moduleId', value.currentKey)}
            >
              {moduleList.map((item) => (
                <SelectItem key={item._id}>{item.name}</SelectItem>
              ))}
            </Select>
            <Select
              name="parentId"
              className=""
              defaultSelectedKeys={initData.parentId ? [initData.parentId._id] : []}
              label="Parent сонгох"
              onSelectionChange={(value) => updateObject('parentId', value.currentKey)}
            >
              {list.map((item) => (
                <SelectItem key={item._id}>{item.name}</SelectItem>
              ))}
            </Select>
            <Input
              isRequired
              errorMessage="Утга шаардана"
              label="Код"
              labelPlacement="outside"
              name="code"
              placeholder="Код"
              defaultValue={initData.code}
            />
            <Input
              isRequired
              errorMessage="Утга шаардана"
              label="Нэр"
              labelPlacement="outside"
              name="name"
              placeholder="Нэр"
              defaultValue={initData.name}
            />
            <NumberInput
              isRequired
              errorMessage="Утга шаардана"
              label="Дарааалал"
              labelPlacement="outside"
              name="order"
              placeholder="0"
              defaultValue={initData.order}
            />

            { initData && initData._id && (
              <div className="flex flex-col gap-3 border border-gray-200 rounded-lg w-full p-3 mt-2">
                <h1>Үйлдэл</h1>
                <div className="flex gap-3">
                  <Button color="success" variant="flat" onPress={() => setIsSaveAction(true)}>
                    <PlusIcon width={20} height={20} />
                  </Button>
                </div>
                <Listbox>
                  { actionList.map((item, index) => {
                    return (
                      <ListboxItem key={item.name}>
                        <div className="w-full flex justify-between">
                          <div>
                            {index + 1} .
                            <Chip color="secondary" variant="dot">
                              {item.name}
                            </Chip>
                          </div>
                          <div className="flex gap-1">
                            <Button isIconOnly aria-label="update" color="success" variant="flat" className="w-5 h-6" onPress={() => _updateAction(item)}>
                              <SquarePen width={16} height={16} />
                            </Button>
                            <Button isIconOnly aria-label="delete" color="danger" variant="flat" className="w-5 h-6" onPress={() => _deleteAction(item)}>
                              <Trash2 width={16} height={16} />
                            </Button>
                          </div>
                        </div>
                      </ListboxItem>
                    )
                  }) }
                </Listbox>
              </div>
            ) }
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
                  <Button type="submit" as="button" value="update" color="secondary" className="mt-3" isLoading={saveLoading} spinner={<SpinnerIcon />}>
                    Засах
                  </Button>
                )
              }
            </div>
          </Form>
        ) }
        { isSaveAction && (
          <div className="w-full">
            <Form
              className="w-full py-3" 
              onSubmit={(e: any) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.currentTarget));
                saveAction(Object.assign({ _id: initAction._id }, data))
              }}
            >
              <Input
                isRequired
                errorMessage="Утга шаардана"
                label="Код"
                labelPlacement="outside"
                name="code"
                placeholder="Код"
                defaultValue={initAction.code}
              />
              <Input
                isRequired
                errorMessage="Утга шаардана"
                label="Нэр"
                labelPlacement="outside"
                name="name"
                placeholder="Нэр"
                defaultValue={initAction.name}
              />
              <div className="flex mt-3 gap-3">
                <Button type="submit" color="primary" variant="flat"  isLoading={actionSaveLoading} spinner={<SpinnerIcon />}>
                  Хадгалах
                </Button>
                  <Button color="danger" variant="flat" onPress={() => setIsSaveAction(false)}>
                  Буцах
                </Button>
              </div>
            </Form>
          </div>
        ) }
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
