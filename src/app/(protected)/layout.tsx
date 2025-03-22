"use client";

import { userAtom } from "@/atoms/UserAtoms";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/navigation/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { ENDPOINTS } from "@/lib/ApiUrl";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const setUser = useSetAtom(userAtom)
  const router = useRouter()
  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";
  useEffect(() => {
    async function verify() {

      const res = await fetch(ENDPOINTS.AUTH.VERIFY);
      if (res.ok) {
        const result = await res.json();
        setUser(result.user)
      } else {
        router.push('/signin')
      }
    }
    verify()
  }, [setUser, router])


  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
