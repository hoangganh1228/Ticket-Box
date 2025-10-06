import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  namespace: '/realtime',
})

export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server; // get object server to send message to client

  handleConnection(socket: Socket) {
    // Client nên gọi: socket.emit('auth', { userId })
  }

  // when server receive message from client -> server'll throw this socket to private room of user
  @SubscribeMessage('auth')
  onAuth(@MessageBody() data: { userId: number }, @ConnectedSocket() socket: Socket) {
    if (!data?.userId) return;
    socket.join(`user:${data.userId}`);
  }

  // this function is called by service to send message to client
  notifyOrderPaid(userId: number, payload: { orderNumber: string; bookingId: string }) {
    this.server.to(`user:${userId}`).emit('order.paid', payload);
  }

  notifyBookingConfirmed(userId: number, payload: { bookingId: string; orderId: number }) {
    this.server.to(`user:${userId}`).emit('booking.confirmed', payload);
  }
}