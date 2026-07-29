// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Socket.IO Client
// Manages WebSocket connection for real-time features
// ═══════════════════════════════════════════════════════════════

import { io, type Socket } from 'socket.io-client';
import type { WsAuthPayload } from '@repo/types';
import { tokenStorage } from './token-storage';

let socket: Socket | null = null;

/**
 * Get or create the Socket.IO connection
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Connect to the WebSocket server
 * @param orgId - The organization ID to join the org room
 */
export function connectSocket(orgId: string): Socket {
  const wsUrl = typeof window !== 'undefined'
    ? process.env['NEXT_PUBLIC_WS_URL'] ?? 'ws://localhost:3001'
    : 'ws://localhost:3001';

  // Disconnect existing connection
  if (socket?.connected) {
    socket.disconnect();
  }

  const auth: WsAuthPayload = {
    token: tokenStorage.getAccessToken() ?? '',
    orgId,
  };

  socket = io(wsUrl, {
    path: '/ws',
    auth,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30000,
    timeout: 20000,
  });

  socket.on('connect', () => {
    console.log('[WS] Connected to server');
  });

  socket.on('disconnect', (reason) => {
    console.log('[WS] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[WS] Connection error:', error.message);
  });

  return socket;
}

/**
 * Disconnect from the WebSocket server
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Check if socket is connected
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}
