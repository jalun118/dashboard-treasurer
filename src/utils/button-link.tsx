"use client";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, MouseEvent, MouseEventHandler, ReactNode } from "react";

interface PropsButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ButtonLink({ href, children, onClick, ...props }: PropsButton) {
  const { push } = useRouter();
  const handleClick = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (onClick) {
      onClick(event);
    }
    push(href);
  };

  return (
    <button onClick={(event) => handleClick(event)} {...props}>
      {children}
    </button>
  );
};
