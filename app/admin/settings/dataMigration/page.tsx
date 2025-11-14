"use client"

import { title } from "@/components/primitives";
import { useCallback, useEffect, useRef, useState } from "react";
import EasTable from "@/components/ui/table";
import { fetchClient } from "@/lib/fetchClient";
import { SchemaService } from "@/services/schema.service";
import { useConfirm } from "@/components/ui/confirm/provider";
import Link from "next/link";

export default function Menu() {
  const [columns, setColumns] = useState<any[]>([]);
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isTableLoading, setIsTableLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [initData, setInitData] = useState<any>({
    _id: null,
    moduleId: null,
    parentId: null,
    code: '',
    name: '',
    path: '',
    icon: '',
    order: 0
  });
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
  const [menuList, setMenuList] = useState<any[]>([])

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
    if (!initData?._id) return;
  }, [initData]);


  //#region API calls

  const fetchInit = async () => {
    await getConfig();
    await getList();
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

  //#endregion

  //#region Handlers

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

  //#endregion

  //#region Actions
  const reset = () => {
    setInitData({
      _id: null,
      moduleId: null,
      parentId: null,
      code: '',
      name: '',
      path: '',
      icon: '',
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
      <h1 className={title()}>🧩 Өгөгдөл хөрвүүлэх</h1>
      <div className="mt-5">
        <Link href={`/admin/settings/dataMigration/1`} className="text-blue-600 underline">
          Excel файлаас өгөгдөл импортлох
        </Link>

        <EasTable
          includeActions={""}
          excludeActions={"create edit delete"}
          isTableLoading={isTableLoading}
          tableConfig={tableConfig}
          columns={columns}
          rows={list}
          total={total}
          page={page}
          _rowSelection={_rowSelection}
          _refreshList={getList}
          _changeLimit={_changeLimit}
          _changePage={_changePage}
        />
      </div>
    </div>
  );
}
