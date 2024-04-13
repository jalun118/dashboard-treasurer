import { ObjectStandartResponse } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { iAdminSafe, iAdminSession } from "@/modules/administrator/administrator.model";
import ButtonBack from "@/utils/button-back";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const defaultValueAdmin: iAdminSafe = {
  name: "",
  role: "admin",
  sid: "",
  username: "",
  updatedAt: new Date(),
  createdAt: new Date()
};

export default function DeleteAdmin({ sid, user, status }: { sid: string; user: iAdminSession | null, status: "authenticated" | "loading" | "unauthenticated"; }) {
  const [DataState, SetDataState] = useState<iAdminSafe>(defaultValueAdmin);
  const { replace } = useRouter();

  const { data: DataAdmin, isLoading, isError: isErrorQuery } = useQuery({
    queryKey: [`admin_${sid}`],
    retry: 1,
    enabled: status === "authenticated" && user?.role === "super-admin",
    queryFn: async () => {
      const response = await axiosInstance.get<ObjectStandartResponse<iAdminSafe>>(`/admin/${sid}`);
      return response.data;
    }
  });

  useEffect(() => {
    if (DataAdmin && !isErrorQuery && !isLoading) {
      SetDataState(DataAdmin?.data ?? defaultValueAdmin);
    }
  }, [DataAdmin, isErrorQuery, isLoading]);

  const { mutate, isError, isSuccess, isPending, error } = useMutation({
    mutationFn: async (sid: string) => {
      const respomse = await axiosInstance.delete(`/admin/${sid}`);
      return respomse;
    },
    mutationKey: ["change_password"],
    onError: (e: AxiosError<ObjectStandartResponse>) => {
      return e;
    },
    onSuccess: () => {
      const timeOutRedirect = setTimeout(() => {
        replace("/settings");
      }, 3000);
      return () => clearTimeout(timeOutRedirect);
    }
  });

  function DeleteHandle() {
    const confirmBox = confirm(`Apakah anda yakin ingin menghapus \"${DataState.name.toUpperCase()}\" dengan status sebagai \"${DataState.role.toUpperCase()}\", tindakan ini tidak dapat dikembalikan silahkan tekan "Yes/Ya/OK" untuk menghapus?`);
    if (confirmBox === true) {
      return mutate(sid);
    }
  }

  return (
    <div>
      <div className="max-w-lg">
        <div className="mb-4">
          {isError && (
            <div className="bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="flex-shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                </div>
                <div className="ms-4">
                  <h3 className="text-sm font-semibold">
                    Gagal Menghapus
                  </h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    {error?.response?.data?.message ?? error?.message ?? "Coba periksa kembali koneksi jaringan anda atau coba lagi nanti."}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="bg-teal-50 border border-teal-200 text-sm text-gray-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-white" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
                  </span>
                </div>
                <div className="ms-3">
                  <h3 className="text-sm font-semibold">
                    Berhasil Menghapus
                  </h3>
                  <div className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                    Anda telah berhasil menghapus akun.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isLoading && !isErrorQuery && DataAdmin ? (
          <div className="max-w-md flex flex-col bg-white border border-t-4 border-t-blue-600 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:border-t-blue-500 dark:shadow-slate-700/[.7]">
            <div className="p-4 md:p-5">
              <h3 className="text-lg font-bold capitalize text-gray-800 dark:text-white">
                {DataState.name}
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Status: {DataState.role}
              </p>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Username: {DataState.username}
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-md flex flex-col bg-white border border-t-4 border-t-blue-600 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:border-t-blue-500 dark:shadow-slate-700/[.7]">
            <div className="p-4 md:p-5">
              <div className="bg-slate-200 h-5 mt-2 w-48 rounded-lg dark:bg-slate-800"></div>
              <div className="bg-slate-200 h-4 mt-4 w-36 rounded-md dark:bg-slate-800"></div>
              <div className="bg-slate-200 h-4 mt-4 w-40 rounded-md dark:bg-slate-800"></div>
            </div>
          </div>
        )}
      </div>

      <hr className="my-8 dark:border-gray-600 max-w-xl" />

      <div className="flex gap-x-2 mt-3">
        <button type="button" disabled={isLoading || isErrorQuery || isPending} onClick={() => DeleteHandle()} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          HAPUS
        </button>

        <ButtonBack type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
          KEMBALI
        </ButtonBack>
      </div>
    </div>
  );
};
