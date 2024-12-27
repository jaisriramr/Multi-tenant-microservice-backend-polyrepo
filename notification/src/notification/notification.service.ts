import { Injectable } from '@nestjs/common';
import { RedisPubSubService } from './config/redis-pubsub.service';

@Injectable()
export class NotificationService {
  constructor(private readonly redisPubSub: RedisPubSubService) {}

  async sendNotification(userId: string, message: string) {
    console.log('UUU ', userId, message);
    const payload = JSON.stringify({ userId, message });
    this.redisPubSub.publish('notifications', payload); // Publish to Redis
    return 'done';
  }
}
