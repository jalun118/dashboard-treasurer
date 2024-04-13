"use client";
import { useAppSelector } from "@/lib/hooks";
import ButtonLink from "@/utils/button-link";
import { FormatMoneyId } from "@/utils/utils";
import { HTMLAttributes } from "react";

export default function Saldo(props: HTMLAttributes<HTMLDivElement>) {
  const amountSaldo = useAppSelector(state => state.saldo.amount_saldo);

  return (
    <div {...props}>
      <ButtonLink href="/add-saldo" type="button" className="py-3 px-4 inline-flex justify-center items-center h-9 w-9 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="flex-shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </ButtonLink>
      <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-md font-medium border border-teal-200 bg-teal-100 text-teal-800 shadow-sm dark:bg-teal-500/10 dark:text-teal-500 dark:border-teal-700">{FormatMoneyId(amountSaldo)}</span>
    </div>
  );
};
