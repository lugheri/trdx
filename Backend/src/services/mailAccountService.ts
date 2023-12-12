import { MailAccountType } from "../controllers/Dtos/mail.dto";
import { MailAccounts, MailAccountsInstance } from "../models/MailAccounts";

class mailAccountService{
  async newAccount(dataAccount:MailAccountType):Promise<boolean|MailAccountsInstance>{
    const [ newAccount, created ] = await MailAccounts.findOrCreate({
      where:{user:dataAccount.user},
      defaults:dataAccount
    });
    console.info(created)
    return newAccount.id ? newAccount : false
  }

  async listAccounts():Promise<MailAccountsInstance[]>{
    const listAccounts = await MailAccounts.findAll({
      where: {status:1}
    })
    return listAccounts
  } 

  async infoAccountMail(accountId:number):Promise<null | MailAccountsInstance>{
    const account = await MailAccounts.findByPk(accountId)
    return account ? account : null
  }  

  async editAccount(accountId:number,dataAccount:MailAccountType):Promise<boolean>{   
    await MailAccounts.update(dataAccount,{where:{id:accountId}})  
    return true;
  }

  async removeMailAccount(accountId:number):Promise<boolean>{
    await MailAccounts.destroy({where:{id:accountId}})
    return true
  }
}
export default new mailAccountService()