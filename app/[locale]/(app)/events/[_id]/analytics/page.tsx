"use client";

import React, { useState, useEffect } from "react";
import StatsCard from "@/components/analytics/StatsCard";
import SalesAttendance from "@/components/analytics/SalesAttendance";
import EngagementWidget from "@/components/analytics/EngagementWidget";
import ChatInteractionWidget from "@/components/analytics/ChatInteractionWidget";
import PeakChatHoursWidget from "@/components/analytics/PeakChatHoursWidget";
import MarketingWidget from "@/components/analytics/MarketingWidget";
import { HiOutlineCurrencyDollar, HiOutlineTicket, HiOutlineUserGroup } from "react-icons/hi";
import { HiOutlineChartPie } from "react-icons/hi2";
import { useParams } from "next/navigation";
import { eventsService } from "@/lib/services/events.service";
import GameAnalyticsWidget from "@/components/analytics/GameAnalyticsWidget";

import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

export default function AnalyticsPage() {
  const params = useParams();
  const eventId = params._id as string;
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await eventsService.getEventStats(eventId);
        if (data) setStats(data);
      } catch (err) {
        console.error("Error fetching event stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [eventId]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">


      <div className="px-1 space-y-6">
        {/* Header Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatsCard 
            title="Total Revenue" 
            value={stats ? formatCurrency(stats.totalRevenue || 0) : "$0"} 
            trend="14.2%" 
            trendUp={true} 
            icon={<HiOutlineCurrencyDollar className="text-xl" />}
            data={[{value: 30}, {value: 40}, {value: 35}, {value: 50}, {value: 45}, {value: 60}, {value: 75}]}
            chartHeaderColor="#F79009"
          />
          <StatsCard 
            title="Net Profit" 
            value={stats ? formatCurrency((stats.totalRevenue || 0) * 0.4) : "$0"} 
            trend="6.8%" 
            trendUp={true} 
            icon={<HiOutlineChartPie className="text-xl" />}
            data={[{value: 20}, {value: 25}, {value: 22}, {value: 30}, {value: 28}, {value: 35}, {value: 40}]}
            chartHeaderColor="#F04438"
          />
          <StatsCard 
            title="Tickets Sold" 
            value={stats ? (stats.totalRegistrations || 0).toLocaleString() : "0"} 
            trend="21.4%" 
            trendUp={true} 
            icon={<HiOutlineTicket className="text-xl" />}
            data={[{value: 10}, {value: 15}, {value: 12}, {value: 20}, {value: 25}, {value: 30}, {value: 45}]}
            chartHeaderColor="#EB5017"
          />
          <StatsCard 
            title="Attendance Rate" 
            value={stats ? `${Math.round((stats.attendanceRate || 0) * 100)}%` : "0%"} 
            trend="1.2%" 
            trendUp={false} 
            icon={<HiOutlineUserGroup className="text-xl" />}
            data={[{value: 90}, {value: 88}, {value: 85}, {value: 82}, {value: 80}, {value: 78}, {value: 75}]}
            chartHeaderColor="#D92D20"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
          <div className="xl:col-span-2 space-y-5">
            <SalesAttendance />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ChatInteractionWidget />
              <PeakChatHoursWidget />
            </div>
          </div>
          <div className="space-y-5">
            <GameAnalyticsWidget />
            <EngagementWidget />
          </div>
        </div>

        {/* Marketing (Full Width) */}
        <div className="w-full h-auto">
          <MarketingWidget />
        </div>

      </div>
    </div>
  );
}