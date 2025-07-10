"use client";

import { usePathname } from "next/navigation";
import { breadcrumbs } from "@/lib/demo-data/breadcrumbs";

type Props = {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
};

export default function Breadcrumb({
  fallbackTitle = "Welcome",
  fallbackSubtitle = "Control your profile setup and integrations",
}: Props) {
  const pathname = usePathname();

  const matched = breadcrumbs.find((item) =>
    pathname.startsWith(item.href.replace(/\[.*?\]/, ""))
  );

  return (
    <section className="">
      <div>
        <h2 className="font-semibold text-base md:text-[22px]">
          {matched?.title || fallbackTitle}
        </h2>
        <p className="text-xs text-gray-500">
          {matched?.subtitle || fallbackSubtitle}
        </p>
      </div>
    </section>
  );
}
