import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class MailTriggerervice {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({
      region: 'us-east-1', // Replace with your region
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async sendEmail(
    to: string,
    from: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const params = {
      RawMessage: {
        Data: Buffer.from(
          `From: ${from}
  To: ${to}
  Subject: ${subject}
  Content-Type: text/html; charset=UTF-8
  
  ${body}`,
        ),
      },
    };

    const command = new SendRawEmailCommand(params);

    try {
      const response = await this.sesClient.send(command);
      console.log('Email sent successfully:', response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
