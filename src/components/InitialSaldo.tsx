"use client";

import { ObjectStandartResponse } from "@/interfaces/object-response";
import axiosInstance from "@/lib/axios-instance";
import { SetInitialSaldo } from "@/lib/features/saldo/saldoSlice";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function InitialSaldoProvider({ children }: { children?: ReactNode; }) {
  const dispatch = useDispatch();

  const { data, error, isLoading } = useQuery({
    queryKey: ["saldo"],
    queryFn: async () => {
      const result = await axiosInstance.get<ObjectStandartResponse>("/saldo");
      return result;
    },
  });

  useEffect(() => {
    if (!isLoading && !error) {
      dispatch(SetInitialSaldo(data?.data.data.value_setting || 0));
    }
  }, [data, dispatch, error, isLoading]);

  return <>{children}</>;
};
