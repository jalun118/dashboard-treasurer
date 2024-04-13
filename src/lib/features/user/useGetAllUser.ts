import axiosInstance from "@/lib/axios-instance";
import { iUser } from "@/modules/user/user.model";
import { useQuery } from "@tanstack/react-query";

interface responBody {
  data: iUser[] | null;
  success: boolean;
  message: string;
}

interface props {
  enabled?: boolean;
}

export default function useGetAllUser(props?: props) {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const result = await axiosInstance.get<responBody>("/user");
      return result;
    },
    enabled: props?.enabled
  });
};
