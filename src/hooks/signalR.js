import { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalR = () => {
    const [connection, setConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const connectionRef = useRef(null);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7011/hub/notification", {
                accessTokenFactory: () => localStorage.getItem("Token"),
            })
            .withAutomaticReconnect()
            .build();

        newConnection.onreconnecting(() => setIsConnected(false));
        newConnection.onreconnected(() => setIsConnected(true));
        newConnection.onclose(() => setIsConnected(false));

        connectionRef.current = newConnection;
        setConnection(newConnection);

        newConnection.start()
            .then(() => setIsConnected(true))
            .catch(e => console.error('SignalR connection failed:', e));

        return () => {
            newConnection.stop();
        };
    }, []);

    return { connection, isConnected };
};