"use client";

import React from "react";
import AnalyticsCard from "@/components/display/AnalyticsCard";
import DataTable from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlineTicket, HiOutlineHeart, HiOutlineShoppingBag, HiOutlineArrowUpRight, HiOutlineWallet } from "react-icons/hi2";

type Transaction = {
  id: string;
  source: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
};

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-[#eb5017]/5 flex items-center justify-center border border-[#eb5017]/10">
          {row.getValue("source") === "Ticket Sales" ? (
            <HiOutlineTicket className="text-[#eb5017]" />
          ) : (
            <HiOutlineHeart className="text-[#eb5017]" />
          )}
        </div>
        <span className="font-bold text-[#1B1818] text-sm">{row.getValue("source")}</span>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="text-gray-500 text-sm font-medium">{row.getValue("date")}</span>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <span className="font-black text-[#1B1818] text-sm">₦{amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            status === "completed"
              ? "bg-green-50 text-green-600"
              : status === "pending"
              ? "bg-orange-50 text-[#eb5017]"
              : "bg-red-50 text-red-600"
          }`}
        >
          {status}
        </span>
      );
    },
  },
];

const transactions: Transaction[] = [
  { id: "1", source: "Ticket Sales", amount: 25000, status: "completed", date: "Jan 12, 2024" },
  { id: "2", source: "Donations", amount: 5000, status: "completed", date: "Jan 11, 2024" },
  { id: "3", source: "Ticket Sales", amount: 12000, status: "pending", date: "Jan 10, 2024" },
  { id: "4", source: "Ticket Sales", amount: 45000, status: "completed", date: "Jan 08, 2024" },
  { id: "5", source: "Donations", amount: 2500, status: "failed", date: "Jan 07, 2024" },
];

export default function MonetizationPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 p-4 md:p-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-[#1B1818] tracking-tight">Monetization</h1>
          <p className="text-gray-500 font-medium max-w-lg">
            Track your earnings, manage payout methods, and explore new ways to monetize your events.
          </p>
        </div>
        <button className="bg-[#1B1818] text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-200 group">
          <HiOutlineWallet className="text-xl" />
          Configure Payouts
          <HiOutlineArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard title="Total Revenue" value={1250000} percentage={12.5} icon="/icons/revenue-active.svg" isCurrency />
        <AnalyticsCard title="Pending Payouts" value={450000} percentage={-2.4} icon="/icons/payout-active.svg" isCurrency />
        <AnalyticsCard title="Total Donations" value={85000} percentage={18.2} icon="/icons/heart-active.svg" isCurrency />
      </div>

      {/* Methods and History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monetization Methods */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-black text-[#1B1818] tracking-tight">Monetization Methods</h2>
          <div className="space-y-4">
            <MethodCard
              icon={<HiOutlineTicket className="text-2xl" />}
              title="Ticket Sales"
              description="Sell tickets for your events with custom tiers."
              status="active"
            />
            <MethodCard
              icon={<HiOutlineHeart className="text-2xl" />}
              title="Donations"
              description="Receive direct support from your attendees."
              status="active"
            />
            <MethodCard
              icon={<HiOutlineShoppingBag className="text-2xl" />}
              title="Merchandise"
              description="Connect your store to sell event gear."
              status="coming-soon"
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#1B1818] tracking-tight">Recent Transactions</h2>
            <button className="text-[#eb5017] font-black text-xs uppercase tracking-widest hover:underline underline-offset-4">
              View All
            </button>
          </div>
          <DataTable columns={columns} data={transactions} hideSearch />
        </div>
      </div>
    </div>
  );
}

function MethodCard({ icon, title, description, status }: { icon: React.ReactNode; title: string; description: string; status: "active" | "coming-soon" }) {
  return (
    <div className="group bg-white/95 backdrop-blur-xl border border-gray-100 p-6 rounded-[28px] shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      <div className="relative z-10 space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-[#eb5017]/5 flex items-center justify-center border border-[#eb5017]/10 group-hover:scale-110 transition-transform">
          <span className="text-[#eb5017]">{icon}</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-[#1B1818] text-lg leading-none">{title}</h3>
            {status === "coming-soon" && (
              <span className="text-[8px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                Soon
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs font-medium leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="absolute top-0 right-0 p-4 transform translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all">
        <HiOutlineArrowUpRight className="text-[#eb5017] text-xl" />
      </div>
    </div>
  );
}
