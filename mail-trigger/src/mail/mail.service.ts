import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailTriggerervice {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_APIKEY);
  }

  async sendMail(to: string) {
    const msg = {
      to: to,
      from: process.env.SENDGRID_FROM, // Use the email address or domain you verified above
      subject: 'Sending with Twilio SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    console.log(msg);
    const response = sgMail
      .send(msg)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });

    return response;
  }
}
