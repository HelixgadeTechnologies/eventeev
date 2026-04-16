import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import TimePicker from '@/components/ui/TimePicker';

export interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  speakers?: {
    name: string;
    role: string;
  }[];
  type: "Keynote" | "Workshop" | "Break" | "Activity" | "Networking";
}

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (schedule: ScheduleItem) => void;
  onEdit?: (schedule: ScheduleItem) => void;
  editItem?: ScheduleItem | null;
}

export default function AddScheduleModal({ isOpen, onClose, onAdd, onEdit, editItem }: AddScheduleModalProps) {
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    title: "",
    description: "",
    type: "Activity" as ScheduleItem["type"],
    speakerName: "",
    speakerRole: "",
  });

  React.useEffect(() => {
    if (editItem && isOpen) {
      const mainSpeaker = editItem.speakers?.[0];
      setFormData({
        startTime: editItem.startTime,
        endTime: editItem.endTime,
        title: editItem.title,
        description: editItem.description,
        type: editItem.type,
        speakerName: mainSpeaker?.name || "",
        speakerRole: mainSpeaker?.role || "",
      });
    } else if (isOpen) {
      setFormData({
        startTime: "",
        endTime: "",
        title: "",
        description: "",
        type: "Activity",
        speakerName: "",
        speakerRole: "",
      });
    }
  }, [editItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: ScheduleItem = {
      id: editItem?.id || `s-${Date.now()}`,
      startTime: formData.startTime,
      endTime: formData.endTime,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      ...(formData.speakerName && {
        speakers: [{
          name: formData.speakerName,
          role: formData.speakerRole,
        }]
      })
    };
    
    if (editItem && onEdit) {
      onEdit(newSchedule);
    } else {
      onAdd(newSchedule);
    }
    
    setFormData({
      startTime: "",
      endTime: "",
      title: "",
      description: "",
      type: "Activity",
      speakerName: "",
      speakerRole: "",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-[#1B1818] tracking-tight">{editItem ? "Edit Schedule" : "Add New Schedule"}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{editItem ? "Update this activity" : "Create an activity"}</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Start Time</label>
                  <TimePicker
                    value={formData.startTime}
                    onChange={(time) => setFormData({ ...formData, startTime: time })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">End Time</label>
                  <TimePicker
                    value={formData.endTime}
                    onChange={(time) => setFormData({ ...formData, endTime: time })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all"
                  placeholder="Activity Title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all resize-none"
                  placeholder="Brief description of the activity..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ScheduleItem["type"] })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all"
                >
                  <option value="Activity">Activity</option>
                  <option value="Keynote">Keynote</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Break">Break</option>
                  <option value="Networking">Networking</option>
                </select>
              </div>

              <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm space-y-4">
                <p className="text-[10px] font-black text-[#EB5017] uppercase tracking-widest">Optional: Speaker Info</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Speaker Name</label>
                    <input
                      type="text"
                      value={formData.speakerName}
                      onChange={(e) => setFormData({ ...formData, speakerName: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Speaker Role</label>
                    <input
                      type="text"
                      value={formData.speakerRole}
                      onChange={(e) => setFormData({ ...formData, speakerRole: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#EB5017]/20 focus:border-[#EB5017] transition-all"
                      placeholder="CEO, TechCorp"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4  flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest text-[#1B1818] bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest text-white bg-[#EB5017] hover:bg-[#d64815] transition-all shadow-xl shadow-[#EB5017]/20 active:scale-95"
                >
                  {editItem ? "Save Changes" : "Add Schedule"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
