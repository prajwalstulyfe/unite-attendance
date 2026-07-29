import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env['CORS_ORIGINS']
      ? process.env['CORS_ORIGINS'].split(',').map((o) => o.trim())
      : true,
    credentials: true,
  },
  namespace: '/ws',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger = new Logger('RealtimeGateway');

  handleConnection(client: Socket) {
    const orgId = client.handshake.auth?.['orgId'];
    if (orgId) {
      client.join(`org:${orgId}`);
      this.logger.log(`Client ${client.id} joined room org:${orgId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  emitAttendanceCheckin(orgId: string, data: unknown) {
    this.server.to(`org:${orgId}`).emit('attendance:checkin', data);
  }

  emitStatsUpdate(orgId: string, data: unknown) {
    this.server.to(`org:${orgId}`).emit('attendance:stats', data);
  }
}
