import { ObjectStandartResponseWithError } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { useMutation } from "@tanstack/react-query";

export default function useChangeStateCapture() {
  return useMutation({
    mutationFn: async (body: any) => {
      const response = await axiosInstance.put<ObjectStandartResponseWithError>(`/capture/option`, body);
      return response;
    },
    mutationKey: ["mutate_data_state"],
  });
};
