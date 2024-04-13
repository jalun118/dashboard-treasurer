
"use client";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, MouseEvent, MouseEventHandler, ReactNode } from "react";

interface PropsButton extends ButtonHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export default function LinkCustom({ href, children, onClick, ...props }: PropsButton) {
  const { push } = useRouter();
  const handleClick = (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    if (onClick) {
      onClick(event);
    }
    push(href);
  };

  return (
    <a onClick={(event) => handleClick(event)} {...props}>
      {children}
    </a>
  );
};