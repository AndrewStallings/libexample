"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { ReactNode } from "react";

type FormPopoutLinkProps = {
  href: string;
  returnTo?: string;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
};

export const FormPopoutLink = ({ href, returnTo, className, children, style }: FormPopoutLinkProps) => {
  const nextHref = returnTo ? `${href}${href.includes("?") ? "&" : "?"}returnTo=${encodeURIComponent(returnTo)}` : href;

  return (
    <Link className={className} href={nextHref} rel="noreferrer" style={style} target="_blank">
      {children}
    </Link>
  );
};
