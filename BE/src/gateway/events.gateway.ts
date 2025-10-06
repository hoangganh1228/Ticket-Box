// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { JwtService } from '@nestjs/jwt';
// import { Logger } from '@nestjs/common';
//
// @WebSocketGateway({ cors: { origin: '*' } })
// export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;
//   private readonly logger = new Logger(EventsGateway.name);
//
//   constructor(private readonly jwtService: JwtService) {}
//
//   handleConnection(client: Socket) {
//     const token = client.handshake.auth?.token;
//
//     try {
//       const payload = this.jwtService.verify(token);
//       const userId = payload.sub;
//
//       client.join(userId); // Join room theo userId
//       this.logger.log(`User ${userId} connected via socket`);
//     } catch (error) {
//       this.logger.warn('Socket connection rejected');
//       client.disconnect();
//     }
//   }
//
//   handleDisconnect(client: Socket) {
//     this.logger.log(`Client disconnected: ${client.id}`);
//   }
//
//   emitToUser(userId: string, payload: any) {
//     this.server.to(userId).emit('job_complete', payload);
//   }
// }
