import { PaginationUserType, UserDataType,UserDataPartialType } from "../controllers/Dtos/usersAccess.dto";
import { User, UserInstance } from "../models/Users";


class userService{
  async createNewUser(userData:UserDataType):Promise<boolean | UserInstance >{
    const [newUser,created] = await User.findOrCreate({
      where: { name: userData.name},
      defaults:userData
    });
    console.log('created',created);
    return newUser.id ? newUser : false;
  }

  async editUser(userId:number,userData:UserDataPartialType):Promise<boolean>{   
    await User.update(userData,{where:{id:userId}})   
    return true;
  }

  async removeUser(userId:number):Promise<boolean>{
    await User.destroy({where:{id:userId}})
    return true;
  }

  async getUser(userId:number):Promise<boolean | UserInstance >{
    const user = await User.findByPk(userId)
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



