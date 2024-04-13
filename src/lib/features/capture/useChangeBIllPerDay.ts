import { ObjectStandartResponse } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

interface props {
  onSuccess?: ((data: AxiosResponse<any, any>, variables: any, context: unknown) => unknown);
}

export default function useChangeBIllPerDay(props?: props) {
  return useMutation({
    mutationKey: ["set_data_bill_per_day"],
    mutationFn: async (body: any) => {
      const response = await axiosInstance.put("/capture/dept-per-day", body);
      return response;
    },
    onError: (e: AxiosError<ObjectStandartResponse>) => {
      return e;
    },
    onSuccess: props?.onSuccess
  });

};
