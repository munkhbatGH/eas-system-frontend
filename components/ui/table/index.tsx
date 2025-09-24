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
import dynamic from 'next/dynamic';
import { RefreshCcw } from "lucide-react";

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

export const SearchIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const ChevronDownIcon = ({strokeWidth = 1.5, ...otherProps}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const PlusIcon = ({size = 24, width, height, ...props}: any) => {
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
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M6 12h12" />
        <path d="M12 18V6" />
      </g>
    </svg>
  );
};


const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["id", "name", "age", "role", "team", "email", "status", "actions"];


interface ColumnFilter {
  [key: string]: string | number;
}


export default function EasTable(
  { tableConfig, columns, datas }:
  {
    tableConfig?: any,
    columns: Array<any>,
    datas: Array<any>,
  }
) {
  const tableId = useId();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);


  const [columnFilters, setColumnFilters] = useState<ColumnFilter>({});
  const updateColumnFilter = (columnKey: string, value: string | number) => {
    // setColumnFilters(prev => ({
    //   ...prev,
    //   [columnKey]: value
    // }));
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
  };


  const headerColumns = useMemo(() => {
    if (visibleColumns.size === columns?.length) return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filtered = [...datas];

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

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);


  const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  } as const;
  
  type ChipColor = typeof statusColorMap[keyof typeof statusColorMap]; // "success" | "danger" | "warning"
  
  function getColorFromStatus(status: string): ChipColor | "default" {
    return statusColorMap[status as keyof typeof statusColorMap] || "default";
  }

  const renderCell = useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "lg", src: item.avatar}}
            description={item.email}
            name={cellValue}
          >
            {item.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{item.team}</p>
          </div>
        );
      case "status": {
        return (
          <Chip className="capitalize" color={getColorFromStatus(item.status)} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      }
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view">View</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem key="delete">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const renderColumnFilter = (column: typeof columns[0]) => {
    if (!tableConfig?.columnFilters || !column.filterable) return null;

    const filterValue = columnFilters[column.uid] || '';

    switch (column.filterType) {
      case 'text':
        return (
          <Input
            size="sm"
            placeholder={`Filter ${column.name.toLowerCase()}...`}
            value={String(filterValue)}
            onChange={(e) => updateColumnFilter(column.uid, e.target.value)}
            onClear={() => clearColumnFilter(column.uid)}
            isClearable
            className="mt-2 text-xs border rounded-lg"
          />
        );

      case 'number':
        return (
          <Input
            size="sm"
            type="number"
            placeholder={`Filter ${column.name.toLowerCase()}...`}
            value={String(filterValue)}
            onChange={(e) => updateColumnFilter(column.uid, Number(e.target.value) || '')}
            onClear={() => clearColumnFilter(column.uid)}
            isClearable
            className="mt-2 text-xs border rounded-lg"
          />
        );

      case 'select':
        if (!column.options) return null;
        
        return (
          <Select
            size="sm"
            placeholder={`Filter ${column.name.toLowerCase()}...`}
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

      default:
        return null;
    }
  };

  const topContent = useMemo(() => {
    const hasActiveFilters = Object.keys(columnFilters).length > 0;
    return (
      <div className="flex flex-col gap-4">
        <div className={`flex gap-3 items-end max-sm:flex-col max-sm:items-start ${tableConfig?.columnFilters ? 'justify-end' : 'justify-between'}`}>
          {
            !tableConfig?.columnFilters && (
              <Input
                isClearable
                className="w-full sm:max-w-[44%] max-sm:max-w-[58%]"
                placeholder="Search ..."
                startContent={<SearchIcon />}
                value={filterValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
              />
            )
          }
          <div className="flex gap-3 max-sm:max-w-[58%]">
            <Button color="primary" endContent={<PlusIcon />}>
              Бүртгэх
            </Button>
            <Button color="success" endContent={<RefreshCcw width={16} height={16} />}>
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
        <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-2 max-sm:items-start">
          <span className="text-default-400 text-small">Нийт {datas.length}</span>

            {hasActiveFilters && (
              <Button 
                color="danger" 
                variant="light" 
                size="sm"
                onPress={clearAllFilters}
              >
                Clear All Filters ({Object.keys(columnFilters).length})
              </Button>
            )}

          <label className="flex items-center text-default-400 text-small">
            Хуудаслалт:
            <select
              className="bg-transparent outline-solid outline-transparent text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>



        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-small text-default-500">Active filters:</span>
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
        )}

      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    datas.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center max-sm:flex-col max-sm:gap-2 max-sm:items-start">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys.size === filteredItems.length
            ? "All items selected"
            : `${selectedKeys.size} / ${filteredItems.length}`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Өмнөх
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Дараах
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const DynamicTable = dynamic(
    () => Promise.resolve(() => (
      <Table
        id={tableId}
        isHeaderSticky
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px] w-full max-sm:max-w-[33%] overflow-x-auto",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={headerColumns} className="haha">
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className=""
            >
              <div className="flex flex-col">
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
        <TableBody emptyContent={"No datas found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    )),
    { 
      ssr: false,
      loading: () => (
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
  );
  
  return (
    <DynamicTable />
  );
}
