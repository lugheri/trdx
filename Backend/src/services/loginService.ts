import md5 from 'md5';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config()

import { Logins } from "../models/Logins";
import { User,UserInstance } from "../models/Users";
import { UserAccessType } from '../controllers/Dtos/usersAccess.dto';
import { Students,StudentsInstance } from "../models/Students";
import { StudentAccessType } from '../controllers/Dtos/student.dto';
import { StudentsLogins } from '../models/StudentsLogins';

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

  async checkStudent(accessStudent: StudentAccessType){
    const userdata = await Students.findOne({
      attributes: ['id','name','password'],
      where: {mail: accessStudent.username, status:1}
    })    
    if(!userdata){
      return false
    }  
    if(userdata.password!=md5(accessStudent.password)){
      return false
    }
    return userdata
  }

  async checkMailStudent(mail:string){
    const userdata = await Students.findOne({
      attributes: ['id'],
      where: {mail: mail, status:1}
    })    
    if(!userdata){
      return null
    } 
    return userdata.id
  }

  

  async userAuthenticate(action:string,userdata?:UserInstance,authHeader?:string){
    if(action=='login'){
      if(userdata){
        const typeAccess : 'Adm' | 'Student' = 'Adm'
        const token = jwt.sign({userId:userdata.id,userName:userdata.mail,typeAccess:typeAccess},process.env.APP_SECRET as string)
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
        console.info("No auth header")
        return false
      }
      interface TokenPayload {
        userId: string;
      }
      const { userId } = jwt.verify(authHeader, process.env.APP_SECRET as string) as TokenPayload;
      if(!userId){
        console.info("User Id is not founded")
        return false
      }
      const userdata = await User.findByPk(userId)
      if(userdata){
        console.info("User has been logged out successfully")
        userdata.logged = 0
        await userdata.save()
        await Logins.create({date: new Date().toISOString().split('T')[0],
                             hour: new Date().toLocaleTimeString('en-US', { hour12: false }),
                             user_id: userdata.id,
                             action:action});
        return null
      }
      console.info("User Id is not valid")
      return null
    }

  }

  async studentAuthenticate(action:string,userdata?:StudentsInstance,authHeader?:string){
    if(action=='login'){
      if(userdata){
        const typeAccess = 'Student'
        const token = jwt.sign({userId:userdata.id,userName:userdata.mail,typeAccess:typeAccess},process.env.APP_SECRET as string)
        //Check last action login user
        const lastAction = await StudentsLogins.findOne({attributes: ['action'],
                                                where: {id:userdata.id},
                                                order:[['id','DESC']],
                                                limit:1})
        if(lastAction){
            if (lastAction.action == "login") { //Register last Logout
              await StudentsLogins.create({ date: new Date().toISOString().split('T')[0], 
                                    hour: new Date().toLocaleTimeString('en-US', { hour12: false }), 
                                    student_id: userdata.id, 
                                    action:"logout"});
            }
        }
        userdata.logged = 1
        await userdata.save()
        //Register Login
        await StudentsLogins.create({date: new Date().toISOString().split('T')[0], 
                             hour: new Date().toLocaleTimeString('en-US', { hour12: false }), 
                             student_id: userdata.id, 
                           action:action});
        return token
      }
      return null
    }else{
      if(!authHeader){
        console.info("No auth header")
        return false
      }
      interface TokenPayload {
        userId: string;
      }
      const { userId } = jwt.verify(authHeader, process.env.APP_SECRET as string) as TokenPayload;
      if(!userId){
        console.info("User Id is not founded")
        return false
      }
      const userdata = await Students.findByPk(userId)
      if(userdata){
        console.info("User has been logged out successfully")
        userdata.logged = 0
        await userdata.save()
        await StudentsLogins.create({date: new Date().toISOString().split('T')[0],
                             hour: new Date().toLocaleTimeString('en-US', { hour12: false }),
                             student_id: userdata.id,
                             action:action});
        return null
      }
      console.info("User Id is not valid")
      return null
    }
  }
}
export default new LoginService();