"use client";
import { iHistoryManagePerDay } from "@/interfaces/history-manage";
import { ObjectStandartResponse } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { FormatDateIDv2 } from "@/utils/date-format";
import { FormatMoneyId } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function HistoryComponent() {
  const [GetHistorys, SetHistorys] = useState<iHistoryManagePerDay[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all_history"],
    queryFn: async () => {
      const response = await axiosInstance.get<ObjectStandartResponse<iHistoryManagePerDay[]>>("/history");
      return response;
    }
  });

  useEffect(() => {
    if (!isLoading && !isError) {
      SetHistorys(data?.data.data ?? []);
    }
  }, [data, isLoading, isError]);

  return (
    <div className="mt-4">
      <h2 className="font-semibold text-lg dark:text-white">Riwayat</h2>
      <div className="mt-1">
        {isError && (
          <div className="max-w-lg">
            <div className="bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500 shadow-lg mt-3" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="flex-shrink-0 size-4 text-red-600 mt-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div className="ms-3">
                  <h3 className="text-gray-800 font-semibold dark:text-white">
                    Terjadi kesalahan dalam jaringan
                  </h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                    Pesan: {error.message ?? ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-3">
            <h3 className="h-4 mt-1 mb-3 w-44 rounded-md bg-slate-300/75 dark:bg-slate-600/65"></h3>
            <ul className="max-w-xl flex flex-col">
              <li className="inline-block capitalize items-center gap-x-2 py-3 px-5 text-base bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-2xl first:mt-0 last:rounded-b-2xl dark:bg-slate-900 dark:border-gray-700 dark:text-white">
                <div className="h-4 my-2 w-56 rounded-md bg-slate-300/75 dark:bg-slate-600/65"></div>
              </li>
              <li className="inline-block capitalize items-center gap-x-2 py-3 px-5 text-base bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-2xl first:mt-0 last:rounded-b-2xl dark:bg-slate-900 dark:border-gray-700 dark:text-white">
                <div className="h-4 my-2 w-56 rounded-md bg-slate-300/75 dark:bg-slate-600/65"></div>
              </li>
              <li className="inline-block capitalize items-center gap-x-2 py-3 px-5 text-base bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-2xl first:mt-0 last:rounded-b-2xl dark:bg-slate-900 dark:border-gray-700 dark:text-white">
                <div className="h-4 my-2 w-56 rounded-md bg-slate-300/75 dark:bg-slate-600/65"></div>
              </li>
              <li className="inline-block capitalize items-center gap-x-2 py-3 px-5 text-base bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-2xl first:mt-0 last:rounded-b-2xl dark:bg-slate-900 dark:border-gray-700 dark:text-white">
                <div className="h-4 my-2 w-56 rounded-md bg-slate-300/75 dark:bg-slate-600/65"></div>
              </li>
            </ul>
          </div>
        )}

        {!isLoading && !isError && GetHistorys.length > 0 && GetHistorys.map((perday, i) => (
          <div className="mt-3" key={i}>
            <h3 className="font-semibold text-base capitalize mb-2 dark:text-white">{FormatDateIDv2(perday.date_transaction)}</h3>
            <ul className="max-w-xl flex flex-col">
              {perday.historys.map((data, index) => (
                <li key={index} className="inline-block capitalize items-center gap-x-2 py-3 px-5 text-base bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-2xl first:mt-0 last:rounded-b-2xl dark:bg-slate-900 dark:border-gray-700 dark:text-white">
                  <p className="item-center">
                    {data.type === "payment" ? `${data.user?.username} membayar` : data.type === "used" ? data.used?.title_item : "admin telah menambahkan uang"}
                    {data.type === "payment" ? (
                      <span className="float-end inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">
                        <span className="w-1.5 h-1.5 inline-block rounded-full bg-teal-800 dark:bg-teal-500"></span>
                        + {FormatMoneyId(data.payment?.large_payment || 0)}
                      </span>
                    ) : data.type === "used" ? (
                      <span className="float-end inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">
                        <span className="w-1.5 h-1.5 inline-block rounded-full bg-red-800 dark:bg-red-500"></span>
                        &#8211; {FormatMoneyId(data.used?.item_price || 0)}
                      </span>
                    ) : (
                      <span className="float-end inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">
                        <span className="w-1.5 h-1.5 inline-block rounded-full bg-teal-800 dark:bg-teal-500"></span>
                        +{FormatMoneyId(data.amount || 0)}
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!isLoading && !isError && GetHistorys.length < 1 && (
          <div className="mt-3 max-w-lg">
            <div className="bg-blue-100 border border-blue-200 text-gray-800 rounded-lg p-4 dark:bg-blue-800/10 dark:border-blue-900 dark:text-white" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="flex-shrink-0 size-4 mt-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </div>
                <div className="ms-3">
                  <h3 className="font-semibold">
                    Belum ada riwayat <span className="not-italic font-normal">{"¯\\_(ツ)_/¯"}</span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
