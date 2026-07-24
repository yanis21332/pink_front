import { io } from "socket.io-client";
import { API } from "./data";

const SOCKET_URL = API;

// On configure l'instance sans la connecter immédiatement
export const socket = io(SOCKET_URL, {
  autoConnect: false, 
  withCredentials: true // Transmet les cookies au serveur WebSocket si nécessaire
});