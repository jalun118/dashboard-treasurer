"use client";
import { ObjectStandartResponse } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { SetFirstOpenCondition } from "@/lib/features/capture/firstOpenSlice";
import { SetLastOpenCondition } from "@/lib/features/capture/lastOpenSlice";
import ButtonLink from "@/utils/button-link";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function FirstOpenProvider({ children }: { children: ReactNode; }) {
  const dispatch = useDispatch();
  const { status, update } = useSession();
  const pathname = usePathname();

  const { isError: isErrorFirstOpen, isLoading: isLoadingFirstOpen, error: errorFirstOpen, isSuccess: isSuccessFirstOpen } = useQuery({
    queryKey: ["first_open"],
    queryFn: async () => {
      const response = await axiosInstance.get<ObjectStandartResponse>("/capture/first-open");
      return response;
    },
    retry: 2,
    enabled: status === "authenticated"
  });

  useEffect(() => {
    if (isErrorFirstOpen) {
      dispatch(SetFirstOpenCondition({
        isError: isErrorFirstOpen,
        isLoading: isLoadingFirstOpen,
        isSuccess: isSuccessFirstOpen
      }));
    }

    dispatch(SetFirstOpenCondition({
      isError: isErrorFirstOpen,
      isLoading: isLoadingFirstOpen,
      isSuccess: isSuccessFirstOpen
    }));
  }, [isSuccessFirstOpen, isErrorFirstOpen, isLoadingFirstOpen, errorFirstOpen, dispatch]);

  const { isError: isErrorLastOpen, isLoading: isLoadingLastOpen, error: errorLastOpen, isSuccess: isSuccessLastOpen } = useQuery({
    queryKey: ["last_open"],
    queryFn: async () => {
      const response = await axiosInstance.post<ObjectStandartResponse>("/capture/last-open");
      return response;
    },
    enabled: !isLoadingFirstOpen && !isErrorFirstOpen,
    retry: 2
  });

  useEffect(() => {
    dispatch(SetLastOpenCondition({
      isError: isErrorLastOpen,
      isLoading: isLoadingLastOpen,
      isSuccess: isSuccessLastOpen
    }));
  }, [isSuccessLastOpen, isErrorLastOpen, isLoadingLastOpen, errorLastOpen, dispatch]);

  function HandleCopyError(error: "last" | "first") {
    if (navigator.clipboard) {
      if (error === "first") {
        navigator.clipboard.writeText(`kesalahan perhitungan awal:\ncode: "${(errorFirstOpen as AxiosError<ObjectStandartResponse>)?.code ?? "Loading..."}"\nname : "${(errorFirstOpen as AxiosError<ObjectStandartResponse>)?.name ?? "Loading..."}"\nmessage : "${(errorFirstOpen as AxiosError<ObjectStandartResponse>)?.message ?? "Loading..."}"\nresponse : "${(errorFirstOpen as AxiosError<ObjectStandartResponse>)?.response?.data?.message ?? "Loading..."}"`);
        return;
      }

      if (error === "last") {
        navigator.clipboard.writeText(`kesalahan penetapan tanggal:\ncode: "${(errorLastOpen as AxiosError<ObjectStandartResponse>)?.code ?? "Loading..."}"\nname : "${(errorLastOpen as AxiosError<ObjectStandartResponse>)?.name ?? "Loading..."}"\nmessage : "${(errorLastOpen as AxiosError<ObjectStandartResponse>)?.message ?? "Loading..."}"\nresponse : "${(errorLastOpen as AxiosError<ObjectStandartResponse>)?.response?.data?.message ?? "Loading..."}"`);
        return;
      }
    }
    alert("tidak dapat menyalin pesan");
  }

  if ((errorFirstOpen || errorLastOpen) && pathname !== "/initial") {
    return (
      <body className="dark:bg-black">
        <div className="w-full h-screen flex justify-center items-center">
          <div className="w-[90%] md:w-[75%] lg:w-[55%] xl:w-[40%] min-h-[40%] border rounded-3xl p-8 shadow-lg shadow-black/30 dark:shadow-white/15">
            <h3 className="text-2xl font-semibold dark:text-white">Terjadi kesalahan</h3>
            <div className="mt-1 mb-3">
              <span className="text-lg dark:text-white">{">"} Detail kesalahan :</span>
              {isErrorFirstOpen && (
                <div className="mt-3">
                  <span className="text-lg dark:text-white">{"-->"} Kesalahan Perhitung :</span>
                  <pre className="flex flex-col mt-1 p-4 border-[2px] rounded-xl dark:text-white overflow-x-auto">
                    <code>code     : {(errorFirstOpen as AxiosError<ObjectStandartResponse>)?.code ?? "Loading..."}</code>
                    <code>name     : {(errorFirstOpen as AxiosError<ObjectStandartResponse>)?.name ?? "Loading..."}</code>
                    <code>message  : {(errorFirstOpen as AxiosError<ObjectStandartResponse>)?.message ?? "Loading..."}</code>
                    <code>response : {(errorFirstOpen as AxiosError<ObjectStandartResponse>)?.response?.data?.message ?? "Loading..."}</code>
                  </pre>
                </div>
              )}
              {isErrorLastOpen && (
                <div className="mt-2">
                  <span className="text-lg dark:text-white">{"-->"} Kesalahan Penanggalan :</span>
                  <pre className="flex flex-col mt-1 p-4 border-[2px] rounded-xl dark:text-white overflow-x-auto">
                    <code>code     : {(errorLastOpen as AxiosError<ObjectStandartResponse>)?.code ?? "Loading..."}</code>
                    <code>name     : {(errorLastOpen as AxiosError<ObjectStandartResponse>)?.name ?? "Loading..."}</code>
                    <code>message  : {(errorLastOpen as AxiosError<ObjectStandartResponse>)?.message ?? "Loading..."}</code>
                    <code>response : {(errorLastOpen as AxiosError<ObjectStandartResponse>)?.response?.data?.message ?? "Loading..."}</code>
                  </pre>
                </div>
              )}
            </div>
            <div>
              {isErrorFirstOpen && (
                <button onClick={() => HandleCopyError("first")} className="mb-3 block border px-5 py-2 rounded-lg bg-white dark:text-white dark:bg-black active:bg-slate-100 active:dark:bg-slate-900">
                  SALIN KESALAHAN PERHITUNGAN
                </button>
              )}
              {isErrorLastOpen && (
                <button onClick={() => HandleCopyError("last")} className="mb-3 block border px-5 py-2 rounded-lg bg-white dark:text-white dark:bg-black active:bg-slate-100 active:dark:bg-slate-900">
                  SALIN KESALAHAN TANGGAL
                </button>
              )}
              <ButtonLink href="/initial" className="mb-3 block border px-5 py-2 rounded-lg bg-white dark:text-white dark:bg-black active:bg-slate-100 active:dark:bg-slate-900">
                KE INITIAL {"==>"}
              </ButtonLink>
            </div>
          </div>
        </div>
      </body>
    );
  }

  return (
    <>
      {children}
    </>
  );
};