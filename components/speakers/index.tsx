"use client";

import React, { useEffect, useState } from "react";
import GridList from "./gridList";
import TableList from "./tableList";
import { RxDashboard } from "react-icons/rx";
import { List, CirclePlus, Download, Loader2, AlertCircle, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { FiSearch } from "react-icons/fi";
import SpeakersSummary from "./SpeakersSummary";
import SpeakerDetailView from "./SpeakerDetailView";
import SpeakerForm from "./SpeakerForm";
import EditSpeakerModal from "./EditSpeakerModal";
import { SpeakerDataType } from "@/lib/demo-data/speakers";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { speakersService, ApiSpeaker } from "@/lib/services/speakers.service";
import { useParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ActionConfirmationModal from "@/components/ui/ActionConfirmationModal";

const Speakers = () => {
  const params = useParams();
  const eventId = params?._id as string;
  
  const [speakers, setSpeakers] = useState<SpeakerDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGrid, setIsGrid] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [speakerToEdit, setSpeakerToEdit] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [speakerToDelete, setSpeakerToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    description: "",
    variant: "primary" as "primary" | "danger" | "success" | "error"
  });

  const fetchSpeakers = async () => {
    setLoading(true);
    const { data, error } = await speakersService.getSpeakers(eventId);
    if (error) {
      setError(error.message || "Failed to load speakers");
    } else {
      // Map ApiSpeaker to SpeakerDataType for UI components
      const mappedSpeakers: SpeakerDataType[] = data.map((s: any) => ({
        id: s._id || s.id,
        name: s.firstName && s.lastName ? `${s.firstName} ${s.lastName}` : (s.name || "Unknown Speaker"),
        title: s.title,
        company: s.company,
        twitterHandle: s.socialLinks?.twitter || s.twitterHandle || "@handle",
        topic: s.topic || "General Discussion",
        avatar: s.photo || s.image || "/speaker-avatar.png",
      }));
      setSpeakers(mappedSpeakers);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (eventId) {
      fetchSpeakers();
    }
  }, [eventId]);

  const exportToCSV = () => {
    const headers = ["Name", "Title", "Twitter", "Company", "Topic"];
    const csvRows = filteredSpeakers.map(s => [
      `"${s.name}"`,
      `"${s.title}"`,
      `"${s.twitterHandle}"`,
      `"${s.company}"`,
      `"${s.topic}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `speakers-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSpeakerClick = (speaker: SpeakerDataType) => {
    setSelectedSpeaker(speaker);
    setIsDetailOpen(true);
  };

  const handleEditClick = (speaker: SpeakerDataType) => {
    setSpeakerToEdit(speaker);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: any) => {
    if (!speakerToEdit?.id) return;
    setIsUpdating(true);
    const { error } = await speakersService.updateSpeaker(speakerToEdit.id, data);
    
    if (error) {
      setAlertModal({ isOpen: true, title: "Error", description: error.message || "Failed to update speaker", variant: "error" });
    } else {
      await fetchSpeakers();
      setIsEditModalOpen(false);
      setShowSuccessModal(true);
    }
    setIsUpdating(false);
  };

  const handleAdd = async (data: any) => {
    setIsUpdating(true); // Reuse as loading state for add
    const { error } = await speakersService.createSpeaker({
      ...data,
      eventId
    });
    
    if (error) {
      setAlertModal({ isOpen: true, title: "Error", description: error.message || "Failed to add speaker", variant: "error" });
    } else {
      await fetchSpeakers();
      setIsAddModalOpen(false);
    }
    setIsUpdating(false);
  };

  const handleDeleteClick = (speaker: SpeakerDataType) => {
    setSpeakerToDelete(speaker);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!speakerToDelete?.id) return;
    setIsDeleting(true);
    const { error } = await speakersService.deleteSpeaker(speakerToDelete.id);
    if (error) {
      setAlertModal({ isOpen: true, title: "Error", description: error.message || "Failed to delete speaker", variant: "error" });
    } else {
      await fetchSpeakers();
    }
    setIsDeleting(false);
    setIsDeleteConfirmOpen(false);
    setSpeakerToDelete(null);
  };

  const filteredSpeakers = speakers.filter((speaker) =>
    speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (speaker.topic || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    speaker.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <SpeakersSummary />
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full bg-white/50 backdrop-blur-md rounded-full shadow-sm border border-gray-100 p-1.5 flex items-center group focus-within:ring-2 focus-within:ring-[#EB5017]/10 focus-within:border-[#EB5017] transition-all">
          <div className="pl-5 pr-3">
            <FiSearch className="text-[#98A2B3] text-lg group-focus-within:text-[#EB5017] transition-colors" />
          </div>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search speakers, topics, or companies..."
            className="flex-grow bg-transparent border-none shadow-none focus-visible:ring-0 text-[#1B1818] text-sm font-medium placeholder:text-gray-400 h-10"
          />
          <button className="bg-[#EB5017] text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#d64815] transition-all transform active:scale-95 shadow-lg shadow-[#eb5017]/10">
            Search
          </button>
        </div>

        <div className="flex items-center gap-2 bg-gray-50/50 backdrop-blur-sm p-1.5 rounded-full border border-gray-100">
          <button
            onClick={() => setIsGrid(true)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              isGrid ? "bg-white text-[#EB5017] shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <RxDashboard size={18} />
          </button>
          <button
            onClick={() => setIsGrid(false)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              !isGrid ? "bg-white text-[#EB5017] shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List size={18} />
          </button>
        </div>

        <button 
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 bg-white border border-gray-100 text-[#1B1818] px-6 h-[54px] rounded-full font-black text-[10px] uppercase tracking-widest hover:border-[#EB5017] hover:text-[#EB5017] transition-all shadow-xl shadow-black/5 hover:shadow-md group active:scale-95"
        >
          <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          Export CSV
        </button>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <button className="bg-[#EB5017] flex items-center gap-2 text-white h-[54px] rounded-full px-8 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#EB5017]/20 hover:scale-[1.02] active:scale-95 transition-all">
              <CirclePlus size={18} /> Add New Speaker
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[86rem] bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-[32px] p-0 overflow-hidden font-sans border gap-0">
            <DialogHeader className="p-8 pb-0 shrink-0">
              <DialogTitle className="text-2xl font-black text-[#1B1818] tracking-tight">Add New Speaker</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 font-medium">
                Create a professional profile for your event speakers.
              </DialogDescription>
            </DialogHeader>

            <div className="p-8 pt-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
              <SpeakerForm 
                onSubmit={handleAdd} 
                onCancel={() => setIsAddModalOpen(false)} 
                submitLabel="Save Speaker"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Loader2 className="w-8 h-8 text-[#EB5017] animate-spin" />
          <p className="text-gray-500 font-medium">Synchronizing speakers...</p>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Speakers</AlertTitle>
          <AlertDescription>
            {error}. <button onClick={fetchSpeakers} className="underline font-bold ml-1">Try again</button>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="mt-4">
          {filteredSpeakers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-xl rounded-[40px] border border-dashed border-gray-200 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#1B1818] uppercase tracking-tight">No Speakers Yet</h3>
                <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">
                  Start building your event program by adding professional speakers.
                </p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 bg-[#EB5017] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#EB5017]/10 hover:scale-105 active:scale-95 transition-all"
              >
                Get Started
              </button>
            </div>
          ) : isGrid ? (
            <GridList 
              data={filteredSpeakers} 
              onSpeakerClick={handleSpeakerClick} 
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ) : (
            <TableList 
              data={filteredSpeakers} 
              onSpeakerClick={handleSpeakerClick} 
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          )}
        </div>
      )}

      <SpeakerDetailView 
        speaker={selectedSpeaker} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
      />

      <EditSpeakerModal
        isOpen={isEditModalOpen}
        onClose={() => !isUpdating && setIsEditModalOpen(false)}
        speaker={speakerToEdit}
        onUpdate={handleUpdate}
      />

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-3xl border-none shadow-2xl p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
            <HiOutlineCheckCircle className="text-3xl text-green-500" />
          </div>
          <DialogTitle className="text-2xl font-black text-[#1B1818] tracking-tight mb-2">
            Speaker Updated
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-gray-500 mb-8">
            The speaker profile has been updated successfully.
          </DialogDescription>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="w-full bg-[#1B1818] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all transform active:scale-95 shadow-xl shadow-black/10"
          >
            Great, Thanks!
          </button>
        </DialogContent>
      </Dialog>

      <ActionConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => !isDeleting && setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Speaker?"
        description={`Are you sure you want to remove ${speakerToDelete?.name || 'this speaker'} from your event? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Keep Speaker"
        isLoading={isDeleting}
        variant="danger"
      />

      <ActionConfirmationModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        description={alertModal.description}
        variant={alertModal.variant}
        confirmLabel="OK"
        hideCancelButton
      />
    </div>
  );
};

export default Speakers;
