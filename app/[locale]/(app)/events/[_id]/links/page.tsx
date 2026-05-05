"use client";

import { HiOutlineLink, HiOutlineExternalLink, HiOutlineDocumentText, HiOutlineVideoCamera, HiOutlinePlus } from "react-icons/hi";
import { useState } from "react";
import ResourceUploadModal from "@/components/links/ResourceUploadModal";

const MOCK_LINKS = [
  {
    id: 1,
    title: "Event Presentation Slides",
    url: "https://docs.google.com/presentation/d/example",
    type: "document",
    description: "Main keynote presentation for the event",
    addedBy: "Richard Edem",
    date: "Feb 12, 2026",
  },
  {
    id: 2,
    title: "Live Stream Recording",
    url: "https://youtube.com/watch?v=example",
    type: "video",
    description: "Full recording of the main stage stream",
    addedBy: "Richard Edem",
    date: "Feb 11, 2026",
  },
  {
    id: 3,
    title: "Sponsor Information Kit",
    url: "https://drive.google.com/file/d/example",
    type: "document",
    description: "Sponsorship tiers and benefits overview",
    addedBy: "Sarah K.",
    date: "Feb 10, 2026",
  },
  {
    id: 4,
    title: "Event Hashtag Guidelines",
    url: "https://example.com/social-guidelines",
    type: "link",
    description: "Social media posting guidelines and hashtags",
    addedBy: "Marketing Team",
    date: "Feb 9, 2026",
  },
  {
    id: 5,
    title: "Venue Floor Plan",
    url: "https://example.com/floor-plan",
    type: "document",
    description: "Interactive map of the venue layout",
    addedBy: "Operations",
    date: "Feb 8, 2026",
  },
];

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
  const [links, setLinks] = useState(MOCK_LINKS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUploadComplete = (data: { file: File, title: string, description: string }) => {
    const newLink = {
      id: links.length + 1,
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

      <ResourceUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </section>
  );
}
