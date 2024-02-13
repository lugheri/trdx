import { EmailCopyType } from "../controllers/Dtos/integration.dto"
import { EmailCopy, EmailCopyInstance } from "../models/EmailCopys"

class EmailCopyService{

  async newCopy(dataCopy:EmailCopyType):Promise<boolean | EmailCopyInstance>{
    const newCopy = await EmailCopy.create(dataCopy)
    return newCopy.id ? newCopy : false
  }

  async getCopys(){
    const listCopys = await EmailCopy.findAll({where: {status:1}})
    return listCopys
  }

  async infoCopy(copy_id:number){
    const infoCopy = await EmailCopy.findByPk(copy_id)
    return infoCopy
  }

  async editCopy(copy_id:number,dataCopy:EmailCopyType){
    await EmailCopy.update(dataCopy,{where:{id:copy_id}})
    return true;
  }

  async removeCourse(copy_id:number){
    await EmailCopy.destroy({where:{id:copy_id}})
    return true;
  }
}
export default new EmailCopyService();