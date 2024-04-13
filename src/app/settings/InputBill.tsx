"use client";
import useChangeBIllPerDay from "@/lib/features/capture/useChangeBIllPerDay";
import useGetBillPerDay from "@/lib/features/capture/useGetBillPerDay";
import { useAppSelector } from "@/lib/hooks";
import { FormEvent, useEffect, useState } from "react";

export default function InputBill() {
  const [GetInputValue, SetInputValue] = useState("0.00");
  const { isSuccess: FirstOpenSuccess, isLoading: FirstOpenLoading } = useAppSelector(state => state.firstOpen);

  const { data, error: ErrorGetBill, isLoading, isError, refetch } = useGetBillPerDay();

  useEffect(() => {
    if (!isLoading && !isError) {
      SetInputValue(data?.data?.toString() ?? "");
    }
  }, [isLoading, isError, data]);

  const { mutate, isPending, isError: isErrorMutate, error: ErrorMutate, isSuccess: isSuccessChange } = useChangeBIllPerDay({
    onSuccess: () => refetch()
  });

  function SendValue(e: FormEvent) {
    e.preventDefault();

    mutate({
      amount: parseFloat(GetInputValue)
    });
  }

  return (
    <>
      <h2 className="font-semibold text-lg dark:text-white">
        Jumlah Tagihan Per Hari
      </h2>

      <div className="mt-3 md:max-w-md">
        {isError && (
          <div className="bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="flex-shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
              </div>
              <div className="ms-4">
                <h3 className="text-sm font-semibold">
                  Tidak bisa mengambil data tagihan
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  Sepertinya sedang ada masalah, coba <span className="font-bold">Hubungin Pihak Terkait</span> jika masalah ini terus berlanjut.
                  <p>
                    Pesan: <code className="font-semibold">{ErrorGetBill?.name ?? "server-error"}: {ErrorGetBill?.message ?? "server response with status 500"}</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isErrorMutate && (
          <div className="bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="flex-shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
              </div>
              <div className="ms-4">
                <h3 className="text-sm font-semibold">
                  Tidak dapat menyimpan perubahan
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  Sepertinya sedang ada masalah, coba <span className="font-bold">Hubungin Pihak Terkait</span> jika masalah ini terus berlanjut.
                  <p>
                    Pesan: <code className="font-semibold">{ErrorMutate?.name ?? "server-error"}: {ErrorMutate?.message ?? "server response with status 500"}</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSuccessChange && (
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
                  Anda telah berhasil memperbarui jumlah tagihan per hari .
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-sm">
        <form onSubmit={SendValue}>
          <div className="mt-4">
            <div className="relative">
              <input
                type="number"
                id="number-of-bills-per-day"
                name="number-of-bills-per-day"
                className="py-3 px-4 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="0.00"
                autoComplete="off"
                autoCorrect="off"
                disabled={isLoading || isPending}
                onChange={(e) => SetInputValue(e.target.value)}
                value={GetInputValue}
              />

              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3">
                <span className="text-gray-500">Rp</span>
              </div>
            </div>
          </div>

          <div className="space-x-5 flex items-center mt-5">
            <button disabled={isLoading || isPending || GetInputValue === (data?.data?.toString() ?? "") || !FirstOpenSuccess || FirstOpenLoading} type="submit" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              SIMPAN
            </button>

            {!isLoading && GetInputValue !== (data?.data?.toString() ?? "") && (
              <button type="button" onClick={() => SetInputValue(data?.data?.toString() ?? "")} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
                BATALKAN
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
