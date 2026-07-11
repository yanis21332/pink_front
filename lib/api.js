"use server"

import { cookies } from "next/headers";
import { API, AUTH_COOKIE_NAME, AUTH_TOKEN_VALUE } from "./data";

export async function isValidAuthToken(token) {
  if (!token) return false;

}
export async function loginUser(username, password) {
    try {
      const response = await fetch(
        `${API}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        
        return { ok: false, error: data.error || "Erreur de connexion."};
      }
      const cookieStore = await cookies();

      cookieStore.set(AUTH_COOKIE_NAME, data.token, {
        httpOnly: true, // Sécurise contre les attaques XSS
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 semaine
        path: "/",
      });
      return { ok: true, token: data.token };
      // window.location.href = '/';
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);

        return { ok: false, error: "Erreur de connexion." };
    }
}