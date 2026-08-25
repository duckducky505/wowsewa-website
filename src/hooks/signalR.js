import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalR = () => {
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:5173/apphub") 
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => console.log('Connected to SignalR'))
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    return connection;
};