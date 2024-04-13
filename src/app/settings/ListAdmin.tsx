"use client";
import { ObjectStandartResponse } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { iAdminSafe, iAdminSession } from "@/modules/administrator/administrator.model";
import ButtonLink from "@/utils/button-link";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ListAdmin() {
  const { data: dataSession, status: statusSession } = useSession();
  const user: iAdminSession | null = (dataSession as any)?.user;

  const [GetAdmins, SetAdmins] = useState<iAdminSafe[]>([]);

  const { data, isLoading, isError } = useQuery({
    enabled: statusSession === "authenticated" && user?.role === "super-admin",
    queryKey: ["list_all_admin"],
    queryFn: async () => {
      const response = await axiosInstance.get<ObjectStandartResponse<iAdminSafe[]>>("/admin", { params: { "with-me": "true" } });
      return response;
    },
    retry: 1,
  });

  useEffect(() => {
    if (!isLoading && !isError && data) {
      SetAdmins(data?.data?.data ?? []);
    }
  }, [isLoading, isError, data]);

  if (statusSession === "loading" || user?.role === "admin") return <></>;

  return (
    <>
      <div className="my-8 flex flex-row items-center max-w-xl">
        <hr className="dark:border-gray-600 w-1/12" />
        <span className="whitespace-nowrap ms-2 me-2 dark:text-white">LIST AKUN</span>
        <hr className="dark:border-gray-600 w-full" />
      </div>

      <div className="mb-4">
        <ButtonLink href="/add-admin" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Tambah Admin</ButtonLink>
      </div>

      <div className="max-w-2xl">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">No</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Nama</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Username</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap text-start text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Role</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap text-end text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading && (
                      <tr>
                        <td rowSpan={6} className="px-4 py-4 whitespace-nowrap text-sm font-medium text-teal-500 italic">Loading...</td>
                      </tr>
                    )}
                    {!isLoading && !isError && GetAdmins.length > 0 && GetAdmins.map((admin, i) => (
                      <tr key={i}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{i + 1}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 capitalize">{admin.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{admin.username}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 uppercase">
                          {admin?.role === "super-admin" ? (
                            <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-800/30 dark:text-violet-500">
                              {admin.role.replaceAll("-", " ")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">
                              {admin.role}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-end text-sm font-medium space-x-3">
                          <ButtonLink href={`/user/${admin.sid}`} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Edit</ButtonLink>
                          <ButtonLink href={`/user/${admin.sid}?action=delete`} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Hapus</ButtonLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
