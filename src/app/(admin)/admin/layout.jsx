"use client";
import "@/components/admin/admin.styles.css";

// import "@/app/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { getToken, getRoleFromToken } from "@/utils/auth";

export default function AdminRootLayout({ children }) {
  const router = useRouter();

  // useEffect(() => {
  //   const token = getToken();
  //   const role = getRoleFromToken();

  //   if (!token || role !== "ADMIN") {
  //     router.replace("/auth");
  //   }
  // }, []);

  return <AdminLayout>{children}</AdminLayout>;
}
