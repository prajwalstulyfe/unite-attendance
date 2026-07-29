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

function getWsUrl(): string {
  if (typeof window !== 'undefined') {
    const windowWsUrl = (window as unknown as Record<string, string>).__NEXT_PUBLIC_WS_URL;
    if (windowWsUrl) return windowWsUrl;

    const hostname = window.location.hostname;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    const envWsUrl = process.env['NEXT_PUBLIC_WS_URL'];

    if (isLocalHost) {
      return envWsUrl || 'ws://localhost:3001';
    }

    if (!envWsUrl || envWsUrl.includes('localhost') || envWsUrl.includes('127.0.0.1')) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//api.unite-attendance.com/ws`;
    }

    return envWsUrl;
  }

  return process.env['NEXT_PUBLIC_WS_URL'] || 'ws://localhost:3001';
}

/**
 * Connect to the WebSocket server
 * @param orgId - The organization ID to join the org room
 */
export function connectSocket(orgId: string): Socket {
  const wsUrl = getWsUrl();

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
