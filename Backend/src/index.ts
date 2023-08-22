import routes from './routes/routes';

import http from 'http';
import express, { ErrorRequestHandler} from 'express';
import { MulterError } from 'multer';
import cors from 'cors';
import path from 'path';

const app = express();


app.use(cors());
app.use(express.json({limit:'250mb'}))
app.use(express.static(path.join(__dirname,'../public')));
app.use(express.urlencoded({extended:true, limit:'250mb'}));

app.use(routes)


const errorHandler: ErrorRequestHandler = (err,req,res,next) =>{
  res.status(400)

  if(err instanceof MulterError){
    res.json({ error: err.code});
  }else{
    console.log(err)
    res.json({error:  'Ocorreu algum erro'})
  }
}
app.use(errorHandler)






const httpServer = http.createServer(app);
const startUp = async() => {  
  httpServer.listen(4000,()=>console.log('😀 Backend Platform v4 - online!'));
}
startUp()

