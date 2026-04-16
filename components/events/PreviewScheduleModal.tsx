import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { LuClock3 } from "react-icons/lu";
import Avatar from "@/components/ui/Avatar";
import { ScheduleItem } from './AddScheduleModal';

interface PreviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: ScheduleItem[];
  eventName?: string;
}

export default function PreviewScheduleModal({ isOpen, onClose, schedules, eventName = "Event" }: PreviewScheduleModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#F9FAFB] rounded-[32px] shadow-2xl w-full max-w-3xl overflow-hidden relative flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white shrink-0">
              <div>
                <h3 className="text-xl font-black text-[#1B1818] tracking-tight">{eventName} Schedule</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Attendee Preview</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 text-gray-500 hover:text-[#1B1818] hover:bg-gray-100 transition-all shadow-sm"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 relative">
                
              {schedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <LuClock3 className="text-2xl text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[#1B1818] font-black text-lg">No activities yet</p>
                    <p className="text-gray-400 text-sm font-medium">Add some schedule items to preview them here.</p>
                  </div>
                </div>
              ) : (
                <div className="relative border-l-4 border-gray-200/60 ml-4 md:ml-6 space-y-8 py-4">
                  {schedules.map((item, index) => (
                    <div key={item.id} className="relative pl-8 md:pl-12 group">
                      {/* Timeline dot */}
                      <div className={`absolute -left-[14px] top-6 h-6 w-6 rounded-full border-[6px] border-[#F9FAFB] transition-colors duration-300 shadow-sm ${
                        item.type === "Break" || item.type === "Networking" ? "bg-gray-300" : "bg-[#EB5017]"
                      } group-hover:scale-125 z-10`} />
                      
                      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          
                          {/* Left Side: Time & Info */}
                          <div className="space-y-4 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-sm font-black text-[#EB5017] bg-[#EB5017]/10 px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-inner">
                                {item.startTime}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                                <LuClock3 className="text-sm" />
                                {item.endTime}
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                                  item.type === "Keynote" ? "bg-purple-50 text-purple-600 border-purple-100" :
                                  item.type === "Workshop" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                  item.type === "Break" ? "bg-gray-100 text-gray-500 border-gray-200" :
                                  item.type === "Networking" ? "bg-teal-50 text-teal-600 border-teal-100" :
                                  "bg-orange-50 text-orange-600 border-orange-100"
                              }`}>
                                  {item.type}
                              </span>
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-black text-[#1B1818] tracking-tight">{item.title}</h3>
                              <p className="text-sm text-gray-500 font-medium leading-relaxed mt-1 max-w-xl">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Right Side: Speaker */}
                          {item.speakers && item.speakers[0] && (
                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-[24px] border border-gray-100 shrink-0 md:w-[220px]">
                              <Avatar name={item.speakers[0].name} isBigger={false} />
                              <div className="overflow-hidden flex-1">
                                <p className="font-black text-xs text-[#1B1818] uppercase tracking-tighter truncate">
                                  {item.speakers[0].name}
                                </p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate mt-0.5">
                                  {item.speakers[0].role}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex justify-end">
                 <button
                    onClick={onClose}
                    className="px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest text-white bg-[#1B1818] hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95"
                  >
                    Close Preview
                  </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
