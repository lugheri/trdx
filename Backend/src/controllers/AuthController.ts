import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import LoginService from "../services/loginService";
import { UserAccessDTO } from './Dtos/usersAccess.dto';
import { StudentAccessDTO } from './Dtos/student.dto';
import studentsService from '../services/studentsService';
import md5 from 'md5';
import sendMail from '../services/sendMail';

class AuthController{
  async live(req: Request,res: Response){  
    res.json(true)
  }
  async checkMailStudent(req: Request,res: Response){
    const mail = req.params.mail
    const studentId = await LoginService.checkMailStudent(mail)
    if(studentId){
      res.json({"success":studentId})
      return
    }
    res.json({"error":'Aluno não encontrado!!'})
  }

  async resetPassLogin(req: Request,res: Response){
    const studentId : number = parseInt(req.params.studentId)
    const mailStudent = req.params.mail
    try{
      const length = 6;
      const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&()_-+=<>?';
      let passwordHash = '';  
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        passwordHash += characters.charAt(randomIndex);
      }
      const newPass = passwordHash
      await studentsService.editStudent(studentId,{password:md5(newPass)})  

      //SendMail
      const from = 'Guilherme Cardoso'
      const fromMail = 'suporte@otraderquemultiplica.com.br'
      const subject = '[RESET de Senha] Seus novos dados de acesso'
      const text = `<p style="font-size:18px;margin-bottom:10px">Seus dados de acesso foram resetados.</p>
                    <p style="font-size:18px;margin-bottom:10px">Aperte no link abaixo e entre com os seus novos dados de acesso:</p>
                    <br/>                         
                      <p style="font-size:18px;margin:0px"><a href="https://app.otraderquemultiplica.com.br">https://app.otraderquemultiplica.com.br</a></p>
                      <p style="font-size:18px;margin:0px"><b>Usuário:</b> ${mailStudent}</p>
                      <p style="font-size:18px;margin:0px"><b>Senha:</b> ${passwordHash}</p>                          
                    <br/>
                    <p style="font-size:18px;margin-bottom:10px">Abração,<br/>
                    Guilherme</p>`;
      
      sendMail.sendMail(from,fromMail,mailStudent,subject,text)    
    }catch(e){console.log(e)} 
    
    res.json({"success":'Senha resetada com sucesso'})
  }

  async login(req: Request,res: Response){   
    const userAccess = UserAccessDTO.safeParse(req.body)
    if(!userAccess.success){
      res.json({"error":userAccess.error})
      return
    }
    try{
      const userdata = await LoginService.checkUser(userAccess.data)
      if(!userdata){
        res.json({"error":'Usuário não encontrado!!'})
        return
      }
      //Authenticate
      const action = 'login';
      const token = await LoginService.userAuthenticate(action,userdata)
      res.json({
        token: token,
        success: true
      })
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }   
  }

  async loginStudent(req: Request,res: Response){
    const studentAccess = StudentAccessDTO.safeParse(req.body)
    if(!studentAccess.success){
      res.json({"error":studentAccess.error})
      return
    }
    try{
      const userdata = await LoginService.checkStudent(studentAccess.data)
      
      if(!userdata){
        res.json({"error":'Aluno não encontrado!!'})
        return
      }
      //Authenticate
      const action = 'login';
      const token = await LoginService.studentAuthenticate(action,userdata)
      res.json({
        token: token,
        success: true
      })
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }   
  }

  async validation(req: Request,res: Response){
    try{
      const authHeader = req.headers.authorization ? req.headers.authorization : null ;
      if(authHeader){
        const payload = jwt.verify(authHeader, process.env.APP_SECRET as string);
        res.json(payload)
        return
      }
      res.json({"error":"token invalid"})
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }
  }

  async resetPass(req: Request,res: Response){
    const userdata = await LoginService.checkStudent({password:req.body.password,username:req.body.username})
    if(!userdata){
      res.json({"error":'Senha de acesso invalida!'})
      return
    }
    try{
      const studentId : number = parseInt(req.params.student_id)     
   
      const edit = await studentsService.editStudent(studentId, {password:md5(req.body.newPass)})
    
      res.json({success: true})
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }   
  }

  async logout(req: Request,res: Response){
    try{
      const authHeader = req.headers.authorization;
      await LoginService.userAuthenticate('logout',undefined,authHeader)
      res.json({success: true})
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }   
  }
}

export default new AuthController();