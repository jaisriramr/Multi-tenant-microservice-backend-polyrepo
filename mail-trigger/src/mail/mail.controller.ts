import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { MailTriggerervice } from './mail.service';

@Controller('email')
export class MailController {
  constructor(private readonly mailerService: MailTriggerervice) {}

  @Post('send')
  async sendMail(
    @Body() body: { email: string; subject: string; message: string },
  ) {
    try {
      return await this.mailerService.sendMail(body.email);
    } catch (err) {
      throw new HttpException(err?.response, err?.status);
    }
  }
}
