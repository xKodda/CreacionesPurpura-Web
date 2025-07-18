"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardContent from "./DashboardContent";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else if (session.user.role !== "admin" && session.user.email !== "creacionespurpura.papeleria@gmail.com") {
      // Si no es admin, redirigir a home
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-fondo via-white to-brand-fondoSec flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-acento border-t-transparent mx-auto mb-4"></div>
          <p className="text-brand-principal">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user.role !== "admin" && session.user.email !== "creacionespurpura.papeleria@gmail.com")) {
    return null;
  }

  return <DashboardContent />;
}