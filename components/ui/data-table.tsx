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
import { FiSearch } from "react-icons/fi";

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
  const [globalFilter, setGlobalFilter] = React.useState("");
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
    initialState: {
        pagination: {
            pageSize: 5,
        }
    },
    state: {
      sorting,
      globalFilter,
    }
  });

  return (
    <>
    <div className="w-full bg-white rounded-[40px] shadow-sm border border-gray-100 p-2 pl-6 flex items-center md:max-w-4xl mx-auto mb-8">
        <FiSearch className="text-[#98A2B3] text-xl" />
        <Input
          value={globalFilter}
          onChange={e => table.setGlobalFilter(String(e.target.value))}
          placeholder="Search..."
          className="flex-grow px-4 outline-none text-[#1B1818] text-base placeholder:text-[#98A2B3] font-normal border-none shadow-none focus-visible:ring-0"
        />
        <button className="bg-[#eb5017] text-white px-8 py-3.5 rounded-[32px] font-bold hover:bg-[#d64815] transition-all transform active:scale-95 shadow-lg shadow-[#eb5017]/20 ml-2">
          Search
        </button>
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
      {isPagination && (
        <div className="p-4 border-t border-[#E4E7EC] bg-white rounded-b-[10px] flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
               <MoveLeft size={16} /> Previous
            </button>
            <button
              className="px-3 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next <MoveRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;
