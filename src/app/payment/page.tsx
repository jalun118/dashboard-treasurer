"use client";

import { SetSaldo } from "@/lib/features/saldo/saldoSlice";
import usePaymentUser from "@/lib/features/saldo/usePaymentUser";
import useGetAllUser from "@/lib/features/user/useGetAllUser";
import { useAppSelector } from "@/lib/hooks";
import ButtonBack from "@/utils/button-back";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ReactSelect from "react-select";

export default function PaymentPage() {
  const { isSuccess: FirstOpenSuccess, isLoading: FirstOpenLoading } = useAppSelector(state => state.firstOpen);
  const [isMounted, setIsMounted] = useState(false);
  const [GetAmount, SetAmount] = useState("0");
  const [GetUser, SetUser] = useState<any>();
  const { data } = useGetAllUser();
  const dispatch = useDispatch();

  useEffect(() => setIsMounted(true), []);

  function removeValue() {
    SetUser({});
    SetAmount("0");
  }

  const dataList = data?.data.data?.sort((a, b) => a.presensi - b.presensi).map(data => ({ value: data.sid, label: `${data.presensi}. ${data.username}` })) ?? [];

  const { mutate, isSuccess, error, isPending } = usePaymentUser({
    onSuccess: () => {
      const valueSaldo = parseFloat(GetAmount);
      dispatch(SetSaldo(valueSaldo));
      removeValue();
    }
  });

  function HandleSubmit(e: any) {
    e.preventDefault();
    mutate({
      sid: GetUser?.value || "",
      amount_saldo: GetAmount
    });
  }

  return (
    <div>
      <div className="max-w-lg">
        <form onSubmit={(e) => HandleSubmit(e)}>
          <h3 className="dark:text-white font-semibold text-lg">Pembayaran</h3>
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
                    Berhasil mengirimkan formulir
                  </h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                    Pembayaran berhasil
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
            <label htmlFor="name-inp-payment" className="block text-sm font-medium mb-2 dark:text-white">Nama</label>
            {isMounted ? (
              <ReactSelect
                options={dataList}
                id="name-inp-payment"
                placeholder="Pilih Nama..."
                classNames={{
                  placeholder: () => "text-inherit",
                  option: () => "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-[0.5rem_!important] focus:outline-none focus:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-gray-200 dark:focus:bg-slate-800 capitalize",
                  menu: () => "mt-[0.7rem_!important] z-50 w-full max-h-[300px] p-1 space-y-0.5 bg-white border border-gray-200 rounded-[0.5rem_!important] overflow-hidden overflow-y-auto dark:bg-slate-900 dark:border-gray-700 overflow-hidden",
                  menuList: () => "overflow-hidden",
                  singleValue: () => "dark:text-[inherit_!important] capitalize",
                  control: () => "py-1 px-2 block w-full border-gray-200 rounded-[0.5rem_!important] text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                }}
                noOptionsMessage={() => ""}
                isDisabled={isPending || !FirstOpenSuccess || FirstOpenLoading}
                value={GetUser}
                onChange={(e) => SetUser(e)}
              />
            ) : (
              <select className="py-3 px-2 block w-full border-gray-200 rounded-[0.5rem_!important] text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">

              </select>
            )}
          </div>
          {(error?.code !== "ERR_NETWORK" && (error?.response?.data?.errors?.sid.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {error?.response?.data?.errors?.sid?.map((error, index) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="user-payment-dept-inp" className="block text-sm font-medium mb-2 dark:text-white">Jumlah Uang Yang Di Bayar</label>
            <div className="relative">
              <input
                type="number"
                id="user-payment-dept-inp"
                className="py-3 px-4 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="0.00"
                autoComplete="off"
                autoCorrect="off"
                disabled={isPending || !FirstOpenSuccess || FirstOpenLoading}
                onChange={(e) => SetAmount(e.target.value)}
                value={GetAmount}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                <span className="text-gray-500">Rp</span>
              </div>
            </div>
          </div>
          {(error?.code !== "ERR_NETWORK" && (error?.response?.data?.errors?.amount_saldo.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {error?.response?.data?.errors?.amount_saldo?.map((error, index) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 space-x-3 flex items-center">
            <button disabled={isPending || !FirstOpenSuccess || FirstOpenLoading} type="submit" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
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
