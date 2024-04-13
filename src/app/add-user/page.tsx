"use client";
import useAddUser from "@/lib/features/user/useAddUser";
import { useAppSelector } from "@/lib/hooks";
import ButtonBack from "@/utils/button-back";
import { useState } from "react";

const defaultStateForm = {
  presensi: 0,
  username: "",
  current_saldo: 0,
  payment_debt: 0,
  extra_money: 0
};

export default function AddUserPage() {
  const { isSuccess: FirstOpenSuccess, isLoading: FirstOpenLoading } = useAppSelector(state => state.firstOpen);
  const [getValue, SetValue] = useState(defaultStateForm);

  const { isPending, isSuccess, error, mutate } = useAddUser({
    onSuccess: () => {
      SetValue(defaultStateForm);
    }
  });

  function HandleChange(e: any) {
    const { value, name } = e.target;
    SetValue((currentValue) => ({
      ...currentValue,
      [name]: value
    }));
  }

  function HandleSubmit(e: any) {
    e.preventDefault();

    mutate(getValue);
  }

  return (
    <div>
      <div className="max-w-lg">
        <form onSubmit={(e) => HandleSubmit(e)}>
          <h3 className="dark:text-white font-semibold text-lg">Formulir Tambah Nama</h3>
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
                    Berhasil menambahkan Nama
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
            <label htmlFor="presensi-inp" className="block text-sm font-medium mb-2 dark:text-white">Presensi</label>
            <input type="number" id="presensi-inp" disabled={isPending || !FirstOpenSuccess || FirstOpenLoading} name="presensi" value={getValue.presensi} onChange={HandleChange} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="372" autoComplete="off" autoCorrect="off" />
          </div>
          {(error?.code !== "ERR_NETWORK" && (error?.response?.data?.errors?.presensi?.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {error?.response?.data?.errors?.presensi?.map((error, index) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="name-inp" className="block text-sm font-medium mb-2 dark:text-white">Nama Lengkap</label>
            <input type="text" id="name-inp" disabled={isPending || !FirstOpenSuccess || FirstOpenLoading} name="username" value={getValue.username} onChange={HandleChange} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="john maulana" autoComplete="off" autoCorrect="off" />
          </div>
          {(error?.code !== "ERR_NETWORK" && (error?.response?.data?.errors?.username?.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {error?.response?.data?.errors?.username?.map((error, index) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="default-saldo-inp" className="block text-sm font-medium mb-2 dark:text-white">Jumlah Uang Awal</label>
            <div className="relative">
              <input
                type="number"
                id="default-saldo-inp"
                className="py-3 px-4 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="0.00"
                autoComplete="off"
                autoCorrect="off"
                disabled={isPending || !FirstOpenSuccess || FirstOpenLoading}
                name="current_saldo"
                value={getValue.current_saldo}
                onChange={HandleChange}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3">
                <span className="text-gray-500">Rp</span>
              </div>
            </div>
          </div>
          {(error?.code !== "ERR_NETWORK" && (error?.response?.data?.errors?.current_saldo?.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {error?.response?.data?.errors?.current_saldo?.map((error, index) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="payment-dept-inp" className="block text-sm font-medium mb-2 dark:text-white">Jumlah Hutang</label>
            <div className="relative">
              <input
                type="number"
                id="payment-dept-inp"
                className="py-3 px-4 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="0.00"
                autoComplete="off"
                autoCorrect="off"
                disabled={isPending || !FirstOpenSuccess || FirstOpenLoading}
                name="payment_debt"
                onChange={HandleChange}
                value={getValue.payment_debt}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3">
                <span className="text-gray-500">Rp</span>
              </div>
            </div>
          </div>
          {(error?.code !== "ERR_NETWORK" && (error?.response?.data?.errors?.payment_debt?.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {error?.response?.data?.errors?.payment_debt?.map((error, index) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="extra_money-inp" className="block text-sm font-medium mb-2 dark:text-white">Uang Lebih</label>
            <div className="relative">
              <input
                type="number"
                id="extra_money-inp"
                className="py-3 px-4 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                placeholder="0.00"
                autoComplete="off"
                autoCorrect="off"
                disabled={isPending || !FirstOpenSuccess || FirstOpenLoading}
                name="extra_money"
                onChange={HandleChange}
                value={getValue.extra_money}
              />
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3">
                <span className="text-gray-500">Rp</span>
              </div>
            </div>
          </div>
          {(error?.code !== "ERR_NETWORK" && (error?.response?.data?.errors?.extra_money?.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {error?.response?.data?.errors?.extra_money?.map((error, index) => (
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

            <ButtonBack type="button" disabled={isPending} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              KEMBALI
            </ButtonBack>
          </div>
        </form>
      </div>
    </div>
  );
};
