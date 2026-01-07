import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Create socket connection
        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socketInstance.on('connect', () => {
            console.log('🔌 Socket connected:', socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('🔌 Socket connection error:', error);
            setIsConnected(false);
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    // Helper functions
    const joinOrderRoom = (orderId) => {
        if (socket) {
            socket.emit('join-order', orderId);
        }
    };

    const leaveOrderRoom = (orderId) => {
        if (socket) {
            socket.emit('leave-order', orderId);
        }
    };

    const joinOrdersList = () => {
        if (socket) {
            socket.emit('join-orders-list');
        }
    };

    const value = {
        socket,
        isConnected,
        joinOrderRoom,
        leaveOrderRoom,
        joinOrdersList
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
