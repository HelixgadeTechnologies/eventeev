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
  ColumnFiltersState,
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
import { MoveLeft, MoveRight, ListFilter } from 'lucide-react';
import { FiSearch } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "@/lib/utils";

export interface FilterConfig {
  columnId: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'number';
  options?: { label: string; value: string }[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPagination?: boolean;
  hideSearch?: boolean;
  filters?: FilterConfig[];
}


const DataTable = <TData, TValue>({
  columns,
  data,
  isPagination = false,
  hideSearch = false,
  filters = [],
}: DataTableProps<TData, TValue>) => {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
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
      columnFilters,
    }
  });

  return (
    <>
      <div className="flex flex-col xl:flex-row xl:items-center gap-6 mb-8 mt-2">
        {!hideSearch && (
          <div className="flex-1 w-full bg-white rounded-[40px] shadow-sm border border-gray-100 p-2 pl-6 flex items-center min-w-0">
              <FiSearch className="text-[#98A2B3] text-xl shrink-0" />
              <Input
                value={globalFilter}
                onChange={e => table.setGlobalFilter(String(e.target.value))}
                placeholder="Search..."
                className="flex-grow px-4 outline-none text-[#1B1818] text-base placeholder:text-[#98A2B3] font-normal border-none shadow-none focus-visible:ring-0"
              />
              <button className="bg-[#eb5017] text-white px-8 py-3.5 rounded-[32px] font-bold hover:bg-[#d64815] transition-all transform active:scale-95 shadow-lg shadow-[#eb5017]/20 ml-2 hidden md:block">
                Search
              </button>
          </div>
        )}

        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#EB5017] bg-[#EB5017]/5 px-4 py-2.5 rounded-full border border-[#EB5017]/10 shrink-0">
              <ListFilter size={14} />
              Filters
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => (
                <div key={filter.columnId} className="flex items-center gap-2">
                  {filter.type === 'select' ? (
                    <Select
                      value={(table.getColumn(filter.columnId)?.getFilterValue() as string) ?? ""}
                      onValueChange={(value) => table.getColumn(filter.columnId)?.setFilterValue(value === "all" ? "" : value)}
                    >
                      <SelectTrigger className="h-11 rounded-full border-gray-100 bg-white shadow-sm px-4 min-w-[140px] text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:border-[#EB5017]/30 transition-colors">
                        <SelectValue placeholder={filter.label} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All {filter.label}s</SelectItem>
                        {filter.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : filter.type === 'date' ? (
                    <div className="relative">
                      <Input
                        type="date"
                        value={(table.getColumn(filter.columnId)?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn(filter.columnId)?.setFilterValue(e.target.value)}
                        className="h-11 rounded-full border-gray-100 bg-white shadow-sm px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 focus-visible:ring-[#EB5017]"
                      />
                    </div>
                  ) : filter.type === 'number' ? (
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder={filter.label}
                        value={(table.getColumn(filter.columnId)?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn(filter.columnId)?.setFilterValue(e.target.value)}
                        className="h-11 rounded-full border-gray-100 bg-white shadow-sm px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 focus-visible:ring-[#EB5017] max-w-[120px]"
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <button
              onClick={() => table.resetColumnFilters()}
              className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#EB5017] transition-colors rounded-full hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        )}
      </div>

    <div className="bg-white border border-gray-100 rounded-[24px] shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                  className="hover:bg-gray-50/50 transition-colors"
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
                  className="text-center h-48"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                      <FiSearch className="text-gray-300 text-xl" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No matching tickets found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isPagination && (
        <div className="p-4 border-t border-[#E4E7EC] bg-white rounded-b-[10px] flex items-center justify-between">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-6 py-2 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all flex items-center gap-2"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
               <MoveLeft size={14} /> Previous
            </button>
            <button
              className="px-6 py-2 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all flex items-center gap-2"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next <MoveRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default DataTable;
