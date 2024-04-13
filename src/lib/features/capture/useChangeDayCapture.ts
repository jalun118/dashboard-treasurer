import { ObjectStandartResponse } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

interface argsProps {
  onSuccess?: ((data: AxiosResponse<ObjectStandartResponse<any>, any>, variables: any, context: unknown) => unknown);
}

export default function useChangeDayCapture(props?: argsProps) {
  return useMutation({
    mutationFn: async (body: any) => {
      const response = await axiosInstance.put("/capture/day-option", body);
      return response;
    },
    mutationKey: ["save_capture_day"],
    onError: (error: AxiosError<ObjectStandartResponse>) => {
      return error;
    },
    onSuccess: props?.onSuccess,
    retry: 1
  });
};
