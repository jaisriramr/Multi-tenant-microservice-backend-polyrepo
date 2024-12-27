import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RedisPubSubService } from './config/redis-pubsub.service';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService, RedisPubSubService],
  exports: [NotificationService, RedisPubSubService],
})
export class NotificationModule {}
