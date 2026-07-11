"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Register from "../../components/Register";
import { isValidAuthToken } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const isValid = await isValidAuthToken();
      if (isValid) {
        
        router.refresh();
        router.push("/");
      }
    }
    checkAuth();
  }, []);

  return <Register />;
}