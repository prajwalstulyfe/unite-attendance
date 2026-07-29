'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { WsEvent } from '@repo/types';
import type { WsAttendanceEvent, WsStatsUpdateEvent, WsNotificationEvent } from '@repo/types';
import { connectSocket, disconnectSocket, getSocket } from '../lib/socket';
import { attendanceKeys } from './use-attendance';

/**
 * Connect to WebSocket and subscribe to real-time attendance events.
 * Automatically updates React Query cache when events are received.
 */
export function useRealtimeAttendance(orgId: string, options?: {
  onCheckIn?: (event: WsAttendanceEvent) => void;
  onCheckOut?: (event: WsAttendanceEvent) => void;
  onStatsUpdate?: (event: WsStatsUpdateEvent) => void;
  onNotification?: (event: WsNotificationEvent) => void;
  enabled?: boolean;
}) {
  const queryClient = useQueryClient();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!orgId || options?.enabled === false) return;

    const socket = connectSocket(orgId);

    // Attendance check-in
    socket.on(WsEvent.ATTENDANCE_CHECKIN, (event: WsAttendanceEvent) => {
      optionsRef.current?.onCheckIn?.(event);
      // Invalidate today's stats to reflect new check-in
      queryClient.invalidateQueries({ queryKey: attendanceKeys.today(orgId) });
    });

    // Attendance check-out
    socket.on(WsEvent.ATTENDANCE_CHECKOUT, (event: WsAttendanceEvent) => {
      optionsRef.current?.onCheckOut?.(event);
      queryClient.invalidateQueries({ queryKey: attendanceKeys.today(orgId) });
    });

    // Stats update (aggregated)
    socket.on(WsEvent.ATTENDANCE_STATS_UPDATE, (event: WsStatsUpdateEvent) => {
      optionsRef.current?.onStatsUpdate?.(event);
      // Directly update the cache for instant UI updates
      queryClient.setQueryData(attendanceKeys.today(orgId), event);
    });

    // Notifications
    socket.on(WsEvent.NOTIFICATION, (event: WsNotificationEvent) => {
      optionsRef.current?.onNotification?.(event);
    });

    return () => {
      disconnectSocket();
    };
  }, [orgId, options?.enabled, queryClient]);

  const emit = useCallback((event: string, data: unknown) => {
    getSocket()?.emit(event, data);
  }, []);

  return { emit, isConnected: !!getSocket()?.connected };
}
