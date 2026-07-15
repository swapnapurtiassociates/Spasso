import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "@workspace/replit-auth-web";

/**
 * Connects to the Socket.io server using the same session cookie as the REST API.
 * Reconnects automatically and exposes the live socket instance.
 */
export function useSocket(enabled: boolean = true): Socket | null {
  const socketRef = useRef<Socket | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const socket = io(API_BASE_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;
    setTick((t) => t + 1);

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled]);

  return socketRef.current;
}
