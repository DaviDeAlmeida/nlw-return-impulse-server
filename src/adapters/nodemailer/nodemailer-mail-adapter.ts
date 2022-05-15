import { MailAdapter, SendMailData } from "../mail-adapter";
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "39824f7c8b4318",
      pass: "a95b39a7171a1f"
    }
});

export class NodemailerMailAdapter implements MailAdapter {
    async sendMail ({subject, body}: SendMailData) {
        await transport.sendMail({
            from: 'Equipe Feedback <oi@feedget.com>',
            to: 'Davi Cardoso <davi.almeida.c@gmail.com>',
            subject,
            html: body,
        });
    }
}