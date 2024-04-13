"use client";
import axiosInstance from "@/lib/axios-instance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

interface ErrorsResponse {
  current_saldo: string[];
  payment_debt: string[];
  presensi: string[];
  username: string[];
  extra_money: string[];
}

interface DefaultResponse {
  data: any | null;
  message: string;
  errors: ErrorsResponse;
  success: boolean;
}

export default function useAddUser({ onSuccess }: { onSuccess?: ((data: AxiosResponse<DefaultResponse, any>, variables: any, context: unknown) => unknown); }) {
  return useMutation({
    mutationKey: ["add-user"],
    mutationFn: async (body: any) => {
      const result = await axiosInstance.post<DefaultResponse>("/user", body);
      return result;
    },
    onError: (error: AxiosError<DefaultResponse>) => {
      return error;
    },
    onSuccess: onSuccess
  });
};
