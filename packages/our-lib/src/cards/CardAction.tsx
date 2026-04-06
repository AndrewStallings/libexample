import type { ButtonHTMLAttributes, ReactNode } from "react";

export const cardActionClassName =
  "rounded-xl border bg-white px-4 py-3 text-left text-sm font-semibold transition hover:bg-stone-50";

type CardActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const CardActionButton = ({ children, className, type = "button", ...props }: CardActionButtonProps) => {
  return (
    <button {...props} className={className ? `${cardActionClassName} ${className}` : cardActionClassName} type={type}>
      {children}
    </button>
  );
};
