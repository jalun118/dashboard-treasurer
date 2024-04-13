"use client";
import { ObjectStandartResponseWithError } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { iAdminSession, tRoleAdmin } from "@/modules/administrator/administrator.model";
import ButtonBack from "@/utils/button-back";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import ReactSelect from "react-select";

type tDataList = {
  value: tRoleAdmin,
  label: string;
};

const dataList: tDataList[] = [
  {
    value: "admin",
    label: "Admin"
  },
  {
    value: "super-admin",
    label: "Super Admin"
  }
];

const defaultValue = {
  name: "",
  username: "",
  password: ""
};

export default function AddAdminPage() {
  const [ValueRole, SetValueRole] = useState<any>();
  const [GetAllForm, SetForm] = useState(defaultValue);

  const { data, status } = useSession();
  const user: iAdminSession | null = (data as any)?.user ?? null;

  function HandleFormValue(e: ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target;

    SetForm(prev => ({ ...prev, [name]: value }));
  }

  const { mutate, error, isError, isPending, isSuccess } = useMutation({
    mutationKey: ["add_new_admin"],
    mutationFn: async (body: any) => {
      const response = await axiosInstance.post<ObjectStandartResponseWithError>("/admin", body);
      return response;
    },
    onError: (e: AxiosError<ObjectStandartResponseWithError>) => {
      return e;
    },
    onSuccess: (s) => {
      SetValueRole({});
      SetForm(defaultValue);
      return s;
    },
  });

  function HandleSubmit(e: FormEvent) {
    e.preventDefault();

    mutate({
      ...GetAllForm,
      role: ValueRole.value
    });
  }

  if (status === "loading" || user?.role !== "super-admin") {
    return (
      <div>
        Loading Authenticated....
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-lg">
        <form onSubmit={HandleSubmit}>
          <h3 className="dark:text-white font-semibold text-lg">Formulir Tambah Admin</h3>

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
          {isError && (
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
            <label htmlFor="name-admin-inp" className="block text-sm font-medium mb-3 dark:text-white">Nama</label>
            <input
              type="text"
              id="name-admin-inp"
              className="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
              placeholder="John Dalton"
              autoComplete="off"
              autoCorrect="off"
              name="name"
              onChange={(e) => HandleFormValue(e)}
              value={GetAllForm.name}
              disabled={isPending}
            />
          </div>
          {(error?.code !== "ERR_NETWORK" && ((error?.response?.data as any)?.errors?.name?.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {(error?.response?.data as any)?.errors?.name?.map((error: any, index: number) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="username-admin-inp" className="block text-sm font-medium mb-3 dark:text-white">Username</label>
            <input
              type="text"
              id="username-admin-inp"
              className="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
              placeholder="kuda_salto123"
              autoComplete="off"
              autoCorrect="off"
              name="username"
              onChange={(e) => HandleFormValue(e)}
              value={GetAllForm.username}
              disabled={isPending}
            />
          </div>
          {(error?.code !== "ERR_NETWORK" && ((error?.response?.data as any)?.errors?.username?.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {(error?.response?.data as any)?.errors?.username?.map((error: any, index: number) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="default-password-admin-inp" className="block text-sm font-medium mb-3 dark:text-white">Default Password</label>
            <input
              type="text"
              id="default-password-admin-inp"
              className="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
              placeholder="kuda racing 123"
              autoComplete="off"
              autoCorrect="off"
              name="password"
              onChange={(e) => HandleFormValue(e)}
              value={GetAllForm.password}
              disabled={isPending}
            />
          </div>
          {(error?.code !== "ERR_NETWORK" && ((error?.response?.data as any)?.errors?.password?.length || 0) > 0) && (
            <div className="font-semibold text-sm text-red-600 mt-1 capitalize">
              <ul>
                {(error?.response?.data as any)?.errors?.password?.map((error: any, index: number) => (
                  <li key={index}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="role-admin-payment" className="block text-sm font-medium mb-2 dark:text-white">Role</label>
            {status === "authenticated" && user?.role === "super-admin" ? (
              <ReactSelect
                options={dataList}
                id="role-admin-payment"
                placeholder="Pilih Role Admin..."
                classNames={{
                  placeholder: () => "text-inherit",
                  option: () => "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-[0.5rem_!important] focus:outline-none focus:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-gray-200 dark:focus:bg-slate-800 capitalize",
                  menu: () => "mt-[0.7rem_!important] z-50 w-full max-h-[300px] p-1 space-y-0.5 bg-white border border-gray-200 rounded-[0.5rem_!important] overflow-hidden overflow-y-auto dark:bg-slate-900 dark:border-gray-700 overflow-hidden",
                  menuList: () => "overflow-hidden",
                  singleValue: () => "dark:text-[inherit_!important] capitalize",
                  control: () => "py-1 px-2 block w-full border-gray-200 rounded-[0.5rem_!important] text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                }}
                noOptionsMessage={() => ""}
                onChange={(e) => SetValueRole(e)}
                value={ValueRole}
                isDisabled={isPending}
              />
            ) : (
              <select className="py-3 px-2 block w-full border-gray-200 rounded-[0.5rem_!important] text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
              </select>
            )}
          </div>

          <div className="mt-5 space-x-3 flex items-center">
            <button type="submit" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              SIMPAN
            </button>

            <ButtonBack className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              KEMBALI
            </ButtonBack>
          </div>
        </form>
      </div>
    </div>
  );
};
