import { Request, Response } from 'express';
class ApiController{
  async checkHealth(req: Request,res: Response){
    res.json(true)
  }

  async webhook(req: Request,res: Response){
    console.log('>>>>>>>>>>>>>>>>>>> Dados Recebidos GET',req.params)
    console.log('>>>>>>>>>>>>>>>>>>> Dados Recebidos POST',req.body)
    res.json(true)
  }
}

export default new ApiController();