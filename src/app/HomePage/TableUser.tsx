"use client";
import { InterfaceToast } from "@/components/Toast";
import useDeleteUser from "@/lib/features/user/useDeleteUser";
import useGetAllUser from "@/lib/features/user/useGetAllUser";
import { useAppSelector } from "@/lib/hooks";
import { iUser } from "@/modules/user/user.model";
import ButtonLink from "@/utils/button-link";
import { FormatMoneyId } from "@/utils/utils";
import { useEffect, useState } from "react";

interface userIdentify {
  username: string;
  id: string;
}

const defaultIdentify: userIdentify = {
  username: "",
  id: ""
};

export default function TableUser({ setToast }: { setToast: Function | (({ message, variant }: InterfaceToast) => void); }) {
  const { isSuccess, isLoading: isLoadingFirstOpen } = useAppSelector(states => states.firstOpen);
  const [users, SetUsers] = useState<iUser[]>([]);
  const [GetIdentify, SetIdentify] = useState<userIdentify>(defaultIdentify);

  const { isLoading, error, data, isRefetching, refetch } = useGetAllUser({ enabled: isSuccess });

  useEffect(() => {
    if (!isLoading && !error && isSuccess) {
      SetUsers(data?.data?.data || []);
    }
  }, [isLoading, error, data, isRefetching, isSuccess]);

  const { mutate } = useDeleteUser({
    onSuccess: (success) => {
      setToast({
        variant: "success",
        message: `Success to delete ${success.data.data.username}`
      });
    },
    onError: () => {
      setToast({
        variant: "danger",
        message: "Error to delete user"
      });
    },
  });

  function clearStateIdentify() {
    SetIdentify(defaultIdentify);
  }

  function Delete(id: string) {
    clearStateIdentify();
    SetUsers(currentUsers => currentUsers.filter((item) => item.sid !== id));
    mutate(id);
  }

  function ActionDeleteButton(username: string, id: string) {
    SetIdentify({
      username,
      id
    });
  }

  return (
    <>
      <div className="mt-2 mb-2 flex justify-between">
        <ButtonLink href="/add-user" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Tambah Nama</ButtonLink>

        <button type="button" disabled={isLoading || isRefetching} onClick={() => refetch()} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>
            Refresh
          </span>
        </button>
      </div>

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg overflow-hidden dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Presensi</th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Nama</th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Total uang</th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Total Hutang</th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Uang Lebih</th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Status</th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap text-end text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading && !isLoadingFirstOpen && (
                    <tr>
                      <td rowSpan={6} className="px-4 py-4 whitespace-nowrap text-sm font-medium text-teal-500 italic">Loading...</td>
                    </tr>
                  )}
                  {!isLoading && isLoadingFirstOpen && (
                    <tr>
                      <td rowSpan={6} className="px-4 py-4 whitespace-nowrap text-sm font-medium text-teal-500 italic">Loading...</td>
                    </tr>
                  )}
                  {!isLoadingFirstOpen && !isLoading && users.length < 1 && (
                    <tr>
                      <td rowSpan={6} className="px-4 py-4 whitespace-nowrap text-sm font-medium text-red-500 italic">Tidak ada daftar</td>
                    </tr>
                  )}
                  {users.length > 0 && users.map((data, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{data.presensi}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 capitalize">{data.username}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{FormatMoneyId(data.current_saldo || 0)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{FormatMoneyId(data.payment_debt || 0)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{FormatMoneyId(data.extra_money || 0)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-end text-sm font-medium space-x-3 uppercase justify-start flex">
                        {data.payment_debt < 1 ? (
                          <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">lunas</span>
                        ) : (
                          <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">hutang</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-end text-sm font-medium space-x-3">
                        <button onClick={() => ActionDeleteButton(data.username, data.sid)} data-hs-overlay="#modal-confirm" type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div id="modal-confirm" className="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-[80] opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none">
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-7 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white">
                Konfirmasi Hapus
              </h3>
              <button type="button" className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#modal-confirm">
                <span className="sr-only">Close</span>
                <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <p className="mt-1 text-gray-800 dark:text-gray-400">
                Perubahan ini <span className="font-semibold">`Tidak Dapat Dikembalikan`</span> setelah dilakukan, mohon konfirmasi terlebih dahulu. Apakah Anda yakin ingin menghapus <code className="capitalize">`{GetIdentify.username}`</code>?
              </p>
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
              <button type="button" onClick={() => clearStateIdentify()} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#modal-confirm">
                Keluar
              </button>
              <button type="button" onClick={() => Delete(GetIdentify.id)} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#modal-confirm">
                Ya, saya yakin.
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
