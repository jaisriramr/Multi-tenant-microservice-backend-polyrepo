import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RedisPubSubService } from './redis-pubsub.service';

@WebSocketGateway({ cors: true })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly redisPubSub: RedisPubSubService) {}

  handleConnection(client: any) {
    console.log('Client Connected: ', client.id);

    this.redisPubSub.subscribe('notifications', (message) => {
      client.emit('notification', message);
    });
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected: ', client.id);
  }
}
