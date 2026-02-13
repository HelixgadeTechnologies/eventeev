"use client";

import { HiOutlineLink, HiOutlineExternalLink, HiOutlineDocumentText, HiOutlineVideoCamera, HiOutlinePlus } from "react-icons/hi";
import { useState } from "react";

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
  const [links] = useState(MOCK_LINKS);

  return (
    <section className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-[#eb5017] uppercase tracking-[0.2em]">Power-up</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#EB5017] text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#d64815] transition-all active:scale-95 shadow-xl shadow-[#EB5017]/20 shrink-0">
          <HiOutlinePlus className="text-lg" />
          Add Resource
        </button>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              {typeIcons[link.type] || <HiOutlineLink className="text-lg text-gray-400" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-black text-sm text-[#1B1818] tracking-tight truncate">{link.title}</h4>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${typeBadgeColors[link.type]}`}>
                  {link.type}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium truncate">{link.description}</p>
              <p className="text-[10px] text-gray-300 font-bold mt-1">
                Added by <span className="text-gray-500">{link.addedBy}</span> · {link.date}
              </p>
            </div>

            {/* Action */}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 hover:bg-[#EB5017] hover:text-white hover:border-[#EB5017] transition-all text-gray-400"
            >
              <HiOutlineExternalLink className="text-lg" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
