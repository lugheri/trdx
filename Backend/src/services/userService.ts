import { PaginationUserType, UserDataType,UserDataPartialType } from "../controllers/Dtos/usersAccess.dto";
import { User, UserInstance } from "../models/Users";
import {redisSet,redisGet,redisDel} from '../config/redis';

class userService{
  async createNewUser(userData:UserDataType):Promise<boolean | UserInstance >{
    const [newUser,created] = await User.findOrCreate({
      where: { name: userData.name},
      defaults:userData
    });
    await redisDel('Users:[all]')   
    console.info('created',created);
    return newUser.id ? newUser : false;
  }

  async editUser(userId:number,userData:UserDataPartialType):Promise<boolean>{   
    await User.update(userData,{where:{id:userId}})   
    await redisDel(`UserData:[${userId}]`) 
    return true;
  }

  async removeUser(userId:number):Promise<boolean>{
    await User.destroy({where:{id:userId}})
    await redisDel(`UserData:[${userId}]`) 
    return true;
  }

  async getUser(userId:number):Promise<boolean | UserInstance >{
    const infoUser = await redisGet(`UserData:[${userId}]`)
     if(infoUser!==null){
      return infoUser
    }
    const user = await User.findByPk(userId)
    await redisSet(`UserData:[${userId}]`,user,30)
    return user ? user : false
  }

  async listUsers(pagination:PaginationUserType):Promise<UserInstance[]>{
    const p = pagination.page-1
    const qtdRegPage = 30
    const offset = qtdRegPage * p 

    const listUsers = await User.findAll({
      where: {status: pagination.status},
      order:[[pagination.orderedBy,pagination.order]],
      offset:offset,
      limit:qtdRegPage
    })

    return listUsers
  }
}

export default new userService()



