import { Request, Response } from 'express';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config()

import { User } from '../models/Users';
import { Logins } from '../models/Logins';


class AuthController{
  live(req: Request,res: Response){
    console.log('Server online')
    res.json(true)
  }
  async login(req: Request,res: Response){
    interface  RequestBody { username : string, password : string}
    const {username,password}:RequestBody = req.body

    try{
      const userdata = await User.findAll({
        attributes: ['id','name','password'],
        where: {mail: username, status:1}
      })
      //Checking User
      console.log("userdata LENGHT",userdata.length)
      if(userdata.length==0){
        res.json({"error":'Usuário não encontrado!!'})
        return
      }
      //Checking Password
      if(userdata[0].password!=md5(password)){
        res.json({"error":'Usuário não encontrado!'})
        return
      }

      //Autenticate
      const action = 'login';
      const token = jwt.sign({userId:userdata[0].id,userName:userdata[0].name},process.env.APP_SECRET as string,{expiresIn:'12h'})
      //Check last action login user
      const lastAction = await Logins.findAll({
        attributes: ['action'],
        where: {id:userdata[0].id},
        order:[['id','DESC']],
        limit:1
      })
    
      if(lastAction.length>0){
        if (lastAction[0].action == "login") {
          await Logins.create({ 
            date: new Date().toISOString().split('T')[0], 
            hour: new Date().toLocaleTimeString('en-US', { hour12: false }), 
            user_id: userdata[0].id, 
            action:"logout"
          });
        }
      }
      await User.update(
        { logged: 1 }, 
        { where: { id: userdata[0].id}}
      );

      await Logins.create({ 
        date: new Date().toISOString().split('T')[0], 
        hour: new Date().toLocaleTimeString('en-US', { hour12: false }), 
        user_id: userdata[0].id, 
        action:action
      });

      //Register 

      res.json({
        token: token,
        success: true
      })
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }   
  }
}

export default new AuthController();