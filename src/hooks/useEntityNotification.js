// hooks/useEntityNotifications.js
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSignalR } from './signalR';

const TOAST_TYPE_BY_ACTION = {
  Added: 'success',
  Updated: 'success',
  Deleted: 'error',
  Cancelled: 'error',
};

export function useEntityNotifications() {
  const { connection, isConnected } = useSignalR() || {};

  useEffect(() => {
    if (!connection || !isConnected) return;

    const handle = (payload) => {
      const { entityType, action, message } = payload;
      const toastType = TOAST_TYPE_BY_ACTION[action] ?? 'info'; // fallback for unmapped actions

      toast[toastType](message ?? `${entityType} ${action.toLowerCase()}`, {
        toastId: `${entityType}-${action}-${Date.now()}`,
      });
    };

    connection.on('EntityUpdated', handle);
    return () => connection.off('EntityUpdated', handle);
  }, [connection, isConnected]);
}