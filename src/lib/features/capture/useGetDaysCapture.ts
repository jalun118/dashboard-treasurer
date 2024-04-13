import { ObjectStandartResponse } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";

export default function useGetDaysCapture() {
  return useQuery({
    queryFn: async () => {
      const response = await axiosInstance.get<ObjectStandartResponse<number[]>>("/capture/day-option");
      return response;
    },
    queryKey: ["data_day"]
  });
};
