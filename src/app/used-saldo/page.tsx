"use client";
import { ObjectStandartResponseWithError } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { SetReducingSaldo } from "@/lib/features/saldo/saldoSlice";
import ButtonBack from "@/utils/button-back";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";

const defaultValue = {
  title: "",
  amount: "",
};

interface errorType {
  title: string[];
  amount: string[];
}

export default function UsedSaldoPage() {
  const [GetValue, SetValue] = useState(defaultValue);
  const dispatch = useDispatch();

  function handleChange(e: any) {
    const { name, value } = e.target;
    SetValue(currentValue => ({ ...currentValue, [name]: value }));
  }

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationKey: ["used-saldo"],
    mutationFn: async (body: any) => {
      const result = axiosInstance.post<ObjectStandartResponseWithError<any, errorType>>("/used", body);
      return result;
    },
    onSuccess: () => {
      const valueSaldo = parseFloat(GetValue.amount);
      dispatch(SetReducingSaldo(valueSaldo));
      SetValue(defaultValue);
    },
    onError: (error: AxiosError<ObjectStandartResponseWithError<any, errorType>>) => {
      return error;
    }
  });

  function handleSubmit(e: any) {
    e.preventDefault();
    mutate({
      ...GetValue,
      amount: parseFloat(GetValue.amount)
    });
  }

  return (
    <div>
      <div className="max-w-lg">
        <form onSubmitCapture={(e) => handleSubmit(e)}>
          <h3 className="dark:text-white font-semibold text-lg">Formulir Penggunaan Uang</h3>
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
                    Uang berhasil digunakan
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

          <div className="mt-4">
            <label htmlFor="title-used-inp" className="block text-sm font-medium mb-2 dark:text-white">Nama barang atau kegiatan</label>
            <input type="text" id="title-used-inp" disabled={isPending} value={GetValue.title} name="title" onChange={(e) => handleChange(e)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="Sapu, Acara class meet" autoComplete="off" autoCorrect="off" />
          </div>
          {(error?.code !== "ERR_NETWORK" && (error?.response?.data?.errors?.title?.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {error?.response?.data?.errors?.title?.map((error, index) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="price-used-inp" className="block text-sm font-medium mb-2 dark:text-white">Jumlah dana</label>
            <div className="relative">
              <input
                type="number"
                id="price-used-inp"
                className="py-3 px-4 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="0.00"
                autoComplete="off"
                autoCorrect="off"
                disabled={isPending}
                name="amount"
                onChange={(e) => handleChange(e)}
                value={GetValue.amount}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3">
                <span className="text-gray-500">Rp</span>
              </div>
            </div>
          </div>
          {(error?.code !== "ERR_NETWORK" && (error?.response?.data?.errors?.amount?.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {error?.response?.data?.errors?.amount?.map((error, index) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 space-x-3 flex items-center">
            <button disabled={isPending} type="submit" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              SIMPAN
            </button>

            <ButtonBack disabled={isPending} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              KEMBALI
            </ButtonBack>
          </div>
        </form>
      </div>
    </div>
  );
};
