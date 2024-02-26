import { Request, Response } from "express";
import { CommunityMediaDTO, CommunityMessageDTO } from "./Dtos/community.dto";
import communityMessageService from "../services/communityMessageService";
import moment from "moment";
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { unlink } from 'fs/promises'
import studentsService from "../services/studentsService";
import { addSet, checkSet, countSet } from "../config/redis";

class CommunityController{
  async setOnline(req:Request,res:Response){
    const redisKey = `onLineMembers`
    
    const studentId:string = req.body.user_id
    const check = await checkSet(redisKey,`user:${studentId}`)
    //console.log('Check',check)

    if(check===false){
      //console.log('addSet',redisKey,`user:${studentId}`)
      await addSet(redisKey,`user:${studentId}`)
    }
    res.json(true)
  }

  async getInfoMembers(req:Request,res:Response){
    const allMembers = await studentsService.totalCommunityMembers()
    const onLineMembers = await countSet('onLineMembers')
    res.json({'members':allMembers,'onLine':onLineMembers})

  }
  
  async listMessagesCommunity(req:Request,res:Response){
    const page = parseInt(req.params.page)
    try{
      const messages = await communityMessageService.listMessages(page)
      res.json({"success":true,"response":messages})
    }catch(err){
      res.json({
        "error":true,
        "message":"Ocorreu um erro ao recuperar os itens",
        "error_info":err
      })
    }
  }

  async newMessage(req:Request,res:Response){
    const dataMessage = CommunityMessageDTO.safeParse({ ...req.body,user_last_message:await communityMessageService.getUserLastMessage()})
    if(dataMessage.success){
      try{
        await communityMessageService.newMessage(dataMessage.data)
        res.json({"success":true})
      }catch(err){
        res.json({
          "error":true,
          "message":"Ocorreu um erro ao salvar o item",
          "error_info":err
        })
      }
      return
    }
    res.json({
      "error":true,
      "message":dataMessage.error.message
    })
  }

  async newAudioMessage(req:Request,res:Response){ 
    const userId = parseInt(req.body.user_id)
    const nameAudio = `${moment().format("YYYYMMDDHHmmss")}-${userId}.mp4`
    const b64=req.body.file['base64_data']
    const rawBodyData = b64.split('base64,')[1];
    const completePathAudio = path.resolve(__dirname,'..','..','public','media',nameAudio)
    const secondsDuration = parseInt(req.body.file['audioSeconds'])
    fs.writeFileSync(completePathAudio,rawBodyData,{encoding: 'base64'});    
    //Save Audio
    const dataMedia = CommunityMediaDTO.safeParse({ 
      user_id: userId,
      file:nameAudio,
      type_media:'audio',     
      duration:secondsDuration,
    })
    if(dataMedia.success){
      try{
        const mediaId = await communityMessageService.newMediaMessage(dataMedia.data)
        if(mediaId === null){
          res.json({
            "error":true,
            "message":"Ocorreu um erro ao gerar id da midia"
          })
          return
        }
        //Save Data Message
        const dataMessage = CommunityMessageDTO.safeParse({ 
          is_student: parseInt(req.body.is_student),
          user_id: userId,
          user_photo:parseInt(req.body.user_photo),
          user_name:req.body.user_name,
          user_last_message: await communityMessageService.getUserLastMessage(),
          message:'',
          media: mediaId,
        })
        if(dataMessage.success){
          try{
            await communityMessageService.newMessage(dataMessage.data)
            res.json({"success":true})
          }catch(err){
            res.json({
              "error":true,
              "message":"Ocorreu um erro ao salvar a mensagem",
              "error_info":err
            })
          }
          return
        }
        res.json({
          "error":true,
          "message":dataMessage.error.message
        })
      }catch(err){
        res.json({
          "error":true,
          "message":"Ocorreu um erro ao salvar a midia",
          "error_info":err
        })
        console.log(err)
        return
      }
    }else{
      res.json({
        "error":true,
        "message":dataMedia.error.message
      })
    }   
  }

  async loadMedia(req:Request,res:Response){
    const mediaId = parseInt(req.params.mediaId)
    try{
      const dataMedia = await communityMessageService.loadMedia(mediaId)
      res.json({"success":true,"response":dataMedia === null ? false : dataMedia})
    }catch(err){
      res.json({
        "error":true,
        "message":"Ocorreu um erro ao recuperar dados",
        "error_info":err
      })
    }
  }

  async newFileMessage(req:Request,res:Response){
    const userId = parseInt(req.body.user_id)
    console.log('FILE',req.file)
    console.log('body',req.body)
    if(req.file){      
      const tempFilePath = req.file.path;
      const destinationDirectory = './public/media/';
      const typeMedia = req.file.mimetype.startsWith('image/') ? "image":"doc"
      let filename:string
      if(typeMedia == "image"){
        filename = `${userId}_${req.file.filename}.${req.file.originalname}`
        await sharp(tempFilePath)
              .resize(256)
              .toFile(`${destinationDirectory}${filename}`);
        await unlink(tempFilePath)
      }else{    
        filename = `${userId}_${req.file.originalname}`;
        const newFilePath = path.join(destinationDirectory, filename);
        fs.rename(tempFilePath, newFilePath, (err) => {
          if (err) {
            res.json({
              "error":true,
              "message":"Erro ao mover o arquivo:",
              "info":err
            })
            return
          }         
        });
        
      }
      
      //Save File
      const dataMedia = CommunityMediaDTO.safeParse({ 
        user_id: userId,
        file:filename,
        type_media:typeMedia,     
        duration:0,
      })
      if(dataMedia.success){
        try{
          const mediaId = await communityMessageService.newMediaMessage(dataMedia.data)
          if(mediaId === null){
            res.json({
              "error":true,
              "message":"Ocorreu um erro ao gerar id da midia"
            })
            return
          }
          //Save Data Message
          const dataMessage = CommunityMessageDTO.safeParse({ 
            is_student: parseInt(req.body.is_student),
            user_id: userId,
            user_photo:parseInt(req.body.user_photo),
            user_name:req.body.user_name,
            user_last_message: await communityMessageService.getUserLastMessage(),
            message:req.body.message,
            media: mediaId,
          })
          if(dataMessage.success){
            try{
              await communityMessageService.newMessage(dataMessage.data)
              res.json({"success":true})
            }catch(err){
              res.json({
                "error":true,
                "message":"Ocorreu um erro ao salvar a mensagem",
                "error_info":err
              })
            }
            return
          }
          res.json({
            "error":true,
            "message":dataMessage.error.message
          })
          return
        }catch(err){
          res.json({
            "error":true,
            "message":"Ocorreu um erro ao salvar a midia",
            "error_info":err
          })
          console.log(err)
          return
        }
      }else{
        res.json({
          "error":true,
          "message":dataMedia.error.message
        })
        return
      }  
    }
    res.json({"error":true, "message":"No file received"})     
  }
  
  async editMessage(req:Request,res:Response){

  }
}
export default new CommunityController();