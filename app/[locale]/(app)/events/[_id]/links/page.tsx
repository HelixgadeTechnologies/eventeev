"use client";

import { HiOutlineLink, HiOutlineExternalLink, HiOutlineDocumentText, HiOutlineVideoCamera, HiOutlinePlus } from "react-icons/hi";
import { useState } from "react";
import ResourceUploadModal from "@/components/links/ResourceUploadModal";

export interface ResourceLink {
  id: number | string;
  title: string;
  url: string;
  type: string;
  description: string;
  addedBy: string;
  date: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  document: <HiOutlineDocumentText className="text-lg text-blue-500" />,
  video: <HiOutlineVideoCamera className="text-lg text-red-500" />,
  link: <HiOutlineLink className="text-lg text-purple-500" />,
};

const typeBadgeColors: Record<string, string> = {
  document: "bg-blue-50 text-blue-600",
  video: "bg-red-50 text-red-600",
  link: "bg-purple-50 text-purple-600",
};

export default function LinksPage() {
  const [links, setLinks] = useState<ResourceLink[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUploadComplete = (data: { file: File, title: string, description: string }) => {
    const newLink: ResourceLink = {
      id: Date.now(),
      title: data.title,
      url: "#",
      type: "document",
      description: data.description,
      addedBy: "You",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setLinks([newLink, ...links]);
  };

  return (
    <section className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em] mb-1">Power-up</p>
          <h2 className="text-3xl font-black text-[#1B1818] tracking-tight">Resources & Assets</h2>
          <p className="text-sm text-gray-400 font-medium leading-relaxed">Access and manage all shared documents, videos, and useful links for this event.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-xl shadow-[#EB5017]/30 shrink-0"
        >
          <HiOutlinePlus className="text-lg" />
          Add Resource
        </button>
      </div>

      {/* Links List */}
      {links.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
            <HiOutlineLink className="text-3xl" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-700 text-lg">No resources shared yet</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Click &quot;Add Resource&quot; to upload documents, add presentation links, or share media for this event.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#EB5017] hover:underline pt-2"
          >
            <HiOutlinePlus /> Upload your first resource
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-white border border-gray-100 rounded-3xl p-6 flex items-center gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-white group-hover:border-[#EB5017]/20 transition-all duration-500 shadow-sm">
                {typeIcons[link.type] || <HiOutlineLink className="text-xl text-gray-400" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="font-black text-base text-[#1B1818] tracking-tight truncate">{link.title}</h4>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${typeBadgeColors[link.type]}`}>
                    {link.type}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium truncate max-w-xl">{link.description}</p>
                <div className="flex items-center gap-2 mt-2">
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      Added by <span className="text-[#EB5017]">{link.addedBy}</span>
                   </p>
                   <span className="w-1 h-1 rounded-full bg-gray-200" />
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{link.date}</p>
                </div>
              </div>

              {/* Action */}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 hover:bg-[#EB5017] hover:text-white hover:border-[#EB5017] hover:shadow-lg hover:shadow-[#EB5017]/20 transition-all text-gray-400 duration-300"
              >
                <HiOutlineExternalLink className="text-xl" />
              </a>
            </div>
          ))}
        </div>
      )}

      <ResourceUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </section>
  );
}
