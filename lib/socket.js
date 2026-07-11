import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// On configure l'instance sans la connecter immédiatement
export const socket = io(SOCKET_URL, {
  autoConnect: false, 
  withCredentials: true // Transmet les cookies au serveur WebSocket si nécessaire
});