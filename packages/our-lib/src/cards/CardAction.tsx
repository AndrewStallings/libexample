import type { ButtonHTMLAttributes, ReactNode } from "react";

export const cardActionClassName =
  "rounded-xl border border-[#00249c] bg-[#00249c] px-4 py-3 text-left text-sm font-medium text-white shadow-[0_12px_30px_rgba(0,36,156,0.18)] transition hover:bg-[#001c77] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00249c]/20 dark:border-[#3f63d6] dark:bg-[#00249c] dark:text-white dark:hover:bg-[#16379f]";

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
