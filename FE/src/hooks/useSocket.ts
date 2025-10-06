'use client';

import { useEffect, useState } from "react";
import { socket } from "../socketClient";


export function useSocket() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {

        if (socket.connected) {
            onConnect();
        }
        
        function onConnect() {
            setIsConnected(true)
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    },[])

    return { socket, isConnected };
}