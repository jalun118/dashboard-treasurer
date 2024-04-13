import { ObjectStandartResponse } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";

export default function useGetBillPerDay() {
  return useQuery({
    queryKey: ["get_bill_per_day"],
    queryFn: async () => {
      const response = await axiosInstance.get<ObjectStandartResponse<number>>("/capture/dept-per-day");
      return response.data;
    },
  });

};
