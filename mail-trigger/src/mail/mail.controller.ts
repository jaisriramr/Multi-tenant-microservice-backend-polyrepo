import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { MailTriggerervice } from './mail.service';

@Controller('email')
export class MailController {
  constructor(private readonly mailerService: MailTriggerervice) {}

  @Post('send-welcome')
  async sendWelcomeEmail(
    @Body('to') to: string,
    @Body('from') from: string,
    @Body('subject') subject: string,
    @Body('body') body: string,
  ) {
    try {
      await this.mailerService.sendEmail(to, from, subject, body);
      return { message: 'Email sent successfully!' };
    } catch (err) {
      console.log('EE ', err);
      throw new HttpException('Internal Server Err ', 500);
    }
  }
}
