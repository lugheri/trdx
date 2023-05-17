import { Request, Response } from 'express';

class AuthController{
  live(req: Request,res: Response){
    console.log('Server online')
    res.json(true)
  }
  login(req: Request,res: Response){
    interface  RequestBody { username : string, password : string}
    const {username,password}:RequestBody = req.body
    res.json(true)
  }
}

export default new AuthController();