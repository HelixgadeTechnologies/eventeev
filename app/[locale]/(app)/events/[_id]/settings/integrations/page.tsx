"use client";

import React from "react";
import { HiOutlineShare } from "react-icons/hi2";

export default function IntegrationSettings() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-10 bg-white text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <HiOutlineShare className="text-4xl text-blue-500" />
      </div>
      <h1 className="text-2xl font-bold text-[#1B1818] mb-2">Integrations</h1>
      <p className="text-gray-500 max-w-md">
        Connect your event to external tools like Slack, Zoom, and Mailchimp to automate your workflow.
      </p>
    </div>
  );
}
