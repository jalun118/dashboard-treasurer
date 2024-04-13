"use client";
import { iAdminSession } from "@/modules/administrator/administrator.model";
import { useSession } from "next-auth/react";
import DeleteAdmin from "./DeleteAdmin";
import DetailAdmin from "./DetailAdmin";

export default function PageUser({ params, searchParams }: { params: { sid: string; }; searchParams: { [key: string]: string | string[] | undefined; }; }) {
  const { data, status } = useSession();
  const user: iAdminSession | null = (data as any)?.user ?? null;

  if (status === "loading" || user?.role !== "super-admin") {
    return (
      <div>
        Loading Authenticated....
      </div>
    );
  }

  if (searchParams?.action === "delete") {
    return <DeleteAdmin sid={params.sid} status={status} user={user} />;
  }

  return <DetailAdmin sid={params.sid} status={status} user={user} />;
};
