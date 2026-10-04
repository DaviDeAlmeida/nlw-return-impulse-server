import { MailAdapter, SendMailData } from "../mail-adapter";
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 2525,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
});

export class NodemailerMailAdapter implements MailAdapter {
    async sendMail ({subject, body}: SendMailData) {
        await transport.sendMail({
            from: process.env.MAIL_FROM ?? 'Equipe Feedget <oi@feedget.com>',
            to: process.env.MAIL_TO,
            subject,
            html: body,
        });
    }
}
