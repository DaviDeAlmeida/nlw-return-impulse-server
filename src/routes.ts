import { prisma } from './prisma';
import express from 'express';
import nodemailer from 'nodemailer'
import { PrismaFeedbacksRepository } from './repositories/prisma/prisma-feedbacks-repository';
import { SubmitFeedbackUseCase } from './use-cases/submit-feedback-use-case';

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

    const prismaFeedbacksRepository = new PrismaFeedbacksRepository()
    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
        prismaFeedbacksRepository
    )

    await submitFeedbackUseCase.execute({
        type,
        comment,
        screenshot,
    })

    // await transport.sendMail({
    //     from: 'Equipe Feedback <oi@feedget.com>',
    //     to: 'Davi Cardoso <davi.almeida.c@gmail.com>',
    //     subject: 'Novo Feedback',
    //     html: [
    //         '<div style="font-family: sans-serif; font-size: 16px; color: #111;">',
    //         `<p>Tipo do feedback: ${type}</p>`,
    //         `<p>Comentário: ${comment}</p>`,
    //         '</div>'
    //     ].join('\n')
    // });

    return res.status(201).send();
})