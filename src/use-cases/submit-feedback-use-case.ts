import { MailAdapter } from "../adapters/mail-adapter";
import { FeedbacksRepository } from "../repositories/feedbacks-repository";

interface SubmitFeedbackUseCaseRequest {
    type: string;
    comment: string;
    screenshot?: string;
}

export class SubmitFeedbackUseCase {
constructor(
    private feedbacksRepository: FeedbacksRepository,
    private mailAdapter: MailAdapter,
) {}

    async execute(request: SubmitFeedbackUseCaseRequest) {
        const { type, comment, screenshot } = request;

        if(!type) {
            throw new Error('Type is required');
        }

        if(!comment) {
            throw new Error('Comment is required');
        }

        if(screenshot && !screenshot.startsWith('data:image/png;base64')){
            throw new Error('Invalid screenshot format.');
        }

        await this.feedbacksRepository.create({
            type,
            comment,
            screenshot,
        })

        // O feedback já foi salvo: uma falha no e-mail não deve derrubar a requisição
        try {
            await this.mailAdapter.sendMail({
                subject: 'Novo Feedback',
                body: [
                    '<div style="font-family: sans-serif; font-size: 16px; color: #111;">',
                    `<p>Tipo do feedback: ${escapeHtml(type)}</p>`,
                    `<p>Comentário: ${escapeHtml(comment)}</p>`,
                    screenshot ? `<img src ="${escapeHtml(screenshot)}"/>` : '',
                    '</div>'
                ].join('\n')
            })
        } catch (err) {
            console.error('Failed to send feedback e-mail:', err);
        }
    }
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}