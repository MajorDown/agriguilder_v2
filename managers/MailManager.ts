import nodemailer, { Transporter } from 'nodemailer';

export type MailPayload = {
    to: string;
    subject: string;
    html: string;
    text?: string;
};

export type MailManagerConfig = {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
};

const SMTP_HOST = process.env.SMTP_HOST!;
const SMTP_PORT = Number(process.env.SMTP_PORT)!;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD!;
const SMTP_FROM = process.env.SMTP_FROM!;

class MailManager {
    private static transporter: Transporter | null = null;
    private static from = SMTP_FROM as string;

    private static getTransporter(): Transporter {
        if (!this.transporter) {
            this.transporter = nodemailer.createTransport({
                host: SMTP_HOST,
                port: SMTP_PORT,
                secure: SMTP_SECURE,
                auth: {
                    user: SMTP_USER,
                    pass: SMTP_PASSWORD,
                },
            });
        }

        return this.transporter;
    }

    /**
     * @description envoi un email
     * @param {MailPayload} payload
     * @return {Promise<void>}
     */
    static async send(payload: MailPayload): Promise<void> {
        const transporter = this.getTransporter();
        try {
            const info = await transporter.sendMail({
                from: this.from,
                to: payload.to,
                subject: payload.subject,
                html: payload.html,
                text: payload.text,
            });
            console.log('MAIL SENT', {
                accepted: info.accepted,
                rejected: info.rejected,
                response: info.response,
            });
        } catch (error) {
            console.error('MAIL ERROR', {
                to: payload.to,
                subject: payload.subject,
                error
            });
            throw error;
        }
    }
}

export default MailManager;
