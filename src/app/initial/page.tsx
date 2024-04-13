"use client";

import axiosInstance from "@/lib/axios-instance";
import { useAppSelector } from "@/lib/hooks";
import ButtonBack from "@/utils/button-back";
import { GetDayNameID } from "@/utils/date-format";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";

const defaultInit = {
  SALDO: "0",
  CAPTURE_DAY: [0, 1, 2, 3, 4, 5, 6],
  CAPTURE_STATE: true,
  DEP_PER_DAY: "1000"
};


function toggleNumber(arr: number[], number: number) {
  const index = arr.indexOf(number);

  if (index === -1) {
    return [...arr, number];
  } else {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
}

type RequestObj = {
  init_saldo: number;
  array_days: string;
  capture_state: boolean;
  dept_amount: number;
};

const days = [0, 1, 2, 3, 4, 5, 6];

type ObjInfo = {
  name: string;
  status: boolean;
  message: string;
};

type ObjResponse = {
  info: ObjInfo[] | null;
  success: boolean;
  message: string;
};

export default function InitialSetting() {
  const errorFirstOpen = useAppSelector(state => state.firstOpen.isError);
  const errorLastOpen = useAppSelector(state => state.lastOpen.isError);
  const [InputSaldo, SetInputSaldo] = useState(defaultInit.SALDO);
  const [DeptAmount, SetDeptAmount] = useState(defaultInit.DEP_PER_DAY);
  const [StatusSystem, SetStatusSystem] = useState<boolean>(defaultInit.CAPTURE_STATE);
  const [getDayActive, SetDayActive] = useState<number[]>(defaultInit.CAPTURE_DAY);

  function SetDataDay(day: number) {
    const result = toggleNumber(getDayActive, day);
    SetDayActive(result.sort());
  }

  const { mutate, data, isSuccess, isPending, isError, error } = useMutation({
    mutationFn: async (body: RequestObj) => {
      const response = await axiosInstance.post<ObjResponse>("/initial", body);
      return response;
    },
    onError: (e: AxiosError<ObjResponse>) => {
      return e;
    },
    onSuccess: (s) => {
      return s.data;
    }
  });

  function SubmitData(e: any) {
    e.preventDefault();
    mutate({
      array_days: JSON.stringify(getDayActive),
      capture_state: StatusSystem,
      dept_amount: parseFloat(DeptAmount),
      init_saldo: parseFloat(InputSaldo)
    });
  }

  if (data?.data?.info?.every(data => data.status === true) && (!errorFirstOpen && !errorLastOpen)) {
    window.location.replace("/");
  }

  return (
    <div>

      <div className="mb-60 max-w-lg">
        <h3 className="dark:text-white font-semibold text-lg">Initial data</h3>

        {isError && (
          <div className="mt-2 bg-red-50 border border-red-200 text-sm text-red-800 rounded-lg p-4 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="flex-shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m15 9-6 6"></path>
                  <path d="m9 9 6 6"></path>
                </svg>
              </div>
              <div className="ms-4">
                <h3 className="text-sm font-semibold">
                  Terjadi kesalahan saat pengiriman.
                </h3>
                <div className="mt-1 text-sm text-red-700 dark:text-red-400">
                  {error.code ?? "server-error"}: {error.message}
                </div>
              </div>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 dark:bg-gray-800 dark:border-gray-700" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="flex-shrink-0 size-4 text-blue-600 mt-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <div className="ms-3">
                <h3 className="text-gray-800 font-semibold dark:text-white">
                  Berhasil mengirim perubahan
                </h3>
                <div className="mt-2 text-sm dark:text-white">
                  <ul className="list-disc space-y-1 ps-2">
                    {data?.data?.info?.map((data, i) => (
                      <li key={i}>
                        <code className="font-semibold inline-flex">{data.name}</code>{" : "}
                        {data.status === true ? (
                          <>
                            <span className="capitalize">{data.message}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="inline-block size-4 ms-1 text-teal-600 dark:text-teal-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          </>
                        ) : (
                          <>
                            <span className="capitalize text-red-600 dark:text-red-400">{data.message}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="inline-block size-4 ms-1 text-red-600 dark:text-red-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={(e) => SubmitData(e)}>
          <div className="mt-4 max-w-sm">
            <label htmlFor="amount-inp" className="block text-sm font-medium mb-3 dark:text-white">Jumlah Uang</label>
            <div className="relative">
              <input
                type="number"
                id="amount-inp"
                className="py-3 px-4 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="0.00"
                autoComplete="off"
                autoCorrect="off"
                value={InputSaldo}
                onChange={(e) => SetInputSaldo(e.target.value)}
                disabled={data?.data?.info?.some(data => data.name === "saldo" && data.status !== true) || isPending}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                <span className="text-gray-500">Rp</span>
              </div>
            </div>
          </div>

          <div className="mt-4 max-w-sm">
            <label htmlFor="system-status-inp" className="block text-sm font-medium mb-3 dark:text-white">Status Sistem</label>
            <div className="flex flex-col gap-y-3">
              <div className="flex">
                <input type="radio" disabled={data?.data?.info?.some(data => data.name === "day-capture-state" && data.status !== true) || isPending} onChange={() => SetStatusSystem(true)} checked={StatusSystem === true} name="status-system-group-run" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="status-system-group-1" />
                <label htmlFor="status-system-group-1" className="text-sm text-gray-500 ms-2 dark:text-gray-400">Berjalan</label>
              </div>

              <div className="flex">
                <input type="radio" disabled={data?.data?.info?.some(data => data.name === "day-capture" && data.status !== true) || isPending} onChange={() => SetStatusSystem(false)} checked={StatusSystem === false} name="status-system-group-stop" className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="status-system-group-2" />
                <label htmlFor="status-system-group-2" className="text-sm text-gray-500 ms-2 dark:text-gray-400">Berhenti</label>
              </div>
            </div>
          </div>

          <div className="mt-4 max-w-sm">
            <label htmlFor="day-option-inp" className="block text-sm font-medium mb-3 dark:text-white">Opsi Hari Untuk Menjalankan</label>
            <div className="flex gap-y-3 flex-col">
              {days.map((data_day) => (
                <div className="flex" key={data_day}>
                  <input type="checkbox" disabled={data?.data?.info?.some(data => data.name === "day-capture" && data.status !== true) || isPending} onChange={() => SetDataDay(data_day)} checked={getDayActive.includes(data_day)} className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500" id={`day-option-group-${data_day}`} />
                  <label htmlFor={`day-option-group-${data_day}`} className="text-sm text-gray-500 ms-3 dark:text-gray-400 capitalize">{GetDayNameID(data_day)}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 max-w-sm">
            <label htmlFor="dept-amount-inp" className="block text-sm font-medium mb-3 dark:text-white">Jumlah Tagihan (Per Hari)</label>
            <div className="relative">
              <input
                type="number"
                id="dept-amount-inp"
                className="py-3 px-4 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="0.00"
                autoComplete="off"
                autoCorrect="off"
                onChange={(e) => SetDeptAmount(e.target.value)}
                value={DeptAmount}
                disabled={data?.data?.info?.some(data => data.name === "dep-per-day" && data.status !== true) || isPending}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                <span className="text-gray-500">Rp</span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-x-3 flex items-center">
            <button disabled={data?.data?.info?.some(data => data.status === false) || isPending} type="submit" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              SIMPAN
            </button>

            <ButtonBack type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              KEMBALI
            </ButtonBack>
          </div>
        </form>
      </div>
    </div>
  );
};
