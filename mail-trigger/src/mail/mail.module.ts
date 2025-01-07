import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailTriggerervice } from './mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // MailerModule.forRootAsync({
    //   useFactory: () => ({
    //     transport: {
    //       SES: new SESClient({
    //         region: 'us-east-1', // Replace with your AWS region
    //         credentials: {
    //           accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //           secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //         },
    //       }),
    //     },
    //     defaults: {
    //       from: '"No Reply" <no-reply@yourdomain.com>',
    //     },
    //   }),
    // }),
    ConfigModule.forRoot(),
  ],
  controllers: [MailController],
  providers: [MailTriggerervice],
  exports: [MailTriggerervice],
})
export class MailTriggerModule {}
