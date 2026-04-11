"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { CSSProperties } from "react";
import type { ReactNode } from "react";

type FormPopoutLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
};

export const FormPopoutLink = ({ href, className, children, style }: FormPopoutLinkProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo = pathname ? `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}` : undefined;
  const nextHref = returnTo ? `${href}${href.includes("?") ? "&" : "?"}returnTo=${encodeURIComponent(returnTo)}` : href;

  return (
    <Link className={className} href={nextHref} rel="noreferrer" style={style} target="_blank">
      {children}
    </Link>
  );
};
