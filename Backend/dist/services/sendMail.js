"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class sendMail {
    constructor() {
        this.sendMail = (from, mailFrom, mailTo, subject, text, copy, hiddenCopy) => {
            const host = 'smtp.titan.email';
            const port = 465;
            const secure = true;
            const user = 'suporte@otraderquemultiplica.com.br';
            const pass = 'GhCs@IGC20201387#';
            // Configurações do transporte (SMTP)
            const transporter = nodemailer_1.default.createTransport({
                host: host,
                port: port,
                secure: secure,
                auth: {
                    user: user,
                    pass: pass, // Senha do servidor SMTP
                },
            });
            // Opções do e-mail
            const mailOptions = {
                from: `${from} <${mailFrom}>`,
                to: mailTo,
                cc: copy ? copy : "",
                bcc: hiddenCopy ? hiddenCopy : "",
                subject: subject,
                html: text,
            };
            // Envia o e-mail
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erro ao enviar e-mail:', error);
                }
                else {
                    console.info('E-mail enviado com sucesso! ID:', info.messageId);
                }
            });
        };
    }
}
exports.default = new sendMail();
