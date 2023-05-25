import md5 from 'md5';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config()

import { Logins } from "../models/Logins";
import { User,UserInstance } from "../models/Users";
import { UserAccessType } from '../controllers/Dtos/usersAccess.dto';

class LoginService {
  async checkUser(accessUser: UserAccessType){
    const userdata = await User.findOne({
      attributes: ['id','name','password'],
      where: {mail: accessUser.username, status:1}
    })
    if(!userdata){
      return false
    }
    if(userdata.password!=md5(accessUser.password)){
      return false
    }
    return userdata
  }

  async userAuthenticate(action:string,userdata?:UserInstance,authHeader?:string){
    if(action=='login'){
      if(userdata){
        const typeAccess : 'Adm' | 'Student' = 'Adm'
        const token = jwt.sign({userId:userdata.id,userName:userdata.mail,typeAccess:typeAccess},process.env.APP_SECRET as string,{expiresIn:'12h'})
        //Check last action login user
        const lastAction = await Logins.findOne({attributes: ['action'],
                                                where: {id:userdata.id},
                                                order:[['id','DESC']],
                                                limit:1})
        if(lastAction){
            if (lastAction.action == "login") { //Register last Logout
              await Logins.create({ date: new Date().toISOString().split('T')[0], 
                                    hour: new Date().toLocaleTimeString('en-US', { hour12: false }), 
                                    user_id: userdata.id, 
                                    action:"logout"});
            }
        }
        userdata.logged = 1
        await userdata.save()
        //Register Login
        await Logins.create({date: new Date().toISOString().split('T')[0], 
                            hour: new Date().toLocaleTimeString('en-US', { hour12: false }), 
                            user_id: userdata.id, 
                            action:action});
        return token
      }
      return null
    }else{
      if(!authHeader){
        console.log("No auth header")
        return false
      }
      interface TokenPayload {
        userId: string;
      }
      const { userId } = jwt.verify(authHeader, process.env.APP_SECRET as string) as TokenPayload;
      if(!userId){
        console.log("User Id is not founded")
        return false
      }
      const userdata = await User.findByPk(userId)
      if(userdata){
        console.log("User has been logged out successfully")
        userdata.logged = 0
        await userdata.save()
        await Logins.create({date: new Date().toISOString().split('T')[0],
                             hour: new Date().toLocaleTimeString('en-US', { hour12: false }),
                             user_id: userdata.id,
                             action:action});
        return null
      }
      console.log("User Id is not valid")
      return null
    }

  }
}
export default new LoginService();