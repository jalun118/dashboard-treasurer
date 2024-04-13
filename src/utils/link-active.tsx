"use client";
import { usePathname, useRouter } from "next/navigation";
import { ButtonHTMLAttributes, MouseEvent, MouseEventHandler, ReactNode } from "react";

interface PropsButton extends ButtonHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  isActiveClassName?: string;
}

export default function LinkActive({ href, children, onClick, isActiveClassName, ...props }: PropsButton) {
  const { push } = useRouter();
  const pathname = usePathname().toLowerCase();
  const hrefPath = href.toLowerCase();
  const isActive = (pathname === hrefPath) || pathname.startsWith(hrefPath) && (pathname.charAt(hrefPath.length) === "/");
  const classNameState = isActive ? isActiveClassName ?? props.className : props.className;

  const handleClick = (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    if (onClick) {
      onClick(event);
    }
    push(href);
  };

  return (
    <a {...props} onClick={(event) => handleClick(event)} className={classNameState} aria-current={isActive ? "page" : undefined}>
      {children}
    </a>
  );
};