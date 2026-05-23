"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  HiOutlineUsers, 
  HiOutlineUserPlus, 
  HiOutlineTrash, 
  HiOutlineEllipsisVertical, 
  HiOutlineInformationCircle,
  HiOutlineCheck,
  HiOutlineChevronUpDown
} from "react-icons/hi2";
import { toast } from "sonner";
import { 
  collaboratorsService, 
  ApiCollaborator 
} from "@/lib/services/collaborators.service";
import ActionConfirmationModal from "@/components/ui/ActionConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function CollaboratorsSettings() {
  const params = useParams();
  const eventId = params?._id as string;

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [collaborators, setCollaborators] = useState<ApiCollaborator[]>([]);
  
  // Invitation Form state
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"manager" | "monitor">("manager");

  // Deletion Modal state
  const [pendingDeleteUser, setPendingDeleteUser] = useState<ApiCollaborator | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch all collaborators on load
  const fetchCollaborators = async () => {
    if (!eventId) return;
    setLoading(true);
    const { data, error } = await collaboratorsService.getCollaborators(eventId);
    if (error) {
      toast.error(error.message || "Failed to load collaborators");
    } else {
      setCollaborators(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCollaborators();
  }, [eventId]);

  // Handle invitation submission
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setActionLoading(true);
    const { data, error } = await collaboratorsService.addCollaborator(eventId, email.toLowerCase().trim(), role);
    setActionLoading(false);

    if (error) {
      toast.error(error.message || "Failed to add collaborator");
    } else {
      toast.success(data?.message || "Collaborator added successfully");
      setEmail("");
      fetchCollaborators(); // Refresh the list
    }
  };

  // Handle role updating inline
  const handleRoleChange = async (userId: string, newRole: "manager" | "monitor") => {
    toast.loading("Updating collaborator role...", { id: "role-update" });
    const { data, error } = await collaboratorsService.updateCollaborator(eventId, userId, newRole);
    
    if (error) {
      toast.error(error.message || "Failed to update role", { id: "role-update" });
    } else {
      toast.success("Collaborator role updated successfully", { id: "role-update" });
      fetchCollaborators();
    }
  };

  // Handle collaborator removal
  const handleDeleteConfirm = async () => {
    if (!pendingDeleteUser) return;
    setDeleteLoading(true);
    
    const { data, error } = await collaboratorsService.removeCollaborator(eventId, pendingDeleteUser.user.id);
    setDeleteLoading(false);
    setPendingDeleteUser(null);

    if (error) {
      toast.error(error.message || "Failed to remove collaborator");
    } else {
      toast.success("Collaborator removed successfully");
      fetchCollaborators();
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden p-4 md:p-6 bg-white select-none">
      {/* Compact Header */}
      <header className="mb-6 flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#1B1818] leading-tight tracking-tight">Event Collaborators</h1>
          <p className="text-[10px] font-medium text-[#C27E33] mt-0.5 opacity-90 leading-relaxed max-w-2xl">
            Invite managers or monitors to collaborate on your event. Managers can edit all event features, while monitors can only supervise metrics and chats in read-only mode.
          </p>
        </div>
      </header>

      {/* Main Content Areas */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Form & Permissions Guide */}
          <div className="w-full lg:w-[380px] xl:w-[400px] shrink-0 space-y-5">
            
            {/* Invitation Form Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-[#1B1818] uppercase tracking-wider flex items-center gap-2">
                <HiOutlineUserPlus className="text-base text-[#EB5017]" />
                Invite Collaborator
              </h3>
              
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">
                    Email Address
                  </Label>
                  <input 
                    type="email" 
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-[#1B1818] focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] transition-all outline-none"
                    placeholder="teammember@domain.com"
                    disabled={actionLoading}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-[#1B1818] uppercase tracking-wider">
                    Assigned Role
                  </Label>
                  <Select 
                    value={role} 
                    onValueChange={(val: "manager" | "monitor") => setRole(val)}
                    disabled={actionLoading}
                  >
                    <SelectTrigger className="w-full bg-white border border-gray-200 h-9 rounded-lg px-3 text-[11px] font-bold text-[#1B1818] focus:ring-0">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-gray-100 bg-white">
                      <SelectItem value="manager" className="py-2 text-[11px] font-bold text-[#1B1818] cursor-pointer">
                        Manager
                      </SelectItem>
                      <SelectItem value="monitor" className="py-2 text-[11px] font-bold text-[#1B1818] cursor-pointer">
                        Monitor
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-[#eb5017] text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d64815] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#eb5017]/10"
                >
                  {actionLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Invitation...
                    </>
                  ) : (
                    "Send Invitation"
                  )}
                </button>
              </form>
            </div>

            {/* Permissions Guide Info Card */}
            <div className="bg-[#FFF4ED] rounded-2xl p-5 border border-orange-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#EB5017] flex items-center justify-center text-white shrink-0">
                  <HiOutlineInformationCircle className="text-sm" />
                </div>
                <h4 className="font-bold text-[#EB5017] text-[11px] uppercase tracking-wider">Role Permissions Guide</h4>
              </div>
              
              <div className="space-y-3.5 text-[10px] leading-relaxed font-medium text-[#C27E33]">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded-full font-bold text-[8px] bg-orange-100 text-[#EB5017] uppercase tracking-wider">
                      Manager
                    </span>
                  </div>
                  <p className="opacity-90 pl-1 border-l border-orange-200">
                    Full administrative privileges. Can create, edit, or delete tickets, checklists, schedule sessions, speakers, and review attendee analytics.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded-full font-bold text-[8px] bg-blue-100 text-blue-600 uppercase tracking-wider">
                      Monitor
                    </span>
                  </div>
                  <p className="opacity-90 pl-1 border-l border-blue-200">
                    Read-only supervisor. Perfect for checking check-in counters, supervising public chats, playing games, and observing dashboard statistics. No editing allowed.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Collaborators List */}
          <div className="flex-1 w-full space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#1B1818] uppercase tracking-wider flex items-center gap-2">
                  <HiOutlineUsers className="text-base text-[#EB5017]" />
                  Active Collaborators ({collaborators.length})
                </h3>
              </div>

              {/* Loader Skeleton */}
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                        <div className="space-y-2">
                          <div className="h-3 w-28 bg-gray-200 rounded" />
                          <div className="h-2.5 w-40 bg-gray-200 rounded" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-16 bg-gray-200 rounded-full" />
                        <div className="h-7 w-7 bg-gray-200 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : collaborators.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-200 rounded-xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <HiOutlineUsers className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B1818] text-xs">No collaborators yet</h4>
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5 max-w-[240px]">
                      Add teammates using the form on the left to coordinate and run this event together.
                    </p>
                  </div>
                </div>
              ) : (
                /* Collaborators list */
                <div className="space-y-3">
                  {collaborators.map((c) => {
                    if (!c.user) return null;
                    const initials = `${c.user.firstName?.[0] || ""}${c.user.lastName?.[0] || ""}`.toUpperCase() || "?";
                    
                    return (
                      <div 
                        key={c.user.id}
                        className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-white hover:bg-[#FFFDFB]/40 hover:border-orange-100/50 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          
                          {/* Avatar / Fallback Initials */}
                          <div className="w-9 h-9 rounded-full bg-[#FAF9F6] border border-gray-100 flex items-center justify-center overflow-hidden font-bold text-xs text-[#C27E33] shrink-0 shadow-inner">
                            {c.user.avatar ? (
                              <img src={c.user.avatar} alt={`${c.user.firstName} ${c.user.lastName}`} className="w-full h-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                          
                          {/* Profile Details */}
                          <div>
                            <h4 className="font-bold text-[#1B1818] text-xs flex items-center gap-1.5">
                              {c.user.firstName} {c.user.lastName}
                              {c.user.firstName === "Invited" && (
                                <span className="text-[8px] bg-gray-100 text-gray-500 font-extrabold px-1 py-0.5 rounded tracking-widest uppercase scale-90">
                                  Invited
                                </span>
                              )}
                            </h4>
                            <p className="text-[9px] font-medium text-gray-400 mt-0.5">{c.user.email}</p>
                          </div>
                        </div>

                        {/* Actions controls */}
                        <div className="flex items-center gap-2.5">
                          
                          {/* Interactive Badges */}
                          <span className={`px-2 py-0.5 rounded-full font-black text-[8px] uppercase tracking-widest shrink-0 border ${
                            c.role === 'manager' 
                              ? 'bg-orange-50 text-[#EB5017] border-orange-100' 
                              : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {c.role}
                          </span>

                          {/* Action Dropdown Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 text-gray-400 hover:text-gray-600 outline-none transition-all cursor-pointer">
                              <HiOutlineEllipsisVertical className="text-sm shrink-0" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border border-gray-100 rounded-xl p-1.5 shadow-xl min-w-[140px] z-50">
                              
                              <div className="px-2 py-1 text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1.5">
                                Modify Access
                              </div>

                              {c.role === "monitor" ? (
                                <DropdownMenuItem 
                                  onClick={() => handleRoleChange(c.user.id, "manager")}
                                  className="text-[10px] font-bold text-gray-700 hover:bg-orange-50/50 hover:text-[#EB5017] rounded-lg px-2 py-1.5 flex items-center gap-2 cursor-pointer transition-all outline-none"
                                >
                                  Make Manager
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => handleRoleChange(c.user.id, "monitor")}
                                  className="text-[10px] font-bold text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-lg px-2 py-1.5 flex items-center gap-2 cursor-pointer transition-all outline-none"
                                >
                                  Make Monitor
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem 
                                onClick={() => setPendingDeleteUser(c)}
                                className="text-[10px] font-bold text-red-500 hover:bg-red-50/50 rounded-lg px-2 py-1.5 flex items-center gap-2 cursor-pointer transition-all outline-none mt-1"
                              >
                                <HiOutlineTrash className="text-xs shrink-0" />
                                Remove Partner
                              </DropdownMenuItem>

                            </DropdownMenuContent>
                          </DropdownMenu>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <ActionConfirmationModal
        isOpen={!!pendingDeleteUser}
        onClose={() => setPendingDeleteUser(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Collaborator"
        description={`Are you sure you want to remove ${pendingDeleteUser?.user?.firstName || "Invited"} ${pendingDeleteUser?.user?.lastName || "Collaborator"} as a collaborator from this event? This will revoke all their management privileges immediately.`}
        confirmLabel="Remove Partner"
        cancelLabel="Cancel"
        isLoading={deleteLoading}
        variant="danger"
      />

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
