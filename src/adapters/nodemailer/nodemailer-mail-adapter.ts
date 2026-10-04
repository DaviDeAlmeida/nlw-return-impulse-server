import { MailAdapter, SendMailData } from "../mail-adapter";
import nodemailer from 'nodemailer';

const isMailConfigured = Boolean(process.env.MAIL_HOST && process.env.MAIL_TO);

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
        if (!isMailConfigured) {
            console.warn('SMTP not configured (MAIL_HOST/MAIL_TO), skipping e-mail.');
            return;
        }

        await transport.sendMail({
            from: process.env.MAIL_FROM ?? 'Equipe Feedget <oi@feedget.com>',
            to: process.env.MAIL_TO,
            subject,
            html: body,
        });
    }
}
