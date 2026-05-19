"use client";

import React from "react";
import {
  HiOutlineCalendar,
  HiOutlineBell,
  HiOutlineChatBubbleLeftRight,
  HiOutlineEnvelope,
  HiOutlineVideoCamera,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

const INTEGRATIONS = [
  {
    name: "Slack",
    description: "Send real-time event updates and alerts to your Slack workspace channels.",
    icon: <HiOutlineChatBubbleLeftRight className="text-2xl" />,
    color: "#4A154B",
    status: "coming-soon",
  },
  {
    name: "Zoom",
    description: "Automatically create and manage Zoom meetings linked to your event sessions.",
    icon: <HiOutlineVideoCamera className="text-2xl" />,
    color: "#2D8CFF",
    status: "coming-soon",
  },
  {
    name: "Mailchimp",
    description: "Sync your attendee list and automate marketing emails through Mailchimp.",
    icon: <HiOutlineEnvelope className="text-2xl" />,
    color: "#FFE01B",
    colorText: "#1B1818",
    status: "coming-soon",
  },
  {
    name: "Google Calendar",
    description: "Add event sessions directly to attendees' Google Calendar with one click.",
    icon: <HiOutlineCalendar className="text-2xl" />,
    color: "#4285F4",
    status: "coming-soon",
  },
  {
    name: "Zapier",
    description: "Connect Eventeev to 5,000+ apps with no-code automations via Zapier.",
    icon: <HiOutlineArrowTopRightOnSquare className="text-2xl" />,
    color: "#FF4A00",
    status: "coming-soon",
  },
  {
    name: "Webhooks",
    description: "Push event data to any custom endpoint in real time using HTTP webhooks.",
    icon: <HiOutlineBell className="text-2xl" />,
    color: "#eb5017",
    status: "coming-soon",
  },
];

export default function IntegrationSettings() {
  return (
    <div className="h-full flex flex-col overflow-hidden p-4 md:p-6 bg-white select-none">
      <header className="mb-6">
        <h1 className="text-xl font-black text-[#1B1818] leading-tight tracking-tight">Integrations</h1>
        <p className="text-[10px] font-medium text-[#C27E33] mt-0.5 opacity-90 leading-relaxed max-w-2xl">
          Connect your event to external tools to automate your workflow. All integrations are coming soon.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {INTEGRATIONS.map((integration) => (
            <div
              key={integration.name}
              className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${integration.color}18`, color: integration.colorText || integration.color }}
                >
                  {integration.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-[#1B1818] text-sm leading-none">{integration.name}</h3>
                    <span className="text-[8px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full shrink-0">
                      Soon
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{integration.description}</p>
                </div>
              </div>
              <button
                disabled
                className="mt-4 w-full py-2 rounded-lg border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-300 cursor-not-allowed"
              >
                Connect
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-[#FFF4ED] rounded-xl p-4 border border-orange-100">
          <p className="text-[10px] font-bold text-[#C27E33] leading-relaxed">
            <span className="text-[#eb5017]">Integrations are in active development.</span> You'll be notified as each one becomes available. Have a specific integration request? Contact us.
          </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2DBD4; border-radius: 10px; }
      `}</style>
    </div>
  );
}
