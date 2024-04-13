import { ObjectStandartResponseWithError } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { iAdminSession } from "@/modules/administrator/administrator.model";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signOut, useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";

const defaultFormPassword = {
  old_password: "",
  new_password: "",
};

export default function ProfileAdmin() {
  const { data, status } = useSession();
  const user: iAdminSession | null = (data as any)?.user;
  const [GetOpenForm, SetOpenForm] = useState(false);
  const [GetOpenOldPassword, SetOpenOldPassword] = useState(false);
  const [GetOpenNewPassword, SetOpenNewPassword] = useState(false);
  const [FormPassword, SetFormPassword] = useState(defaultFormPassword);

  const { mutate, isError, isSuccess, isPending, error, reset } = useMutation({
    mutationFn: async (body: any) => {
      const respomse = await axiosInstance.put("/admin", body);
      return respomse;
    },
    mutationKey: ["change_password"],
    onError: (e: AxiosError<ObjectStandartResponseWithError>) => {
      return e;
    },
    onSuccess: () => {
      SetFormPassword(defaultFormPassword);
      SetOpenForm(false);
    }
  });

  function SetValueForm(e: ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target;
    SetFormPassword(prev => ({ ...prev, [name]: value }));
  }

  function ChangePassword() {
    mutate(FormPassword);
  }

  function CancelWithCloseForm(mode: "toggle" | "boolean", value?: boolean) {
    if (mode === "toggle") {
      SetOpenForm(prev => !prev);
      return;
    } else {
      SetOpenForm(value === undefined ? true : value);
    }
    SetFormPassword(defaultFormPassword);
    reset();
  }

  return (
    <div >
      <div className="max-w-sm">
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
                    Gagal mengganti password
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
                    Berhasil diperbarui
                  </h3>
                  <div className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                    Anda telah berhasil memperbarui password.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {status === "authenticated" ? (
          <div className="max-w-sm flex flex-col bg-white border border-t-4 border-t-blue-600 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:border-t-blue-500 dark:shadow-slate-700/[.7]">
            <div className="p-4 md:p-5">
              <h3 className="text-lg font-bold capitalize text-gray-800 dark:text-white">
                {user?.name ?? ""}
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Status: {user?.role ?? ""}
              </p>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Username: {user?.username ?? ""}
              </p>
              <button disabled={isPending} onClick={() => CancelWithCloseForm("toggle")} className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400">
                {GetOpenForm ? "Batalkan" : "Ubah password"}
                <svg className="flex-shrink-0 size-4" style={{ rotate: GetOpenForm ? "90deg" : "-90deg" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-sm flex flex-col bg-white border border-t-4 border-t-blue-600 shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:border-t-blue-500 dark:shadow-slate-700/[.7]">
            <div className="p-4 md:p-5">
              <div className="bg-slate-200 h-5 mt-2 w-48 rounded-lg dark:bg-slate-800"></div>
              <div className="bg-slate-200 h-4 mt-4 w-36 rounded-md dark:bg-slate-800"></div>
              <div className="bg-slate-200 h-4 mt-4 w-40 rounded-md dark:bg-slate-800"></div>
              <div className="bg-slate-200 h-4 mt-4 w-24 rounded-md dark:bg-slate-800"></div>
            </div>
          </div>
        )}
      </div>

      {GetOpenForm && (
        <div className="max-w-sm">
          {(user?.role ?? "admin") !== "super-admin" && (
            <>
              <div className="mt-4">
                <label htmlFor="old-password-inp" className="block text-sm font-medium mb-2 dark:text-white">Password Lama</label>
                <div className="relative">
                  <input type={GetOpenOldPassword ? "text" : "password"} disabled={isPending} id="old-password-inp" onChange={(e) => SetValueForm(e)} value={FormPassword.old_password} name="old_password" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="manusia super 123" autoComplete="off" autoCorrect="off" />
                  <button onClick={() => SetOpenOldPassword(prev => !prev)} type="button" className="absolute top-0 right-0 p-3.5 h-full rounded-e-md">
                    <svg className="flex-shrink-0 size-5 text-gray-400 dark:text-neutral-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      {GetOpenOldPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              {(error?.code !== "ERR_NETWORK" && (error?.response?.data?.errors?.old_password?.length || 0) > 0) && (
                <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
                  <ul>
                    {(error?.response?.data?.errors?.old_password as any)?.map((error: any, index: number) => (
                      <li key={index}>- {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          <div className="mt-4">
            <label htmlFor="new-password-inp" className="block text-sm font-medium mb-2 dark:text-white">Password Baru</label>
            <div className="relative">
              <input type={GetOpenNewPassword ? "text" : "password"} disabled={isPending} id="new-password-inp" onChange={(e) => SetValueForm(e)} value={FormPassword.new_password} name="new_password" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" placeholder="kuda salto 882" autoComplete="off" autoCorrect="off" />
              <button onClick={() => SetOpenNewPassword(prev => !prev)} type="button" className="absolute top-0 right-0 p-3.5 h-full rounded-e-md">
                <svg className="flex-shrink-0 size-5 text-gray-400 dark:text-neutral-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  {GetOpenNewPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
          {(error?.code !== "ERR_NETWORK" && (error?.response?.data?.errors?.new_password?.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {(error?.response?.data?.errors?.new_password as any)?.map((error: any, index: number) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 flex gap-x-3">
            <button disabled={isPending} onClick={() => ChangePassword()} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              SIMPAN
            </button>

            <button disabled={isPending} type="button" onClick={() => CancelWithCloseForm("boolean", false)} className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              BATAL
            </button>
          </div>
        </div>
      )}
      <hr className="my-8 dark:border-gray-600 max-w-xl" />

      <div>
        <button type="button" disabled={status === "loading"} onClick={() => signOut()} className="py-2 px-4 mt-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
          Log Out
        </button>
      </div>
    </div >
  );
};
