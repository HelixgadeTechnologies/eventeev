"use client";

import React, { useState } from "react";
import { 
  HiOutlineBanknotes, 
  HiOutlineMapPin, 
  HiOutlineShieldCheck, 
  HiOutlineCpuChip,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineDocumentText,
  HiOutlineInformationCircle
} from "react-icons/hi2";
import { Label } from "@/components/ui/label";

export default function PaymentSettings() {
  const [bankName, setBankName] = useState("Global Trust Bank");
  const [accountHolder, setAccountHolder] = useState("John Doe Events Ltd");
  const [swift, setSwift] = useState("GTBXXX22");
  const [iban, setIban] = useState("GB00 1234 5678 9012");
  
  const [addressLine1, setAddressLine1] = useState("123 Business Square");
  const [city, setCity] = useState("London");
  const [postalCode, setPostalCode] = useState("SW1A 1AA");
  const [country, setCountry] = useState("united-kingdom");

  return (
    <div className="h-full flex flex-col overflow-hidden p-4 md:p-6 bg-white select-none">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-xl font-bold text-[#1B1818] leading-tight tracking-tight">Payment & Payout Settings</h1>
        <p className="text-[10px] font-medium text-[#C27E33] mt-0.5 opacity-90 leading-relaxed max-w-2xl">
          Configure your financial information, manage payment gateways, and track your revenue.
        </p>
      </header>

      {/* Main Content Areas */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Payouts & Gateways */}
          <div className="flex-1 space-y-6 min-w-0">
            
            {/* Payout Account Details */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <HiOutlineBanknotes className="text-sm text-[#EB5017]" />
                <h3 className="text-xs font-bold text-[#1B1818] uppercase tracking-wider">Payout Account</h3>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Bank Name</Label>
                    <input 
                      type="text" 
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Account Holder</Label>
                    <input 
                      type="text" 
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">SWIFT Code</Label>
                    <input 
                      type="text" 
                      value={swift}
                      onChange={(e) => setSwift(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">IBAN / Account No.</Label>
                    <input 
                      type="text" 
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Connected Gateways */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <HiOutlineCpuChip className="text-sm text-[#EB5017]" />
                <h3 className="text-xs font-bold text-[#1B1818] uppercase tracking-wider">Connected Gateways</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-[#EB5017] rounded-lg p-3 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-[#635BFF]">Stripe</span>
                    <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase">Connected</span>
                  </div>
                  <button className="w-full py-1 text-[9px] font-bold text-[#EB5017] border border-[#EB5017]/20 rounded hover:bg-[#EB5017] hover:text-white transition-all">
                    Manage
                  </button>
                </div>
                
                <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-[#003087]">PayPal</span>
                    <span className="text-[8px] font-bold text-gray-400">Inactive</span>
                  </div>
                  <button className="w-full py-1 text-[9px] font-bold text-white bg-[#EB5017] rounded hover:opacity-90 transition-all">
                    Connect
                  </button>
                </div>

                <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-[#00C3F7]">Paystack</span>
                    <span className="text-[8px] font-bold text-gray-400">Inactive</span>
                  </div>
                  <button className="w-full py-1 text-[9px] font-bold text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-all">
                    Connect
                  </button>
                </div>
              </div>
            </section>

            {/* Billing Address */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <HiOutlineMapPin className="text-sm text-[#EB5017]" />
                <h3 className="text-xs font-bold text-[#1B1818] uppercase tracking-wider">Billing Address</h3>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Street Address</Label>
                  <input 
                    type="text" 
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">City</Label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Postal Code</Label>
                    <input 
                      type="text" 
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">Country</Label>
                    <select 
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="united-kingdom">United Kingdom</option>
                      <option value="united-states">United States</option>
                      <option value="nigeria">Nigeria</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Summaries & Help */}
          <div className="w-full lg:w-[280px] flex-none space-y-4 pt-7">
            
            {/* Simple Revenue Summary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">
               <h3 className="text-xs font-bold text-[#1B1818] uppercase tracking-wider">Revenue Summary</h3>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400">Gross Sales</span>
                    <span className="text-[#1B1818]">$4,920.00</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold border-b border-gray-50 pb-2">
                    <span className="text-gray-400">Fees</span>
                    <span className="text-red-500">-$361.40</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[11px] font-bold text-[#EB5017]">Net Profit</span>
                    <span className="text-lg font-black text-green-600">$4,558.60</span>
                  </div>
               </div>
            </div>

            {/* Payout Policy */}
            <div className="bg-[#FFFBF7] border border-orange-100 rounded-2xl p-4 space-y-3 shadow-sm">
               <div className="flex items-center gap-2">
                 <HiOutlineShieldCheck className="text-lg text-[#EB5017]" />
                 <h4 className="text-xs font-bold text-[#EB5017]">Payout Policy</h4>
               </div>
               <p className="text-[10px] font-medium text-[#B28A6A] leading-relaxed">
                  Payouts are typically processed within 3-5 business days after your event has concluded successfully.
               </p>
            </div>

            {/* Resources Help Tip */}
            <div className="bg-[#FFF4ED] rounded-xl p-3 border border-orange-100 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#EB5017] flex items-center justify-center text-white shrink-0">
                  <HiOutlineInformationCircle className="text-xs" />
                </div>
                <h4 className="font-bold text-[#EB5017] text-[11px]">Resources</h4>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <a href="#" className="flex items-center justify-between group">
                  <span className="text-[9px] font-bold text-gray-500 group-hover:text-[#EB5017]">Payout Schedule</span>
                  <HiOutlineArrowTopRightOnSquare className="text-[10px] text-orange-300" />
                </a>
                <a href="#" className="flex items-center justify-between group">
                  <span className="text-[9px] font-bold text-gray-500 group-hover:text-[#EB5017]">Tax Documents</span>
                  <HiOutlineDocumentText className="text-[10px] text-orange-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2DBD4;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
