import { Request, Response } from 'express';
import integrationPlatformService from '../services/integrationPlatformService';
import { EmailCopyDTO, IntegrationCoursesDTO, IntegrationOfferDTO, IntegrationPlatformDTO, IntegrationProductDTO } from './Dtos/integration.dto';
import IntegrationProductService from '../services/IntegrationProductService';
import IntegrationOffersService from '../services/IntegrationOffersService';
import IntegrationCoursesService from '../services/IntegrationCoursesService';
import integrationHooksHistoryService from '../services/integrationHooksHistoryService';
import emailCopyService from '../services/emailCopyService';
import mailAccountService from '../services/mailAccountService';
import nodemailer from 'nodemailer';

class IntegrationsController{
  //Platforms
  async newPlatformIntegration(req:Request,res:Response){
    const dataPlatform = IntegrationPlatformDTO.safeParse(req.body)
    if(!dataPlatform.success){
      res.json({"error":dataPlatform.error})
      return
    }
    try{
      //Create a new credential
      const dataNewPlatform = await integrationPlatformService.newIntegration(dataPlatform.data)
      if(dataNewPlatform){
        res.json({"success": true,"response": dataNewPlatform})  
        return
      }
      res.json({"error":"Falha ao cadastrar plataforma de integração!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async listPlatformIntegration(req:Request,res:Response){
    const status = parseInt(req.params.status)
    try{
      const listIntegrations = await integrationPlatformService.getIntegrations(status)
      if(listIntegrations){
        res.json({"success": true,"response": listIntegrations})  
        return
      }
      res.json({"error":"Falha ao recuperar plataformas!"})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar plataformas!"}) 
    }
  }
  async infoPlatformIntegration(req:Request,res:Response){
    const integration_id = parseInt(req.params.integration_id)
    try{
      const infoPlatform = await integrationPlatformService.infoIntegrations(integration_id)
      if(infoPlatform){
        res.json({"success": true,"response": infoPlatform})  
        return
      }
      res.json({"error":"Falha ao recuperar plataforma!"})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar plataforma!"}) 
    }
  }
  async editPlatformIntegration(req:Request,res:Response){
    const integration_id = parseInt(req.params.integration_id)
    const dataPlatform = IntegrationPlatformDTO.safeParse(req.body)       
    if(!dataPlatform.success){
      res.json({"error": dataPlatform.error})  
      return
    }
    try{
      const edit = await integrationPlatformService.editIntegration(integration_id, dataPlatform.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  //Products
  async newProduct(req:Request,res:Response){
    const dataProduct = IntegrationProductDTO.safeParse(req.body)
    if(!dataProduct.success){
      res.json({"error":dataProduct.error})
      return
    }
    try{
      //Create a new credential
      const dataNewProduct = await IntegrationProductService.newProduct(dataProduct.data)
      if(dataNewProduct){
        res.json({"success": true,"response": dataNewProduct})  
        return
      }
      res.json({"error":"Falha ao cadastrar produto!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async listProducts(req:Request,res:Response){
    const status = parseInt(req.params.status)
    const integration = req.params.integration
    try{
      const listProducts = await IntegrationProductService.getProductsPlatform(status,integration)
      if(listProducts){
        res.json({"success": true,"response": listProducts})  
        return
      }
      res.json({"error":"Falha ao recuperar produtos!"})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar produtos!"}) 
    }
  }
  async infoProduct(req:Request,res:Response){
    const product_id = parseInt(req.params.product_id)
    try{
      const infoProduct = await IntegrationProductService.infoProduct(product_id)
      if(infoProduct){
        res.json({"success": true,"response": infoProduct})  
        return
      }
      res.json({"error":"Falha ao recuperar produto!"})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar produto!"}) 
    }
  }  
  async editProduct(req:Request,res:Response){
    const product_id = parseInt(req.params.product_id)
    const dataProduct = IntegrationProductDTO.safeParse(req.body)       
    if(!dataProduct.success){
      res.json({"error": dataProduct.error})  
      return
    }
    try{
      const edit = await IntegrationProductService.editProduct(product_id, dataProduct.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }  
  async deleteProduct(req:Request,res:Response){
    const product_id = parseInt(req.params.product_id)
    try{
      await IntegrationProductService.removeProduct(product_id)
      res.json({"success": true,"response": true})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao remover produto!"}) 
    }
  }

  //Offers
  async newOffer(req:Request,res:Response){
    const dataOffer = IntegrationOfferDTO.safeParse(req.body)
    if(!dataOffer.success){
      res.json({"error":dataOffer.error})
      return
    }
    try{
      //Create a new credential
      const dataNewOffer = await IntegrationOffersService.newOffer(dataOffer.data)
      if(dataNewOffer){
        res.json({"success": true,"response": dataNewOffer})  
        return
      }
      res.json({"error":"Falha ao cadastrar oferta!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async listOffers(req:Request,res:Response){
    const product_id = parseInt(req.params.product_id)
    const status = parseInt(req.params.status)
    try{
      const listOffers = await IntegrationOffersService.getOffers(status,product_id)
      if(listOffers){
        res.json({"success": true,"response": listOffers})  
        return
      }
      res.json({"error":"Falha ao recuperar Ofertas!"})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar Ofertas!"}) 
    }
  }
  async infoOffer(req:Request,res:Response){
    const offer_id = parseInt(req.params.offer_id)
    try{
      const infoOffer = await IntegrationOffersService.infoOffer(offer_id)
      if(infoOffer){
        res.json({"success": true,"response": infoOffer})  
        return
      }
      res.json({"error":"Falha ao recuperar oferta!"})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar oferta!"}) 
    }
  }
  async editOffer(req:Request,res:Response){
    const offer_id = parseInt(req.params.offer_id)
    const dataOffer = IntegrationOfferDTO.safeParse(req.body)       
    if(!dataOffer.success){
      res.json({"error": dataOffer.error})  
      return
    }
    try{
      const edit = await IntegrationOffersService.editOffer(offer_id,dataOffer.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }  
  async deleteOffer(req:Request,res:Response){
    const offer_id = parseInt(req.params.offer_id)
    try{
      await IntegrationOffersService.removeOffer(offer_id)
      res.json({"success": true,"response": true})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao remover oferta!"}) 
    }
  }

  //Courses
  async newCourse(req:Request,res:Response){
    const dataCourse = IntegrationCoursesDTO.safeParse(req.body)
    if(!dataCourse.success){
      res.json({"error":dataCourse.error})
      return
    }
    try{
      //Create a new credential
      const dataNewCourse = await IntegrationCoursesService.newCourse(dataCourse.data)
      if(dataNewCourse){
        res.json({"success": true,"response": dataNewCourse})  
        return
      }
      res.json({"error":"Falha ao cadastrar curso!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async listCourse(req:Request,res:Response){
    const product_id = parseInt(req.params.product_id)
    const offer_id = parseInt(req.params.offer_id)
    try{
      const listCourse = await IntegrationCoursesService.getCoursesPlatform(product_id,offer_id)
      if(listCourse){
        res.json({"success": true,"response": listCourse})  
        return
      }
      res.json({"error":"Falha ao recuperar cursos!"})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar cursos!"}) 
    }
  }
  async infoCourseStudentPlatform(req:Request,res:Response){
    const offer_id = parseInt(req.params.offer_id)
    const course_id_students = parseInt(req.params.course_id_students)
    try{
      const infoCourse = await IntegrationCoursesService.infoCourseStudentPlatform(offer_id,course_id_students)
      if(infoCourse){
        res.json({"success": true,"response": infoCourse})  
        return
      }
      res.json({"error":"Falha ao recuperar curso!"})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar curso!"}) 
    }
  }
  async editCourse(req:Request,res:Response){
    const course_id = parseInt(req.params.course_id)
    const dataCourse = IntegrationCoursesDTO.safeParse(req.body)       
    if(!dataCourse.success){
      res.json({"error": dataCourse.error})  
      return
    }
    try{
      const edit = await IntegrationCoursesService.editCourse(course_id, dataCourse.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }  
  async deleteCourse(req:Request,res:Response){
    const course_id = parseInt(req.params.course_id)
    try{
      await IntegrationCoursesService.removeCourse(course_id)
      res.json({"success": true,"response": true})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao remover produto!"}) 
    }
  }

  //Hooks
  async listHooks(req:Request,res:Response){
    const integration = req.params.integration
    const product_id = parseInt(req.params.product_id)
    const page = parseInt(req.params.page)
    try{
      const listHooks = await integrationHooksHistoryService.listIntegrationHooks(page,integration,product_id)
      if(listHooks){
        res.json({"success": true,"response": listHooks})  
        return
      }
      res.json({"error":"Falha ao recuperar hooks!"})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar hooks!"}) 
    }
  }
  async infoHooks(req:Request,res:Response){
    const hook_id = parseInt(req.params.hook_id)
    try{
      const infoHook = await integrationHooksHistoryService.getHook(hook_id)
      if(infoHook){
        res.json({"success": true,"response": infoHook})  
        return
      }
      res.json({"error":"Falha ao recuperar hook!"})  

    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar hook!"}) 
    }

  }

  //Emails Copys
  async newCopy(req:Request,res:Response){
    const dataCopy = EmailCopyDTO.safeParse(req.body)
    if(!dataCopy.success){
      res.json({"error":dataCopy.error})
      return
    }
    try{
      //Create a new credential
      const dataNewCopy = await emailCopyService.newCopy(dataCopy.data)
      if(dataNewCopy){
        res.json({"success": true,"response": dataNewCopy})  
        return
      }
      res.json({"error":"Falha ao cadastrar copy!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async listCopys(req:Request,res:Response){
    try{
      const listCopys = await emailCopyService.getCopys()
      if(listCopys){
        res.json({"success": true,"response": listCopys})  
        return
      }
      res.json({"error":"Falha ao recuperar copys!"})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar copys!"}) 
    }
  }
  async infoCopy(req:Request,res:Response){
    const copy_id = parseInt(req.params.copy_id)
    try{
      const infoCopy = await emailCopyService.infoCopy(copy_id)
      if(infoCopy){
        res.json({"success": true,"response": infoCopy})  
        return
      }
      res.json({"error":"Falha ao recuperar copy!"})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao recuperar copy!"}) 
    }
  }
  async editCopy(req:Request,res:Response){
    const copy_id = parseInt(req.params.copy_id)
    const dataCopy = EmailCopyDTO.safeParse(req.body)       
    if(!dataCopy.success){
      res.json({"error": dataCopy.error})  
      return
    }
    try{
      const edit = await emailCopyService.editCopy(copy_id, dataCopy.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }  
  async deleteCopy(req:Request,res:Response){
    const copy_id = parseInt(req.params.copy_id)
    try{
      await emailCopyService.removeCourse(copy_id)
      res.json({"success": true,"response": true})  
    }catch(err){
      console.error(err)
      res.json({"error":"Falha ao remover copy!"}) 
    }
  } 
  //Send Test Copy
  async sendTestCopy(req:Request,res:Response){
    const dataSend = req.body
    const listAccounts = await mailAccountService.listAccounts()
    const dataAccount = listAccounts[0]
    if(!dataAccount){
      res.json({"error":"Conta de E-mail não localizada"})
        return
    }
    // Configurações do transporte (SMTP)
    const transporter = nodemailer.createTransport({
      host: dataAccount.host , // Endereço do servidor SMTP
      port: dataAccount.port,
      secure: dataAccount.secure == 1 ? true : false, // Usar SSL
      auth: {
        user: dataAccount.user, // Usuário do servidor SMTP
        pass: dataAccount.pass, // Senha do servidor SMTP
      },
    });
    // Opções do e-mail
    const mailOptions = {                
      from: `${dataSend.from} <${dataAccount.user}>`, // Seu e-mail
      to: dataSend.mailTo, // Endereço do destinatário
      cc: "", // Cópia
      bcc: "", // Cópia Oculta
      subject: dataSend.subject,
      html: dataSend.body,
    };    
    // Envia o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.json({"success": false,"message":`Erro ao enviar e-mail: ${error}`})
      } else {
        console.info('E-mail enviado com sucesso! ID:', info.messageId);
        res.json({"success": true,"message":`E-mail enviado com sucesso! ID:${info.messageId}`})
      }
    });
  }
}

export default new IntegrationsController();