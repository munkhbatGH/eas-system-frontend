"use client"

import { title } from "@/components/primitives";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { addToast } from "@heroui/toast";
import { Params } from "next/dist/server/request/params";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";

export default function Page({ params }: { params: Params }) {
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState(5);

  const requiredColumns = ["Name", "Email", "Age"]; // Define expected columns

  console.log('----- params -----', params);

  useEffect(() => {
    setLoading(false);
  }, []);
  useEffect(() => {
    console.log("useEffect columns:", columns);
  }, [columns]);
  useEffect(() => {
    console.log("useEffect rows:", rows);
  }, [rows]);

  //#region API calls



  //#endregion

  //#region Handlers

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    setError(null);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const json: any[] = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

    if (json.length > 0) {
      // setColumns(Object.keys(json[0]));
      // setRows(json);

      // 🧹 CLEAN EMPTY COLUMNS
      const { columns: cleanColumns, rows: cleanRows } = removeEmptyColumns(json);

      setColumns(cleanColumns);
      setRows(cleanRows);
    }

    // // Check missing columns
    // const missing = requiredColumns.filter((col) => !headers.includes(col));
    // if (missing.length > 0) {
    //   setError(`Missing columns: ${missing.join(", ")}`);
    // } else {
    //   setError(null);
    // }
  };
  const removeEmptyColumns = (rows: any[]): { columns: string[]; rows: any[] } => {
    if (!rows.length) return { columns: [], rows: [] };
  
    const columns = Object.keys(rows[0]);
  
    const nonEmptyColumns = columns.filter(col =>
      rows.some(row => row[col] !== "" && row[col] !== null && row[col] !== undefined)
    );
  
    const cleanedRows = rows.map(row => {
      const newRow: any = {};
      nonEmptyColumns.forEach(col => {
        newRow[col] = row[col];
      });
      return newRow;
    });
  
    return {
      columns: nonEmptyColumns,
      rows: cleanedRows,
    };
  }

  const handleUpload = async () => {
    if (!file) return addToast({ title: `Анхааруулга`, description: `Файл сонгоно уу!`, color: "danger" })
    if (error) return addToast({ title: `Анхааруулга`, description: `Файлын баганууд зөв эсэхийг шалгана уу!`, color: "danger" })

    const formData = new FormData();
    formData.append("file", file);

    const body = {
      type: "HrOrganization",
      rows
    }
    const res = await fetch("/excel/upload", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const result = await res.json();
    console.log(result);

    addToast({ title: `Амжиллтай`, description: `Файл амжилттай хадгалагдлаа.`, color: "success" })
  };

  //#endregion

  //#region Actions

  

  //#endregion

  const pages = Math.ceil(rows.length / Number(limit)) || 1;

  const onNextPage = useCallback(() => {
    console.log('onNextPage: ', page + 1);
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    console.log('onPreviousPage: ', page - 1);
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);
  const onChangePagination = useCallback((page: any) => {
    setPage(page);
  }, []);

  const bottomContent = useMemo(() => {
    return (
      <div className="w-full max-sm:max-w-[300px] py-2 px-2 flex justify-between items-center max-sm:flex-col max-sm:gap-2 max-sm:items-start">
        <div className="flex gap-5">
          <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-2 max-sm:items-start">
            <span className="text-default-400 text-small">Нийт {rows.length}</span>
          </div>
          {/* <label className="flex items-center text-default-400 text-small">
            Хуудаслалт:
            <select
              className="bg-transparent outline-solid outline-transparent text-default-400 text-small"
              onChange={onChangePaginationLimit}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label> */}
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={(page) => onChangePagination(page)}
        />
        <div className="hidden sm:flex justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Өмнөх
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Дараах
          </Button>
        </div>
      </div>
    );
  }, []);


  if (loading) {
    return <p>Уншиж байна ...</p>
  }

  return (
    <div className="w-full max-sm:w-[325px]">

      <h1 className={title()}>🧩 Өгөгдөл хөрвүүлэх дэлгэрэнгүй</h1>

      
      <div className="mt-5">

        <Link
          href="/admin/settings/dataMigration"
          className="text-blue-600 underline"
        >
          &larr; Жагсаалт руу буцах
        </Link>

        <div style={{ padding: "2rem" }}>
          <div className="flex gap-3 items-center">
            <Input type="file" accept=".xlsx,.xls" className="w-72" onChange={handleFileChange} />
            <Button className="mt-3" size="sm" variant="flat" color="primary" onPress={handleUpload}>
              Upload
            </Button>
          </div>

          {/* <pre>{JSON.stringify(columns, null, 2)}</pre> */}
          {/* <pre>{JSON.stringify(rows, null, 2)}</pre> */}

          <div className="w-full">
            {columns.length > 0 && rows.length > 0 && (
              <Table
                className="overflow-x-auto overflow-y-auto max-h-[600px] w-full sm:w-full lg:w-[90vw] xl:w-[95vw] 2xl:w-[1200px] border border-gray-300 rounded-lg mt-4"
                aria-label="Excel data table"
                isStriped
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
              >
                <TableHeader>
                  {columns.map((col) => (
                    <TableColumn key={col} className="min-w-[150px] lg:min-w-[220px] sticky top-0 bg-white z-20">{col}</TableColumn>
                  ))}
                </TableHeader>

                <TableBody>
                  {rows.map((row, idx) => (
                    <TableRow key={idx}>
                      {columns.map((col) => (
                        <TableCell key={col} className="min-w-[150px] lg:min-w-[220px]">{row[col]?.toString()}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
            )}
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

        </div>

      </div>
    </div>
  );
}

