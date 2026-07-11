"use server";
import { cookies } from "next/headers";
import { API, AUTH_COOKIE_NAME } from "./data";

export const isValidAuthToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;

  const response = await fetch(
    `${API}/api/admin/check-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // On envoie le token explicitement ici
      },
      // Plus besoin de "credentials: include" puisque tu l'passes dans le header
    },
  );

  if (!response.ok) {
    return false;
  }
  const data = await response.json();
  
  return data.valid;
};
