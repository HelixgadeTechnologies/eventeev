"use client";

import React from "react";
import StatsCard from "@/components/analytics/StatsCard";
import SalesAttendance from "@/components/analytics/SalesAttendance";
import EngagementWidget from "@/components/analytics/EngagementWidget";
import ChatInteractionWidget from "@/components/analytics/ChatInteractionWidget";
import MarketingWidget from "@/components/analytics/MarketingWidget";
import { HiOutlineCurrencyDollar, HiOutlineTicket, HiOutlineUserGroup } from "react-icons/hi";
import { HiOutlineChartPie } from "react-icons/hi2";

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-6 pb-20">
      {/* Header Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value="$1.24M" 
          trend="14.2%" 
          trendUp={true} 
          icon={<HiOutlineCurrencyDollar className="text-xl" />}
          data={[{value: 30}, {value: 40}, {value: 35}, {value: 50}, {value: 45}, {value: 60}, {value: 75}]}
          chartHeaderColor="#F79009"
        />
        <StatsCard 
          title="Net Profit" 
          value="$482.5K" 
          trend="6.8%" 
          trendUp={true} 
          icon={<HiOutlineChartPie className="text-xl" />}
          data={[{value: 20}, {value: 25}, {value: 22}, {value: 30}, {value: 28}, {value: 35}, {value: 40}]}
          chartHeaderColor="#F04438"
        />
        <StatsCard 
          title="Tickets Sold" 
          value="18,540" 
          trend="21.4%" 
          trendUp={true} 
          icon={<HiOutlineTicket className="text-xl" />}
          data={[{value: 10}, {value: 15}, {value: 12}, {value: 20}, {value: 25}, {value: 30}, {value: 45}]}
          chartHeaderColor="#EB5017"
        />
        <StatsCard 
          title="Attendance Rate" 
          value="94.2%" 
          trend="1.2%" 
          trendUp={false} 
          icon={<HiOutlineUserGroup className="text-xl" />}
          data={[{value: 90}, {value: 88}, {value: 85}, {value: 82}, {value: 80}, {value: 78}, {value: 75}]}
          chartHeaderColor="#D92D20"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales & Attendance (Spans 2 columns) */}
        <div className="xl:col-span-2">
            <SalesAttendance />
        </div>
        
        {/* Engagement Widget */}
        <div>
            <EngagementWidget />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         {/* Chat Interaction */}
         <div>
            <ChatInteractionWidget />
         </div>

         {/* Marketing & Demographics (Spans 2 columns) */}
         <div className="xl:col-span-2">
            <MarketingWidget />
         </div>
      </div>
    </div>
  );
}