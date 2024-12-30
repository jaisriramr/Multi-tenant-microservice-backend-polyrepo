import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SESClient } from '@aws-sdk/client-ses';
import { join } from 'path';
import { MailController } from './mail.controller';
import { MailTriggerervice } from './mail.service';
console.log(join(__dirname, 'templates'));
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          SES: new SESClient({
            region: 'us-east-1', // Replace with your AWS region
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          }),
        },
        defaults: {
          from: '"No Reply" <no-reply@yourdomain.com>',
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailTriggerervice],
  exports: [MailTriggerervice],
})
export class MailTriggerModule {}
