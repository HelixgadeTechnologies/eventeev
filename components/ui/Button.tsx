"use client";

import Link from "next/link";
import Loader from "./Loader";

type ButtonProps = {
  content: string;
  href?: string;
  onClick?: () => void;
  isSecondary?: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
};

export default function Button({ 
    content, 
    href, 
    onClick, 
    isSecondary,
    icon,
    isLoading,
    disabled,
}: ButtonProps) {
  const isActuallyDisabled = disabled || isLoading;
  
  const classes = `${isSecondary ? 'bg-white text-[#eb5017] border border-[#eb5017]' : 'bg-[#eb5017] text-white button'} rounded-[8px] h-10 w-full px-5 md:px-6 leading-6 font-bold hover:cursor-pointer text-sm whitespace-nowrap flex items-center justify-center gap-2 ${isActuallyDisabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (href && !isLoading) {
    return (
      <Link href={href} className={classes}>
        {icon && icon}
        {content}
      </Link>
    );
  }

  return (
    <button 
      onClick={!isActuallyDisabled ? onClick : undefined} 
      className={classes}
      disabled={isActuallyDisabled}
    >
      {isLoading ? (
        <>
          <Loader size="sm" color="currentColor" />
          <span>{content}</span>
        </>
      ) : (
        <>
          {icon && icon}
          {content}
        </>
      )}
    </button>
  );
}