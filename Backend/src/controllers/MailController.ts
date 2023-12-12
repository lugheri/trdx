import { Request, Response } from "express"
import { MailAccountDTO, SendMailDTO } from "./Dtos/mail.dto"
import mailAccountService from "../services/mailAccountService"
import nodemailer from 'nodemailer';

class MailController {
  async newAccount(req:Request,res:Response){
    const dataAccount = MailAccountDTO.safeParse(req.body)
    if(!dataAccount.success){
      res.json({"error":dataAccount.error})
      return
    }
    try{
      const newAccount = await mailAccountService.newAccount(dataAccount.data)
      if(newAccount){
        res.json({"success": true,"response": newAccount})  
        return
      }
      res.json({"error":"Falha ao criar o conta de E-mail!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }

  }
  async listAccounts(req:Request,res:Response){
    try{
      const listAccounts = await mailAccountService.listAccounts()
      res.json({"success": true,"response": listAccounts})  
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }    
  }
  async infoAccount(req:Request,res:Response){
    const accountId : number = parseInt(req.params.account_id)
    try{
      const mailAccount = await mailAccountService.infoAccountMail(accountId)
      res.json({"success": true,"response": mailAccount})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async editAccount(req:Request,res:Response){
    const accountId : number = parseInt(req.params.account_id)
    const dataAccount = MailAccountDTO.safeParse(req.body)
    if(!dataAccount.success){
      res.json({"error": dataAccount.error})  
      return
    }
    try{
      const edit = await mailAccountService.editAccount(accountId, dataAccount.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async removeAccount(req:Request,res:Response){
    const accountId : number = parseInt(req.params.account_id)   
    try{
      await mailAccountService.removeMailAccount(accountId)
      res.json({"success": true,"response": true})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async sendMail(req:Request,res:Response){
    const dataSend = SendMailDTO.safeParse(req.body)    
    if(!dataSend.success){
      res.json({"error":dataSend.error})
      return
    }
    const infoAccount = await mailAccountService.infoAccountMail(dataSend.data.accountId)
    if(infoAccount === null){
      res.json({"error":"Conta de E-mail não localizada"})
      return
    }

    // Configurações do transporte (SMTP)
    const transporter = nodemailer.createTransport({
      host: infoAccount.host , // Endereço do servidor SMTP
      port: infoAccount.port,
      secure: infoAccount.secure == 1 ? true : false, // Usar SSL
      auth: {
        user: infoAccount.user, // Usuário do servidor SMTP
        pass: infoAccount.pass, // Senha do servidor SMTP
      },
    });
    // Opções do e-mail
    const mailOptions = {                
      from: `${dataSend.data.from} <${infoAccount.user}>`, // Seu e-mail
      to: dataSend.data.mailTo, // Endereço do destinatário
      cc: dataSend.data.copy ? dataSend.data.copy : "", // Cópia
      bcc: dataSend.data.hiddenCopy ? dataSend.data.hiddenCopy : "", // Cópia Oculta
      subject: dataSend.data.subject,
      html: dataSend.data.body,
    };    
    // Envia o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.json({"success": false,"message":`Erro ao enviar e-mail: ${error}`})
      } else {
        console.info('E-mail enviado com sucesso! ID:', info.messageId);
        res.json({"success": true,"message":`E-mail enviado com sucesso! ID:${info.messageId}`})
      }
    });

  }
}
export default new MailController()