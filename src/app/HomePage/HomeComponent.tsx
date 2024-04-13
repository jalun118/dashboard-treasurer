"use client";

import Toast, { InterfaceToast } from "@/components/Toast";
import { useState } from "react";
import HistoryComponent from "../history-manage/history-component";
import TableUser from "./TableUser";

export default function HomeComponent() {
  const [GetToast, SetToasts] = useState<InterfaceToast[]>([]);

  function removeToast(index: number) {
    SetToasts(currentToast => currentToast.filter((_, dataIndex) => dataIndex !== index));
  }

  function addNewToast(data: InterfaceToast) {
    SetToasts(currentToasts => [...currentToasts, data]);
  }

  return (
    <>
      <TableUser setToast={addNewToast}  />

      <hr className="my-8 dark:border-gray-600 max-w-xl" />

      <HistoryComponent />

      <div className="fixed md:max-w-md w-[calc(100%/1.2)] bottom-3 md:bottom-10 start-1/2 -translate-x-1/2 md:-translate-x-0 md:start-9">
        {GetToast.map((toast, index) => (
          <Toast key={index} index={index} message={toast.message} variant={toast.variant} onClose={removeToast} />
        ))}

      </div>
    </>
  );
};
