"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type AvatarProps = {
  src?: string;
  name?: string;
  fallback?: string;
  href?: string;
  isBigger?: boolean;
  disableLink?: boolean;
  className?: string;
};

export const avatarPalette = [
  { bg: "#EF4444", text: "#FFFFFF", border: "#DC2626", class: "bg-red-500" },
  { bg: "#10B981", text: "#FFFFFF", border: "#059669", class: "bg-emerald-500" },
  { bg: "#3B82F6", text: "#FFFFFF", border: "#2563EB", class: "bg-blue-500" },
  { bg: "#F59E0B", text: "#FFFFFF", border: "#D97706", class: "bg-amber-500" },
  { bg: "#8B5CF6", text: "#FFFFFF", border: "#7C3AED", class: "bg-purple-500" },
  { bg: "#EC4899", text: "#FFFFFF", border: "#DB2777", class: "bg-pink-500" },
  { bg: "#6366F1", text: "#FFFFFF", border: "#4F46E5", class: "bg-indigo-500" },
  { bg: "#0D9488", text: "#FFFFFF", border: "#0F766E", class: "bg-teal-600" },
  { bg: "#EA580C", text: "#FFFFFF", border: "#C2410C", class: "bg-orange-600" },
  { bg: "#06B6D4", text: "#FFFFFF", border: "#0891B2", class: "bg-cyan-600" },
  { bg: "#7C3AED", text: "#FFFFFF", border: "#6D28D9", class: "bg-violet-600" },
  { bg: "#E11D48", text: "#FFFFFF", border: "#BE123C", class: "bg-rose-600" },
];

export function getInitials(fullName?: string, fallback?: string): string {
  let raw = (fullName || "").trim();

  if (!raw && fallback) {
    raw = fallback.trim();
  }

  if (!raw) return "A";

  // If text is an email address, strip the domain part (e.g. "john.doe@gmail.com" -> "john.doe")
  const text = raw.includes("@") ? raw.split("@")[0].trim() : raw;
  if (!text) return "A";

  // Split on spaces, dots, underscores, dashes
  const parts = text.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0].charAt(0).toUpperCase();
    const second = parts[parts.length - 1].charAt(0).toUpperCase();
    if (first && second) return first + second;
    if (first) return first;
  }

  if (parts.length === 1 && parts[0].length > 0) {
    const word = parts[0];
    if (word.length >= 2) {
      return (word.charAt(0) + word.charAt(1)).toUpperCase();
    }
    return word.charAt(0).toUpperCase();
  }

  return "A";
}

export function getColorFromName(name?: string, fallback?: string) {
  const seed = (name || fallback || "").trim();
  if (!seed) return avatarPalette[0];
  const charCodeSum = seed
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return avatarPalette[Math.abs(charCodeSum) % avatarPalette.length];
}

export default function Avatar({
  src,
  name,
  fallback,
  href = "/profile",
  isBigger,
  disableLink,
  className = "",
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name, fallback);
  const color = getColorFromName(name, fallback);

  const hasCustomSize = className.includes("w-") || className.includes("h-");
  const sizeClasses = hasCustomSize
    ? ""
    : isBigger
    ? "h-11 w-11 md:h-[50px] md:w-[50px] min-w-[44px] min-h-[44px] md:min-w-[50px] md:min-h-[50px] text-xs md:text-sm"
    : "h-9 w-9 md:h-10 md:w-10 min-w-[36px] min-h-[36px] md:min-w-[40px] md:min-h-[40px] text-[11px] md:text-xs";

  const hasValidImage = Boolean(
    src &&
    typeof src === "string" &&
    src.trim() !== "" &&
    src !== "null" &&
    src !== "undefined" &&
    !src.includes("avatar-placeholder") &&
    !imgError
  );

  const content = hasValidImage ? (
    <div
      className={`${sizeClasses} rounded-full overflow-hidden shrink-0 aspect-square select-none shadow-sm ${className}`}
    >
      <Image
        src={src!}
        alt={name || "User avatar"}
        width={isBigger ? 50 : 40}
        height={isBigger ? 50 : 40}
        className="w-full h-full object-cover rounded-full"
        onError={() => setImgError(true)}
      />
    </div>
  ) : (
    <div
      className={`${sizeClasses} rounded-full flex justify-center items-center font-black text-white shrink-0 aspect-square select-none shadow-sm border border-white/20 uppercase tracking-tight ${color.class} ${className}`}
      style={{
        backgroundColor: color.bg,
        color: color.text,
        borderColor: color.border,
      }}
    >
      <span className="leading-none tracking-tight select-none">{initials}</span>
    </div>
  );

  if (disableLink) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

