"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";
import InputComponent from "../ui/InputComponent";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { HiOutlineBell, HiOutlineX, HiOutlineMail, HiOutlineCalendar } from "react-icons/hi";

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (reminder: any) => void;
}

const AddReminderModal = ({ isOpen, onClose, onAdd }: AddReminderModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "task",
    priority: "medium",
    sendEmail: true,
    syncToCalendar: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) return;

    onAdd({
      ...formData,
      id: Date.now(),
    });
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "task",
      priority: "medium",
      sendEmail: true,
      syncToCalendar: true,
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
      <div className="relative">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EB5017]/10 flex items-center justify-center text-[#EB5017]">
              <HiOutlineBell size={20} />
            </div>
            <div>
              <h3 className="font-black text-[#1B1818] uppercase tracking-tight">New Reminder</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Schedule a task or milestone</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
          >
            <HiOutlineX size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <InputComponent
              label="Reminder Title"
              name="title"
              placeholder="e.g. Venue Walkthrough"
              value={formData.title}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-medium leading-6 block mb-1.5">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-[6px] px-2 h-10 outline-none placeholder:text-gray-400 font-normal text-sm leading-6 focus:border-[#FA9874] transition duration-200"
                  />
               </div>
               <div>
                  <label className="text-xs font-medium leading-6 block mb-1.5">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-[6px] px-2 h-10 outline-none placeholder:text-gray-400 font-normal text-sm leading-6 focus:border-[#FA9874] transition duration-200"
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium leading-6 block mb-1.5">Type</label>
                <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)}>
                  <SelectTrigger className="w-full h-10 border-gray-300">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="rehearsal">Rehearsal</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium leading-6 block mb-1.5">Priority</label>
                <Select value={formData.priority} onValueChange={(v) => handleSelectChange("priority", v)}>
                  <SelectTrigger className="w-full h-10 border-gray-300">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
               <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                     <HiOutlineMail size={16} />
                   </div>
                   <div>
                     <Label htmlFor="send-email" className="text-[11px] font-black uppercase tracking-tight">Send Email Reminder</Label>
                     <p className="text-[9px] text-gray-400 font-bold">Platform will notify attendees</p>
                   </div>
                 </div>
                 <Switch 
                   id="send-email" 
                   checked={formData.sendEmail} 
                   onCheckedChange={(checked) => handleToggleChange("sendEmail", checked)}
                 />
               </div>

               <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                     <HiOutlineCalendar size={16} />
                   </div>
                   <div>
                     <Label htmlFor="sync-calendar" className="text-[11px] font-black uppercase tracking-tight">Sync to Personal Calendar</Label>
                     <p className="text-[9px] text-gray-400 font-bold">Add to attendee calendars</p>
                   </div>
                 </div>
                 <Switch 
                   id="sync-calendar" 
                   checked={formData.syncToCalendar} 
                   onCheckedChange={(checked) => handleToggleChange("syncToCalendar", checked)}
                 />
               </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-medium leading-6 block">Description</label>
              <Textarea
                name="description"
                placeholder="Optional details about this reminder..."
                value={formData.description}
                onChange={handleChange}
                className="min-h-[80px] border-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-[#EB5017] text-white hover:bg-[#d64815] shadow-lg shadow-[#EB5017]/20 transition-all active:scale-[0.98]"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddReminderModal;
