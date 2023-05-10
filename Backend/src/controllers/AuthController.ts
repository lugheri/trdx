import { Request, Response } from 'express';

class AuthController{
  live(req: Request,res: Response){
    console.log('Server online')
    res.json(true)
  }
}

export default new AuthController();