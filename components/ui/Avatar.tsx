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
  { bg: "#EF4444", text: "#FFFFFF", class: "bg-red-500" },
  { bg: "#10B981", text: "#FFFFFF", class: "bg-emerald-500" },
  { bg: "#3B82F6", text: "#FFFFFF", class: "bg-blue-500" },
  { bg: "#F59E0B", text: "#FFFFFF", class: "bg-amber-500" },
  { bg: "#8B5CF6", text: "#FFFFFF", class: "bg-purple-500" },
  { bg: "#EC4899", text: "#FFFFFF", class: "bg-pink-500" },
  { bg: "#6366F1", text: "#FFFFFF", class: "bg-indigo-500" },
  { bg: "#0D9488", text: "#FFFFFF", class: "bg-teal-600" },
  { bg: "#EA580C", text: "#FFFFFF", class: "bg-orange-600" },
  { bg: "#06B6D4", text: "#FFFFFF", class: "bg-cyan-600" },
  { bg: "#7C3AED", text: "#FFFFFF", class: "bg-violet-600" },
  { bg: "#E11D48", text: "#FFFFFF", class: "bg-rose-600" },
];

export function getInitials(fullName?: string, fallback?: string): string {
  const text = (fullName || fallback || "").trim();
  if (!text) return "A";

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

export function getColorFromName(name?: string) {
  if (!name || !name.trim()) return avatarPalette[0];
  const charCodeSum = name
    .trim()
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
  const color = getColorFromName(name || fallback);

  const sizeClasses = isBigger
    ? "h-10 w-10 md:h-[50px] md:w-[50px] text-xs md:text-sm"
    : "h-[30px] w-[30px] md:h-10 md:w-10 text-[10px] md:text-xs";

  const hasValidImage = Boolean(src && src.trim() !== "" && !imgError);

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
      className={`${sizeClasses} rounded-full flex justify-center items-center font-bold text-white shrink-0 aspect-square select-none shadow-sm ${color.class} ${className}`}
      style={{
        backgroundColor: color.bg,
        color: color.text,
      }}
    >
      <span className="leading-none tracking-tight">{initials}</span>
    </div>
  );

  if (disableLink) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

