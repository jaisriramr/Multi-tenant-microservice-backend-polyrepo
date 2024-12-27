import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsController } from './notifications/notifications.controller';

@Module({
  controllers: [NotificationsController],
  exports: [NotificationsGateway, NotificationsService],
  providers: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}
