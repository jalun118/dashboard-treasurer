"use client";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, MouseEvent, MouseEventHandler, ReactNode } from "react";

interface PropsButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ButtonBack({ children, onClick, ...props }: PropsButton) {
  const { back } = useRouter();
  const handleClick = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    if (onClick) {
      onClick(event);
    }
    back();
  };

  return (
    <button onClick={(event) => handleClick(event)} type="button" {...props}>
      {children}
    </button>
  );
};
