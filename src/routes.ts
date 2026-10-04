import express from 'express';
import { PrismaFeedbacksRepository } from './repositories/prisma/prisma-feedbacks-repository';
import { SubmitFeedbackUseCase } from './use-cases/submit-feedback-use-case';
import { NodemailerMailAdapter } from './adapters/nodemailer/nodemailer-mail-adapter';

export const routes = express.Router()

routes.get('/health', (req, res) => {
    return res.json({ status: 'ok' });
})

routes.post('/feedbacks', async (req,res) => {
    const {type, comment, screenshot } = req.body;

    const prismaFeedbacksRepository = new PrismaFeedbacksRepository()
    const nodemailerMailAdapter = new NodemailerMailAdapter()
    
    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
        prismaFeedbacksRepository,
        nodemailerMailAdapter,
    )

    try {
        await submitFeedbackUseCase.execute({
            type,
            comment,
            screenshot,
        })
    } catch (err) {
        return res.status(400).json({ error: (err as Error).message });
    }

    return res.status(201).send();
})
