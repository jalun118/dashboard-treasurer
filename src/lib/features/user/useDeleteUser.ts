import axiosInstance from "@/lib/axios-instance";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface responseDelete {
  data: any;
  success: boolean;
  message: string;
}

export default function useDeleteUser({ onSuccess, onError }: { onSuccess?: ((data: AxiosResponse<responseDelete, any>, variables: string, context: unknown) => unknown); onError?: ((error: Error, variables: string, context: unknown) => unknown); }) {
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await axiosInstance.delete<responseDelete>(`/user?sid=${id}`);
      return result;
    },
    onSuccess: onSuccess,
    onError: onError,
  });
};
