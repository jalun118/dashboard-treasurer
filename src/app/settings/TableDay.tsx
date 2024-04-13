import { GetDayNameID } from "@/utils/date-format";

import useChangeDayCapture from "@/lib/features/capture/useChangeDayCapture";
import useChangeStateCapture from "@/lib/features/capture/useChangeStateCapture";
import useGetDaysCapture from "@/lib/features/capture/useGetDaysCapture";
import useGetStateCapture from "@/lib/features/capture/useGetStateCapture";
import { useAppSelector } from "@/lib/hooks";
import { isSameArray } from "@/utils/utils";
import { useEffect, useState } from "react";

function toggleNumber(arr: number[], number: number) {
  const index = arr.indexOf(number);

  if (index === -1) {
    return [...arr, number];
  } else {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
}

const days = [0, 1, 2, 3, 4, 5, 6];

export default function TableDay() {
  const { isSuccess: FirstOpenSuccess, isLoading: FirstOpenLoading } = useAppSelector(state => state.firstOpen);

  const [isCapture, SetStateCapture] = useState<boolean>(false);
  const [getDayData, SetDayActive] = useState<number[]>([]);

  const { data, error: errorGetDay, isError: isErrorDay, isLoading, refetch } = useGetDaysCapture();

  useEffect(() => {
    if (!isErrorDay && !isLoading) {
      SetDayActive(data?.data?.data ?? []);
    }
  }, [isLoading, data, isErrorDay]);

  function SaveChangeCapture() {
    mutate({ array_day: JSON.stringify(getDayData) });
  }

  const { mutate, isSuccess: isSuccessCaptureDay, error: ErrorCaptureDay, isError: isErrorCaptureDay, isPending: isSendCapture } = useChangeDayCapture({
    onSuccess: () => refetch()
  });

  function SetDataDay(day: number) {
    const result = toggleNumber(getDayData, day);
    SetDayActive(result.sort());
  }

  const { data: DataStateCapture, isLoading: isLoadingCapture, isError: isErrorStateCapture } = useGetStateCapture();

  useEffect(() => {
    if (!isErrorStateCapture && !isLoadingCapture) {
      SetStateCapture(DataStateCapture?.data?.data?.value_setting ?? true);
    }
  }, [isErrorStateCapture, DataStateCapture, isLoadingCapture]);

  const { mutate: mutateState, isError: isErrorState, isPending: isPendingState } = useChangeStateCapture();

  function MutateState(value: boolean) {
    mutateState({ state_data: value });
    SetStateCapture(value);
  }

  return (
    <>
      <h2 className="font-semibold text-lg dark:text-white">
        Opsi Hari Untuk Menjalankan
        {!isErrorStateCapture && !isLoadingCapture && !isErrorState && !isPendingState ? !isCapture ? (
          <span className="inline-flex items-center ms-2 gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">
            STATUS : BERHENTI
          </span>
        ) : (
          <span className="inline-flex items-center ms-2 gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">
            STATUS : BERJALAN
          </span>
        ) : (
          <span className="inline-flex items-center ms-2 gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
            STATUS : LOADING
          </span>
        )}
      </h2>
      <div className="mt-3 md:max-w-screen-sm">
        {isErrorDay && (
          <div className="bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="flex-shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
              </div>
              <div className="ms-4">
                <h3 className="text-sm font-semibold">
                  Tidak bisa mengambil data hari
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  Sepertinya sedang ada masalah, coba <span className="font-bold">Hubungin Pihak Terkait</span> jika masalah ini terus berlanjut.
                  <p>
                    Pesan: <code className="font-semibold">{errorGetDay?.name ?? "server-error"}: {errorGetDay?.message ?? "server response with status 500"}</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col mt-5">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg overflow-hidden dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">No</th>
                    <th scope="col" className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Day</th>
                    <th scope="col" className="px-4 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-gray-400 items-center flex">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {days.map((data, i) => (
                    <tr key={i}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{i + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm capitalize font-medium text-gray-800 dark:text-gray-200">{GetDayNameID(data)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-end text-sm font-medium space-x-3">
                        {!isLoading ? !isErrorDay ? (
                          <div className="flex">
                            <input onChange={() => SetDataDay(i)} type="checkbox" checked={getDayData.includes(data)} className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id={`checkbox-${data}`} />
                          </div>
                        ) : (
                          <div className="flex">
                            <span className="whitespace-nowrap text-sm font-medium text-red-500 italic">error</span>
                          </div>
                        ) : (
                          <div className="flex">
                            <span className="whitespace-nowrap text-sm font-medium text-teal-500 italic">Loading...</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 md:max-w-screen-sm">
        {isErrorCaptureDay && (
          <div className="bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="flex-shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
              </div>
              <div className="ms-4">
                <h3 className="text-sm font-semibold">
                  {ErrorCaptureDay.code === "ERR_BAD_REQUEST" ? "Tidak bisa mengirim formulir" : "Ada masalah dalam pengiriman"}
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  {ErrorCaptureDay.code === "ERR_BAD_REQUEST" ? <>Sepertinya ada masalah dalam memasukan nilai. Coba <span className="font-bold">Hubungin Pihak Terkait</span> jika masalah ini terus berlanjut.</> : <>Kami tidak dapat menyimpan progres apa pun saat ini. Coba beberapa saat lagi atau <span className="font-bold">Hubungin Pihak Terkait</span>.</>}
                </div>
              </div>
            </div>
          </div>
        )}
        {isSuccessCaptureDay && (
          <div className="bg-teal-50 border border-teal-200 text-sm text-gray-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-white" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                  <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
                </span>
              </div>
              <div className="ms-3">
                <h3 className="text-sm font-semibold">
                  Berhasil diperbarui
                </h3>
                <div className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                  Anda telah berhasil memperbarui hari untuk menjalankan penagihan.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="space-x-5 flex items-center mt-5">
        <button onClick={() => SaveChangeCapture()} type="button" disabled={isSendCapture || isSameArray<number>(data?.data?.data ?? [], getDayData) || !FirstOpenSuccess || FirstOpenLoading} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          SIMPAN
        </button>

        {!isErrorStateCapture && !isLoadingCapture && !isErrorState && !isPendingState ? !isCapture ? (
          <button onClick={() => MutateState(true)} disabled={!FirstOpenSuccess || FirstOpenLoading} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
            JALANKAN
          </button>
        ) : (
          <button onClick={() => MutateState(false)} disabled={!FirstOpenSuccess || FirstOpenLoading} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
            HENTIKAN
          </button>
        ) : (
          <button type="button" disabled className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <span className="animate-[spin_0.5s_linear_infinite] inline-block size-3.5 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
              <span className="sr-only">Loading...</span>
            </span>
            <span className="italic">
              Loading...
            </span>
          </button>
        )}
      </div>

    </>
  );
};
