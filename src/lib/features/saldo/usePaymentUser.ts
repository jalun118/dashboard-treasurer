import { ObjectStandartResponseWithError } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

interface objErrors {
  sid: string[];
  amount_saldo: string[];
}

export default function usePaymentUser({ onError, onSuccess }: { onError?: ((error: AxiosError<ObjectStandartResponseWithError<any, objErrors>, any>, variables: any, context: unknown) => unknown), onSuccess?: ((data: AxiosResponse<any, any>, variables: any, context: unknown) => unknown); }) {
  return useMutation({
    mutationFn: async (data: any) => {
      const result = await axiosInstance.put("/user", data);
      return result;
    },
    mutationKey: ["payment_user"],
    onError: onError,
    onSuccess: onSuccess
  });
};
