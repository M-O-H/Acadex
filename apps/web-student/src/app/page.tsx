"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function HomePage() {
  const router = useRouter();
  const { isAuth, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuth) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isLoading, isAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-pulse text-primary-600 dark:text-primary-400 text-lg">Loading...</div>
    </div>
  );
}
