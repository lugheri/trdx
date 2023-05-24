import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from "zod";
import LoginService from "../services/loginService";
import { UserAccessDTO } from './Dtos/usersAccess.dto';

class AuthController{
  live(req: Request,res: Response){
    console.log('Server online')
    res.json(true)
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
      console.log(err)
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
    }catch(error){
      console.log(error)
      res.json({"error":error})
    }
  }

  async logout(req: Request,res: Response){
    try{
      const authHeader = req.headers.authorization;
      await LoginService.userAuthenticate('logout',undefined,authHeader)
      res.json({success: true})
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }   
  }
}

export default new AuthController();