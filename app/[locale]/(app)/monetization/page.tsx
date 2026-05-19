"use client";

import React from "react";
import {
  HiOutlineTicket,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineArrowUpRight,
  HiOutlineWallet,
  HiOutlineBanknotes,
  HiOutlineCreditCard,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineInboxArrowDown,
} from "react-icons/hi2";
import { toast } from "sonner";

function StatCard({
  title,
  icon,
  iconBg,
}: {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="w-full h-[120px] p-5 bg-white/95 backdrop-blur-xl border border-gray-100 flex justify-between items-center gap-4 rounded-[28px] shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col flex-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{title}</p>
        <p className="font-black text-2xl text-gray-200 tracking-tight leading-none mb-2">—</p>
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">No data yet</p>
      </div>
      <div
        className="h-12 w-12 rounded-2xl flex justify-center items-center border group-hover:scale-110 transition-all shadow-sm"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
    </div>
  );
}

function MethodCard({
  icon,
  title,
  description,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: "active" | "coming-soon";
}) {
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

export default function MonetizationPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-[#1B1818] tracking-tight">Monetization</h1>
          <p className="text-gray-500 font-medium max-w-lg">
            Track your earnings, manage payout methods, and explore new ways to monetize your events.
          </p>
        </div>
        <button
          onClick={() => toast.info("Payout configuration coming soon.")}
          className="bg-[#1B1818] text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-200 group"
        >
          <HiOutlineWallet className="text-xl" />
          Configure Payouts
          <HiOutlineArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          icon={<HiOutlineBanknotes className="text-[#eb5017] text-2xl" />}
          iconBg="#eb501710"
        />
        <StatCard
          title="Pending Payouts"
          icon={<HiOutlineCreditCard className="text-[#eb5017] text-2xl" />}
          iconBg="#eb501710"
        />
        <StatCard
          title="Total Donations"
          icon={<HiOutlineHeart className="text-[#eb5017] text-2xl" />}
          iconBg="#eb501710"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#1B1818] tracking-tight">Recent Transactions</h2>
          </div>

          <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-[28px] py-16 px-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <HiOutlineInboxArrowDown className="text-3xl text-gray-300" />
            </div>
            <div className="space-y-1">
              <p className="font-black text-[#1B1818] text-sm uppercase tracking-tight">No transactions yet</p>
              <p className="text-xs text-gray-400 font-medium max-w-xs leading-relaxed">
                Transactions will appear here once attendees purchase tickets or make donations to your events.
              </p>
            </div>
            <div className="flex items-center gap-4 pt-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
              <span className="flex items-center gap-1"><HiOutlineArrowTrendingUp /> Revenue</span>
              <span className="flex items-center gap-1"><HiOutlineArrowTrendingDown /> Refunds</span>
              <span className="flex items-center gap-1"><HiOutlineHeart /> Donations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
