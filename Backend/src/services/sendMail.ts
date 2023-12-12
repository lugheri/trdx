import nodemailer from 'nodemailer';

class sendMail{
  sendMail = (from:string,mailFrom:string,mailTo:string,subject:string,text:string,copy?:string|null,hiddenCopy?:string|null) => {
    const host = 'smtp.titan.email'
    const port = 465
    const secure = true
    const user = 'suporte@otraderquemultiplica.com.br'
    const pass = 'GhCs@IGC20201387#'

    // Configurações do transporte (SMTP)
    const transporter = nodemailer.createTransport({
      host: host, // Endereço do servidor SMTP
      port: port,
      secure: secure, // Usar SSL
      auth: {
        user: user, // Usuário do servidor SMTP
        pass: pass, // Senha do servidor SMTP
      },
    });
    // Opções do e-mail
    const mailOptions = {                
      from: `${from} <${mailFrom}>`, // Seu e-mail
      to: mailTo, // Endereço do destinatário
      cc: copy ? copy : "", // Cópia
      bcc: hiddenCopy ? hiddenCopy : "", // Cópia Oculta
      subject: subject,
      html: text,
    };    
    // Envia o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar e-mail:', error);
      } else {
        console.info('E-mail enviado com sucesso! ID:', info.messageId);
      }
    });
  }







  

  
    
  

}
export default new sendMail()