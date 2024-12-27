import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(@Body() data: any) {
    try {
      return await this.notificationService.sendNotification(
        data?.userId,
        JSON.stringify(data?.message),
      );
    } catch (err) {
      console.log(err);
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }
}
