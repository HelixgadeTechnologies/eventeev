"use client";

import Link from "next/link";

type ButtonProps = {
  content: string;
  href?: string;
  onClick?: () => void;
  isSecondary?: boolean;
  icon?: React.ReactNode;
};

export default function Button({ 
    content, 
    href, 
    onClick, 
    isSecondary,
    icon,
}: ButtonProps) {
  const classes = `${isSecondary ? 'bg-white text-[#eb5017] border border-[#eb5017]' : 'bg-[#eb5017] text-white button'} rounded-[8px] h-10 w-full px-5 md:px-6 leading-6 font-bold hover:cursor-pointer text-sm whitespace-nowrap flex items-center justify-center gap-2`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon && icon}
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {icon && icon}
      {content}
    </button>
  );
}