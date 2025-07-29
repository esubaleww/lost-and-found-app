// socket.js
import { io } from "socket.io-client";
const socket = io("https://server-production-82bb.up.railway.app", {
  autoConnect: false,
});
export default socket;
