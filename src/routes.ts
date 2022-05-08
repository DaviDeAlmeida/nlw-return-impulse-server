import { prisma } from './prisma';
import express from 'express';
import nodemailer from 'nodemailer'

export const routes = express.Router()

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "39824f7c8b4318",
      pass: "a95b39a7171a1f"
    }
  });

routes.post('/feedbacks', async (req,res) => {
    const {type, comment, screenshot } = req.body;

    const feedback = await prisma.feedback.create({
        data: {
            type: type,
            comment: comment,
            screenshot: screenshot
        }
    })

    await transport.sendMail({
        from: 'Equipe Feedback <oi@feedget.com>',
        to: 'Davi Cardoso <davi.almeida.c@gmail.com>',
        subject: 'Novo Feedback',
        html: [
            '<div style="font-family: sans-serif; font-size: 16px; color: #111;">',
            `<p>Tipo do feedback: ${type}</p>`,
            `<p>Comentário: ${comment}</p>`,
            '</div>'
        ].join('\n')
    });

    return res.status(201).json({data: feedback });
})