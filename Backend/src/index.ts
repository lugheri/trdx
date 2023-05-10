import routes from './routes/routes';

import http from 'http';
import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();


app.use(cors());
app.use(express.json({limit:'250mb'}))
app.use(express.static(path.resolve(__dirname,'../public')));
app.use(express.urlencoded({extended:true, limit:'250mb'}));

app.use(routes)



const httpServer = http.createServer(app);


const startUp = async() => {
  httpServer.listen(4000,()=>console.log('😀 Backend Platform v4 - online!'));
}
startUp()
