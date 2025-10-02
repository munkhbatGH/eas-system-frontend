"use client"

import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import {
  Table, TableHeader, TableColumn, TableBody,
  TableRow, TableCell
} from "@heroui/table";
import { useId, useCallback, useEffect, useMemo, useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { ChevronDownIcon, PlusIcon, RefreshCcw, SearchIcon, SquarePen, Trash2 } from "lucide-react";

export const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Paused", uid: "paused"},
  {name: "Vacation", uid: "vacation"},
];

export function capitalize(s: any) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const VerticalDotsIcon = ({size = 24, width, height, ...props}: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};


interface ColumnFilter {
  [key: string]: string | number;
}


const tableActions = ['create', 'edit', 'delete', 'view'];

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
} as const;
type ChipColor = typeof statusColorMap[keyof typeof statusColorMap]; // "success" | "danger" | "warning"


export default function EasTable(
  {
    isTableLoading, tableConfig, columns, rows, total, page,
    _openDialog, _updateDialog, _rowSelection, _refreshList, _changeLimit, _changePage,
    _delete
  }:
  {
    isTableLoading?: boolean,
    tableConfig?: any,
    columns: Array<any>,
    rows: Array<any>,
    total: number,
    page: number,
    _openDialog: any,
    _updateDialog: any,
    _rowSelection: any,
    _refreshList: any,
    _changeLimit: any,
    _changePage: any,
    _delete: any,
  }
) {
  const tableId = useId();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set(columns.map(a => { return a.uid })));
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  // const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);
  const [selectedColor, setSelectedColor] = useState<"primary" | "default" | "secondary" | "success" | "warning" | "danger">("primary");
  const [columnFilters, setColumnFilters] = useState<ColumnFilter>({});


  // useEffect(() => {
  //   console.log('total (effect):', total);
  // }, [total]);


  //#region Filters

  const updateColumnFilter = (columnKey: string, value: string | number) => {
    if (typeof value === "string" && value.length < 3) return;
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };
  const clearColumnFilter = (columnKey: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
  };
  const clearAllFilters = () => {
    setColumnFilters({});
    _refreshList();
  };

  //#endregion

  //#region Memos & Callbacks

  const getColorFromStatus = (status: string): ChipColor | "default" => {
    return statusColorMap[status as keyof typeof statusColorMap] || "default";
  }

  const headerColumns = useMemo(() => {
    if (visibleColumns.size === columns?.length) return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filtered = [...rows];

    Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
      if (filterValue !== '' && filterValue !== undefined) {
        filtered = filtered.filter(user => {
          const userValue = user[columnKey as keyof typeof user];
          
          if (typeof userValue === 'string' && typeof filterValue === 'string') {
            return userValue.toLowerCase().includes(filterValue.toLowerCase());
          }
          if (typeof userValue === 'number' && typeof filterValue === 'number') {
            return userValue === filterValue;
          }
          
          return String(userValue).toLowerCase().includes(String(filterValue).toLowerCase());
        });
      }
    });

    return filtered;
  }, [columnFilters]);

  const pages = Math.ceil(total / Number(limit)) || 1;

  const onNextPage = useCallback(() => {
    console.log('onNextPage: ', page + 1);
    if (page < pages) {
      // setPage(page + 1);
      _changePage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    console.log('onPreviousPage: ', page - 1);
    if (page > 1) {
      // setPage(page - 1);
      _changePage(page - 1);
    }
  }, [page]);

  const onChangePaginationLimit = useCallback((e: any) => {
    setLimit(Number(e.target.value));
    // setPage(1);
    _changeLimit(Number(e.target.value));
    // _changePage(1);
  }, []);
  const onChangePagination = useCallback((page: any) => {
    // setPage(page)
    _changePage(page);
  }, []);

  const onSearchChange = useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
      // setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    // setPage(1);
  }, []);

  //#endregion

  //#region Renders

  const renderCell = useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];
    const foundColumn = headerColumns.find(item => item.uid === columnKey)

    if (!foundColumn) return ''
    switch (foundColumn.filterType) {
      case 'object': {
        if (columnKey === 'createdUserId') {
          return (
            <User
              avatarProps={{radius: "lg", src: 'https://avatars.githubusercontent.com/u/30373425?v=4'}}
              description={cellValue.name}
              name={cellValue.name}
            >
              {cellValue.name}
            </User>
          );
        } else {
          return 'haha'
        }
      }
      case 'ObjectId': {
        return cellValue.name
      }
      case 'text': {
        return cellValue
      }
      default: return cellValue
    }

    // switch (columnKey) {
    //   case 'moduleId':
    //     return columnKey
    //   case "createdUserId":
    //     if (!cellValue) return ''
    //     return (
    //       <User
    //         avatarProps={{radius: "lg", src: 'https://avatars.githubusercontent.com/u/30373425?v=4'}}
    //         description={cellValue.name}
    //         name={cellValue.name}
    //       >
    //         {cellValue.name}
    //       </User>
    //     );
    //   case "role":
    //     return (
    //       <div className="flex flex-col">
    //         <p className="text-bold text-small capitalize">{cellValue}</p>
    //         <p className="text-bold text-tiny capitalize text-default-400">{item.team}</p>
    //       </div>
    //     );
    //   case "status": {
    //     return (
    //       <Chip className="capitalize" color={getColorFromStatus(item.status)} size="sm" variant="flat">
    //         {cellValue}
    //       </Chip>
    //     );
    //   }
    //   case "actions":
    //     return (
    //       <div className="relative flex justify-end items-center gap-2">
    //         <Dropdown>
    //           <DropdownTrigger>
    //             <Button isIconOnly size="sm" variant="light">
    //               <VerticalDotsIcon className="text-default-300" />
    //             </Button>
    //           </DropdownTrigger>
    //           <DropdownMenu>
    //             <DropdownItem key="view">View</DropdownItem>
    //             <DropdownItem key="edit">Edit</DropdownItem>
    //             <DropdownItem key="delete">Delete</DropdownItem>
    //           </DropdownMenu>
    //         </Dropdown>
    //       </div>
    //     );
    //   default:
    //     return cellValue;
    // }
  }, []);

  const renderColumnFilter = (column: typeof columns[0]) => {
    if (!tableConfig?.columnFilters || !column.filterable) return null;
    const filterValue = columnFilters[column.uid] || '';
    switch (column.filterType) {
      case 'text': {
        return (
          <Input
            size="sm"
            placeholder={` ${column.name.toLowerCase()}...`}
            defaultValue={String(filterValue)}
            onChange={(e) => updateColumnFilter(column.uid, e.target.value)}
            onClear={() => clearColumnFilter(column.uid)}
            isClearable
            className="mt-2 text-xs border rounded-lg"
          />
        );
      }
      case 'number': {
        return (
          <Input
            size="sm"
            type="number"
            placeholder={` ${column.name.toLowerCase()}...`}
            defaultValue={String(filterValue)}
            onChange={(e) => updateColumnFilter(column.uid, Number(e.target.value) || '')}
            onClear={() => clearColumnFilter(column.uid)}
            isClearable
            className="mt-2 text-xs border rounded-lg"
          />
        );
      }
      case 'select': {
        if (!column.options) return null;
        return (
          <Select
            size="sm"
            placeholder={` ${column.name.toLowerCase()}...`}
            selectedKeys={filterValue ? [String(filterValue)] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              if (selectedKey) {
                updateColumnFilter(column.uid, String(selectedKey));
              } else {
                clearColumnFilter(column.uid);
              }
            }}
            className="mt-2 text-xs border rounded-lg"
          >
            {column.options.map((option: any) => (
              <SelectItem 
                key={typeof option === 'string' ? option : option.uid}
                // value={typeof option === 'string' ? option : option.uid}
              >
                {typeof option === 'string' ? option : option.name}
              </SelectItem>
            ))}
          </Select>
        );
      }
      default: return null;
    }
  };

  const topContent = useMemo(() => {
    const hasActiveFilters = Object.keys(columnFilters).length > 0;
    return (
      <div className="flex flex-col gap-4 w-full max-sm:max-w-[300px]">
        <div className={`flex gap-3 items-end max-sm:flex-col max-sm:items-start justify-between w-full`}>
          <div className="flex gap-2">
            {
              tableActions.includes('create') && (
                <Button color="success" endContent={<PlusIcon />} variant="flat" onPress={_openDialog}>
                  Бүртгэх
                </Button>
              )
            }
            {
              tableActions.includes('edit') && (
                <Button
                  color="secondary" endContent={<SquarePen />} variant="flat"
                  onPress={() => {
                    _updateDialog()
                  }}
                >
                  Засах
                </Button>
              )
            }
            {
              tableActions.includes('edit') && (
                <Button
                  color="danger" endContent={<Trash2 />} variant="flat"
                  onPress={() => {
                    _delete()
                  }}
                >
                  Устгах
                </Button>
              )
            }
            {
              !tableConfig?.columnFilters && (
                <Input
                  isClearable
                  className="w-full"
                  placeholder="Search ..."
                  startContent={<SearchIcon />}
                  value={filterValue}
                  onClear={() => onClear()}
                  onValueChange={onSearchChange}
                />
              )
            }
          </div>
          <div className="flex gap-3">
            <Button color="primary" endContent={<RefreshCcw className="text-small" width={16} height={16} />} variant="flat" onPress={_refreshList}>
              Сэргээх
            </Button>
            {/* <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Төлөв
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  setStatusFilter(String(selectedKey));
                }}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Багана
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  const selectedKeys = new Set(
                    Array.isArray(keys) ? keys : Array.from(keys)
                  );
                  setVisibleColumns(selectedKeys);
                }}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {hasActiveFilters && (
          <Button 
            color="danger" 
            variant="light" 
            size="sm"
            onPress={clearAllFilters}
          >
            Хайлт цэвэрлэх ({Object.keys(columnFilters).length})
          </Button>
        )}
        {/* {hasActiveFilters && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-small text-default-500">Шүүлтүүд:</span>
            {Object.entries(columnFilters).map(([columnKey, value]) => {
              const column = columns.find(col => col.uid === columnKey);
              return (
                <Chip
                  key={columnKey}
                  onClose={() => clearColumnFilter(columnKey)}
                  variant="flat"
                  color="primary"
                  size="sm"
                >
                  {column?.name}: "{value}"
                </Chip>
              );
            })}
          </div>
        )} */}

      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onChangePaginationLimit,
    filteredItems.length,
    onSearchChange,
    hasSearchFilter,
    selectedKeys,
    columnFilters,
  ]);

  const bottomContent = useMemo(() => {
    const hasActiveFilters = Object.keys(columnFilters).length > 0;
    return (
      <div className="w-full max-sm:max-w-[300px] py-2 px-2 flex justify-between items-center max-sm:flex-col max-sm:gap-2 max-sm:items-start">
        <div className="flex gap-5">
          <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-2 max-sm:items-start">
            <span className="text-default-400 text-small">Нийт {total}</span>

              {/* {hasActiveFilters && (
                <Button 
                  color="danger" 
                  variant="light" 
                  size="sm"
                  onPress={clearAllFilters}
                >
                  Хайлт цэвэрлэх ({Object.keys(columnFilters).length})
                </Button>
              )} */}
          </div>
          <label className="flex items-center text-default-400 text-small">
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
          </label>
          {/* <span className="text-small text-default-400">
            {selectedKeys.size === filteredItems.length
              ? "All items selected"
              : `${selectedKeys.size} / ${filteredItems.length}`}
          </span> */}
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
  }, [selectedKeys, filteredItems.length, page, pages, hasSearchFilter]);

  //#endregion


  return (
    <>
      {
        isTableLoading && (
          <div className="w-full max-h-[382px] animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4" />
            <div className="rounded-lg gap-1 flex flex-col">
              <div className="h-10 bg-gray-100" />
              <div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-50" />
                ))}
              </div>
            </div>
            <div className="h-12 bg-gray-200 rounded mt-4" />
          </div>
        )
      }
      {
        !isTableLoading && (
          <Table
            id={tableId}
            isHeaderSticky
            aria-label="Easy table"
            classNames={{
              wrapper: "max-h-[382px] w-full max-sm:max-w-[350px] overflow-x-auto",
            }}
            topContent={topContent}
            topContentPlacement="outside"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            // selectedKeys={selectedKeys}
            selectionMode="multiple"
            color={selectedColor}
            defaultSelectedKeys={selectedKeys}
            onSelectionChange={(keys) => {
              setSelectedKeys(new Set(keys as Iterable<string | number>));
              _rowSelection(Array.from(keys));
            }}
          >
            <TableHeader columns={headerColumns} className="">
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                  className=""
                >
                  <div className="flex flex-col p-3">
                    <div className="flex items-center gap-1">
                      {column.name}
                      {columnFilters[column.uid] && (
                        <Chip
                          size="sm"
                          color="primary"
                          variant="flat"
                          onClose={() => clearColumnFilter(column.uid)}
                        >
                          ×
                        </Chip>
                      )}
                    </div>
                    {renderColumnFilter(column)}
                  </div>
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"Өгөгдөл байхгүй"} items={filteredItems}>
              {(item) => (
                <TableRow key={item._id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                  {/* {(columnKey) => <TableCell>{columnKey}</TableCell>} */}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )
      }
    </>
  );
}
