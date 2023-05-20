import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import LoginService from "../services/loginService";

class AuthController{
  live(req: Request,res: Response){
    console.log('Server online')
    res.json(true)
  }
  async login(req: Request,res: Response){
    interface  RequestBody { username : string, password : string}
    const {username,password}:RequestBody = req.body
    try{
      const userdata = await LoginService.checkUser(username,password)
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