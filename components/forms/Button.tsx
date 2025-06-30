"use client";

import Link from "next/link";

type ButtonProps = {
  content: string;
  href?: string;
  onClick?: () => void;
  isSecondary?: boolean;
};

export default function Button({ 
    content, 
    href, 
    onClick, 
    isSecondary,
}: ButtonProps) {
  const classes = `${isSecondary ? 'bg-white text-[#eb5017] border border-[#eb5017]' : 'bg-[#eb5017] text-white button'} rounded-[8px] h-10 md:h-12 w-full px-5 md:px-6 leading-6 font-bold hover:cursor-pointer text-sm md:text-base`;

  if (href) {
    return (
      <Link href={href}>
        <button className={classes}>{content}</button>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
