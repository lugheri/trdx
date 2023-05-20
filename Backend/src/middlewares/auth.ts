import { Request,Response,NextFunction  } from "express"
import 'dotenv/config';
import jwt from 'jsonwebtoken';

export default (req:Request, res:Response,next:NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.json('Token not provided');
    try{
        const payload = jwt.verify(authHeader, process.env.APP_SECRET as string);
        console.log(payload)
        return next();
    }catch(err){
        return res.json(false);
    }    
}