import { io } from "socket.io-client";

const baseUrl = import.meta.env.VITE_API_BASEURL;

export const socket = io(baseUrl, {
  autoConnect: false,
});
