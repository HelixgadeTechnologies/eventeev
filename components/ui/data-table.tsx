"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Input } from "./input";
import { MoveLeft, MoveRight } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPagination?: boolean;
}


const DataTable = <TData, TValue>({
  columns,
  data,
  isPagination = false,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<any>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    state: {
      sorting,
      globalFilter,
    }
  });

  return (
    <>
    <div  className="p-4 border border-[#E4E7EC] rounded-t-[10px] bg-white shadow-sm flex justify-between items-center text-sm">
      <Input
      value={globalFilter}
      onChange={e => table.setGlobalFilter(String(e.target.value))}
      placeholder="Search..."
      className="w-1/3"
    />
    </div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="!p-6 !bg-[#F9FAFB] border-b-[#E4E7EC]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="!p-6 bg-white border-b-[#E4E7EC]x"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isPagination && <div className="p-4 border border-[#E4E7EC] rounded-b-[10px] bg-white shadow-sm flex justify-between items-center text-sm">
          <div className="font-semibold text-[#667185]">Page 1 of 30</div>
        <ul className="flex gap-x-1 items-center">
          <li className="w-6 h-6 rounded-[6px] flex justify-center items-center transition-colors duration-100 hover:bg-[#FFECE5] hover:text-[#EB5017] text-[#EB5017] bg-[#FFECE5]">1</li>
          <li className="w-6 h-6 rounded-[6px] flex justify-center items-center transition-colors duration-100 hover:bg-[#FFECE5] hover:text-[#EB5017] text-[#98A2B3]">2</li>
          <li className="w-6 h-6 rounded-[6px] flex justify-center items-center transition-colors duration-100 hover:bg-[#FFECE5] hover:text-[#EB5017] text-[#98A2B3]">3</li>
        </ul>
        <div className="flex gap-x-4 items-center">
          <button className="px-3 py-2 rounded-[8px] border border-[#D0D5DD] text-[#344054] cursor-pointer flex items-center gap-x-[10px]"><MoveLeft /> Previous</button>
          <button className="px-3 py-2 rounded-[8px] border border-[#D0D5DD] text-[#344054] cursor-pointer flex items-center gap-x-[10px]"><MoveRight /> Next</button>
        </div>
        </div>}
    </>
  );
};

export default DataTable;
