"use client";
import InputBill from "./InputBill";
import ListAdmin from "./ListAdmin";
import ProfileAdmin from "./ProfileAdmin";
import TableDay from "./TableDay";

export default function SettingsPage() {
  return (
    <div className="mt-4">

      <TableDay />

      <hr className="my-8 dark:border-gray-600 max-w-xl" />

      <InputBill />
      
      <ListAdmin />
      
      <div className="my-8 flex flex-row items-center max-w-xl">
        <hr className="dark:border-gray-600 w-1/12" />
        <span className="whitespace-nowrap ms-2 me-2 dark:text-white">PERSONAL AKUN</span>
        <hr className="dark:border-gray-600 w-full" />
      </div>

      <ProfileAdmin />
    </div >
  );
};
