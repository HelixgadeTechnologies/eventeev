"use client";

import React from "react";

type LoaderProps = {
  size?: "xs" | "sm" | "md" | "lg";
  color?: string;
  className?: string;
};

export default function Loader({ 
  size = "md", 
  color = "currentColor", 
  className = "" 
}: LoaderProps) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-solid rounded-full animate-spin border-t-transparent`}
        style={{ borderColor: `${color} transparent transparent transparent` }}
      />
      <style jsx>{`
        div :global(.animate-spin) {
          border-top-color: transparent !important;
          border-right-color: ${color === 'currentColor' ? 'inherit' : color} !important;
          border-bottom-color: ${color === 'currentColor' ? 'inherit' : color} !important;
          border-left-color: ${color === 'currentColor' ? 'inherit' : color} !important;
        }
      `}</style>
    </div>
  );
}
