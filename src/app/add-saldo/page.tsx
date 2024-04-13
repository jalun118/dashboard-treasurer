"use client";
import axiosInstance from "@/lib/axios-instance";
import { SetSaldo } from "@/lib/features/saldo/saldoSlice";
import ButtonBack from "@/utils/button-back";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";

interface responseApi {
  data: any | null;
  message: string;
  success: boolean;
}

export default function AddSaldoPage() {
  const dispatch = useDispatch();
  const [GetAmount, SetAmount] = useState<number>(0);

  const { mutate, isSuccess, error, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const result = await axiosInstance.put<responseApi>("/saldo", data);
      return result;
    },
    mutationKey: ["add_saldo"],
    onError: (error: AxiosError<responseApi>) => {
      return error;
    },
    onSuccess: () => {
      dispatch(SetSaldo(GetAmount));
      SetAmount(0);
    }
  });

  function AddSaldo(event: FormEvent) {
    event.preventDefault();
    mutate({
      amount: GetAmount
    });
  }

  function ChangeAmount(value: string) {
    const parse = parseFloat(value);
    SetAmount(parse);
  }

  return (
    <div>
      <div className="max-w-lg">
        <form onSubmit={AddSaldo}>
          <h3 className="dark:text-white font-semibold text-lg">Tambah Saldo</h3>
          {isSuccess && (
            <div className="bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500 shadow-lg mt-3" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="flex-shrink-0 size-4 text-teal-600 mt-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div className="ms-3">
                  <h3 className="text-gray-800 font-semibold dark:text-white">
                    Berhasil mengirim formulir
                  </h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                    Berhasil Menambah Saldo
                  </p>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500 shadow-lg mt-3" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="flex-shrink-0 size-4 text-red-600 mt-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div className="ms-3">
                  <h3 className="text-gray-800 font-semibold dark:text-white">
                    Kesalahan pengiriman formulir
                  </h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                    {error?.code === "ERR_NETWORK" ? "Ada kesalahan pada koneksi jaringan Anda, silakan kirim lagi atau coba lagi di lain waktu." : error.response?.data.message}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 max-w-sm">
            <label htmlFor="amount-saldo-inp" className="block text-sm font-medium mb-3 dark:text-white">Jumlah Uang Yang Di Tambahkan</label>
            <div className="relative">
              <input
                type="number"
                id="amount-saldo-inp"
                className="py-3 px-4 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="0.00"
                autoComplete="off"
                autoCorrect="off"
                disabled={isPending}
                onChange={(e) => ChangeAmount(e.target.value)}
                value={GetAmount}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                <span className="text-gray-500">Rp</span>
              </div>
            </div>
          </div>
          <div className="mt-5 space-x-3 flex items-center">
            <button disabled={isPending} type="submit" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              SIMPAN
            </button>

            <ButtonBack disabled={isPending} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              KEMBALI
            </ButtonBack>
          </div>
        </form>
      </div>
    </div>
  );
};
