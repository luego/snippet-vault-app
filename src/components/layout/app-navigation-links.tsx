"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { appNavigation, isAppNavigationActive } from "@/config/navigation";

export function AppNavigationLinks() {
  const pathname = usePathname();

  return appNavigation.map(({ href, label, icon: Icon }) => {
    const active = isAppNavigationActive(pathname, href);
    return (
      <Link
        className="app-nav-link"
        href={href}
        aria-current={active ? "page" : undefined}
        key={href}
      >
        <Icon aria-hidden="true" className="size-[18px]" />
        <span>{label}</span>
      </Link>
    );
  });
}
