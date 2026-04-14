import type { ButtonHTMLAttributes, ReactNode } from "react";

export const cardActionClassName =
  "rounded-xl border border-[color:var(--lib-action-button-border)] bg-[color:var(--lib-action-button-bg)] px-4 py-3 text-left text-sm font-medium text-[color:var(--lib-action-button-ink)] transition hover:bg-[color:var(--lib-action-button-hover)]";

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
