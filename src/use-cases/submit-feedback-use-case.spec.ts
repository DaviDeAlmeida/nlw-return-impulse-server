import { SubmitFeedbackUseCase } from "./submit-feedback-use-case";

const createFeedbackSpy = jest.fn();
const sendMailSpy = jest.fn();

const submitFeedback = new SubmitFeedbackUseCase(
    { create: createFeedbackSpy },
    { sendMail: sendMailSpy }
)

describe('Submit feedback', () => {
    it('should be able to submit a feedback', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'example comment',
            screenshot: 'data:image/png;base64,889s7d897s8d7as'
        })).resolves.not.toThrow();

        expect(createFeedbackSpy).toHaveBeenCalled();
        expect(sendMailSpy).toHaveBeenCalled();
    });

    it('should not be able to submit feedback without type', async () => {
        await expect(submitFeedback.execute({
            type: '',
            comment: 'example comment',
            screenshot: 'data:image/png;base64,889s7d897s8d7as'
        })).rejects.toThrow();

    });

    it('should not be able to submit feedback without comment', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: '',
            screenshot: 'data:image/png;base64,889s7d897s8d7as'
        })).rejects.toThrow();

    });

    it('should not be able to submit feedback with an invalid screenshot', async () => {
        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'example comment',
            screenshot: 'test.jpg'
        })).rejects.toThrow();

    });

    it('should still submit the feedback when sending the e-mail fails', async () => {
        sendMailSpy.mockRejectedValueOnce(new Error('SMTP down'));
        jest.spyOn(console, 'error').mockImplementationOnce(() => {});

        await expect(submitFeedback.execute({
            type: 'BUG',
            comment: 'example comment',
        })).resolves.not.toThrow();

        expect(createFeedbackSpy).toHaveBeenCalled();
    });

    it('should escape HTML from the comment in the e-mail body', async () => {
        await submitFeedback.execute({
            type: 'BUG',
            comment: '<script>alert(1)</script>',
        });

        const { body } = sendMailSpy.mock.calls[0][0];

        expect(body).not.toContain('<script>');
        expect(body).toContain('&lt;script&gt;');
    });
});