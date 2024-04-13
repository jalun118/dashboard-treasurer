import { ObjectStandartResponse } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";

export default function useGetStateCapture() {
  return useQuery({
    queryFn: async () => {
      const response = await axiosInstance.get<ObjectStandartResponse>("/capture/option");
      return response;
    },
    queryKey: ["data_state_capture"],
    retry: 1
  });
};
