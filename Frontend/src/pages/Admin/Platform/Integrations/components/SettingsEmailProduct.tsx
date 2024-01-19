import React, { FormEvent, useEffect, useState } from "react"
import { Modal, TitleModal } from "../../../../../components/Modal"
import { IProducts } from "../../Dtos/integrations.dto"

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICopyEmail } from "../../Dtos/mail.dto";
import { InputForm } from "../../../../../components/Inputs";
import { TextEditor } from "../../../../../components/TextEditor";
import { Button } from "../../../../../components/Buttons";

import DOMPurify from 'dompurify';
import api from "../../../../../services/api";
import { LoadingBars } from "../../../../../components/Loading";

type SettingsEmailProductComponents = {
  product:IProducts,
  close:React.Dispatch<React.SetStateAction<null|IProducts>>
}
export const SettingsEmailProduct : React.FC<SettingsEmailProductComponents> = (props) => {
  const [ listCopys, setListCopys ] = useState<null|ICopyEmail[]>(null)
  const [ newCopy, setNewCopy ] = useState(false)
  const [ openCopy, setOpenCopy ] = useState<null|ICopyEmail>(null)
  const getCopys = async () => {
    try{
      const copys = await api.get('listCopys')
      setListCopys(copys.data.response)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{getCopys()},[openCopy,newCopy])
  return(
    <Modal className="w-full" component={
      <div className="flex flex-col">
        <TitleModal icon="faEnvelope" title="Configure o E-mail deste produto" close={()=>props.close(null)}/>
        <div className="flex flex-wrap">
          <div
            onClick={()=>setNewCopy(true)}
            className="
              flex flex-col justify-center items-center w-[16%] p-4 h-[200px] m-1 rounded relative cursor-pointer
              border bg-teal-800/50 hover:bg-teal-800 text-white border-teal-500">
            <FontAwesomeIcon className="text-4xl my-2 opacity-70" icon={Fas.faPencil}/>
            Nova Copy
          </div>
          { listCopys === null ? <LoadingBars/> :
            listCopys.length > 0 &&
            listCopys.map((copy,key)=><CopyItem key={key} copy={copy} setOpenCopy={setOpenCopy}/>)}          
        </div>   
        { newCopy && <CreateNewCopy close={setNewCopy}/>} 
        { openCopy && <EditCopy copy={openCopy} close={setOpenCopy}/>}    
      </div>
    }/>
  )
}

type CopyItemComponent = {
  copy:ICopyEmail,
  setOpenCopy:React.Dispatch<React.SetStateAction<null|ICopyEmail>>
}
const CopyItem : React.FC<CopyItemComponent> = (props) => {  
  return(
    <div
      onClick={()=>props.setOpenCopy(props.copy)}
      className="
        flex flex-col justify-center items-center w-[16%] p-4 h-[200px] m-1 rounded relative cursor-pointer
        border bg-neutral-800/50 hover:bg-neutral-800 text-white border-teal-500">
      <FontAwesomeIcon className="text-4xl my-2 opacity-70" icon={Fas.faEnvelopeCircleCheck}/>
      <p className="text-center text-sm">
      {props.copy.title}
      </p>      
    </div>)
}

type CreateNewCopyComponent = {
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const CreateNewCopy : React.FC<CreateNewCopyComponent> = (props) => {
  const [ title, setTitle] = useState("")
  const [ subject, setSubject] = useState("")
  const [ body, setBody] = useState("")
  const addTag = (tag:string) => {
    const text = `${body} ${tag} `
    setBody(text)
  }
  const [ preview, setPreview] = useState(false)
  const [ sendTest, setSendTest] = useState(false)
  const [ error, setError ] = useState("") 
  const saveCopy = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        title:title,
        subject:subject,
        body:body
      }
      const response = await api.post('newCopy',data)
      if (response.data.success) {
        props.close(false)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.message);
      }
    } catch(err){
      console.error('Erro ao salvar a copy:', err);
    }
  }
  return(
    <Modal className="w-2/3" component={
      <>
        <form className="flex flex-col" onSubmit={(e)=>saveCopy(e)}>
          <TitleModal 
            icon="faPencil" 
            title="Nova copy" 
            subtitle="Crie uma nova copy para novos alunos!" 
            close={()=>props.close(false)}/>       
            <InputForm label="Título" placeholder="Escolha um titulo que ajude a identificar o conteúdo desta copy" value={title} onChange={setTitle} required/>  
            <InputForm label="Assunto do E-mail" placeholder="Este é o assunto do e-mail quando enviado para o aluno" value={subject} onChange={setSubject} required/>    
          <div className="flex flex-col justify-center mt-4 max-h-[500px] overflow-auto">          
            <label className="font-semibold italic text-sm text-neutral-300 py-1">Edição de Texto</label>          
            <div className="flex items-center">
              <p className="text-neutral-300 font-light text-sm">
                Para inserir os dados do aluno no email utilize as tags:
              </p>          
              <button 
                onClick={()=>addTag('_NOME_')}
                className="bg-cyan-900 rounded py-1 px-2 text-sm text-white m-1">
                _NOME_
              </button>
              <button 
                onClick={()=>addTag('_EMAIL_')}
                className="bg-cyan-900 rounded py-1 px-2 text-sm text-white my-1 mr-1">
                _EMAIL_
              </button>
              <button 
                onClick={()=>addTag('_SENHA_')}
                className="bg-cyan-900 rounded py-1 px-2 text-sm text-white my-1 mr-1">
                _SENHA_
              </button>
            </div>
            <TextEditor  text={body} setText={setBody}/>          
          </div>
          { error != "" && <p className="text-red-600">{error}</p>}
          <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
            <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.close(false)} />
            <Button btn="info" icon="faSearch" name='Visualizar' onClick={()=>setPreview(true)}/>
            <Button btn="info" icon="faPaperPlane" name='Enviar Teste' onClick={()=>setSendTest(true)}/>
            <Button btn="success" icon="faFloppyDisk" name='Criar Copy' submit/>
          </div>               
        </form>  
        { preview && <PreviewCopy subject={subject} body={body} close={setPreview}/>}  
        { sendTest && <SendTest subject={subject} body={body} close={setSendTest}/>} 
      </>    
    }/>
  )
}

type EditCopyComponent = {
  copy:ICopyEmail,
  close:React.Dispatch<React.SetStateAction<null|ICopyEmail>>
}
const EditCopy : React.FC<EditCopyComponent> = (props) => {
  const [ title, setTitle] = useState(props.copy.title)
  const [ subject, setSubject] = useState(props.copy.subject)
  const [ body, setBody] = useState(props.copy.body)
  const addTag = (tag:string) => {
    const text = `${body} ${tag} `
    setBody(text)
  }
  const [ preview, setPreview] = useState(false)
  const [ sendTest, setSendTest] = useState(false)
  const [ error, setError ] = useState("") 
  const saveCopy = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        title:title,
        subject:subject,
        body:body
      }
      const response = await api.patch(`editCopy/${props.copy.id}`,data)
      console.log(response.data)
      if (response.data.success) {
        props.close(null)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.message);
      }
    } catch(err){
      console.error('Erro ao salvar a copy:', err);
    }
  }
  return(
    <Modal className="w-2/3" component={
      <>
      <form className="flex flex-col" onSubmit={(e)=>saveCopy(e)}>
        <TitleModal 
          icon="faPencil" 
          title="Alterar Copy" 
          subtitle="Edite as informações desta copy!" 
          close={()=>props.close(null)}/>       
         
          
        <div className="flex flex-col mt-4 max-h-[550px] overflow-auto">  
          <div className="flex">
            <div className="flex flex-1 ml-1">
              <InputForm 
                label="Título" 
                placeholder="Escolha um titulo que ajude a identificar o conteúdo desta copy" 
                value={title} 
                onChange={setTitle} 
                required/>  
            </div>
            <div className="flex flex-1 ml-1">
              <InputForm 
                label="Assunto do E-mail" 
                placeholder="Este é o assunto do e-mail quando enviado para o aluno" 
                value={subject} 
                onChange={setSubject} 
                required/>   
              </div>         
          </div>
          <label className="font-semibold italic text-sm text-neutral-300 py-1">Edição de Texto</label>          
          <div className="flex items-center">
            <p className="text-neutral-300 font-light text-sm">
              Para inserir os dados do aluno no email utilize as tags:
            </p>          
            <button 
              onClick={()=>addTag('_NOME_')}
              className="bg-cyan-900 rounded py-1 px-2 text-sm text-white m-1">
              _NOME_
            </button>
            <button 
              onClick={()=>addTag('_EMAIL_')}
              className="bg-cyan-900 rounded py-1 px-2 text-sm text-white my-1 mr-1">
              _EMAIL_
            </button>
            <button 
              onClick={()=>addTag('_SENHA_')}
              className="bg-cyan-900 rounded py-1 px-2 text-sm text-white my-1 mr-1">
              _SENHA_
            </button>
          </div>
          <div className="text-black ">
            <TextEditor  text={body} setText={setBody}/>       
          </div>   
        </div>
        { error != "" && <p className="text-red-600">{error}</p>}
        <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
          <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.close(null)} />
          <Button btn="info" icon="faSearch" name='Visualizar' onClick={()=>setPreview(true)}/>
          <Button btn="info" icon="faPaperPlane" name='Enviar Teste' onClick={()=>setSendTest(true)}/>
          <Button btn="success" icon="faFloppyDisk" name='Salvar Alterações' submit/>
        </div> 
      </form>  
      { preview && <PreviewCopy subject={subject} body={body} close={setPreview}/>}  
      { sendTest && <SendTest subject={subject} body={body} close={setSendTest}/>}  
      </>   
    }/>
  )
}

type PreviewCopyComponent = {
  subject:string,
  body:string,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const PreviewCopy : React.FC<PreviewCopyComponent> = (props) => {
  const sanitizedHtml = DOMPurify.sanitize(props.body.replace('_NOME_', 'Glauco')
                                 .replace('_EMAIL_', 'lugheri@live.com')
                                 .replace('_SENHA_', '12ab@'));
  return(
    <Modal className="w-full" component={
      <div className="flex flex-col"> 
        <TitleModal 
            icon="faEnvelope" 
            title={`Assunto: ${props.subject}`} 
            subtitle="Preview do E-mail" 
            close={()=>props.close(false)}/>
        <div className="flex justify-center items-center p-4">
          <div 
            className="flex flex-col shadow-md shadow-black w-full min-h-[200px] max-h-[500px] overflow-auto p-4 bg-white"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </div>



        <div className="flex justify-end border-t border-slate-600 pt-2">
          <Button btn="muted" name='Fechar' type='notline' onClick={()=>props.close(false)} />
        </div>    
      </div>      
    }/>
  )
}

type SendTestComponent = {
  subject:string,
  body:string,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const SendTest : React.FC<SendTestComponent> = (props) => {
  const [ error, setError ] = useState("") 
  const [ destination, setDestination ] = useState("")
  const [ name_test, setNameTest ] = useState("")
  const [ email_test, setEmailTest ] = useState("")

  const sendTest = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        from:'Test',
        mailTo:destination,
        subject:props.subject,
        body:props.body.replace('_NOME_', name_test)
        .replace('_EMAIL_', email_test)
        .replace('_SENHA_', '12ab@')        
      }
     
      const response = await api.post('sendTestCopy',data)
      console.log('data',response.data)
      if (response.data.success) {
        props.close(false)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.message);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }

  }
  
  return(
    <Modal  component={
      <form className="flex flex-col" onSubmit={(e)=>sendTest(e)}> 
        <TitleModal 
            icon="faPaperPlane" 
            title="Enviar Teste" 
            subtitle="Configure os dados para disparar o teste" 
            close={()=>props.close(false)}/>
        
        <InputForm 
          inputType="email" 
          required 
          label="Enviar Para:" 
          value={destination} 
          onChange={setDestination}/>  
        <InputForm 
          label="Nome" 
          required 
          value={name_test} 
          onChange={setNameTest}/>  
        <InputForm 
          inputType="email" 
          required 
          label="Email" 
          value={email_test} 
          onChange={setEmailTest}/>   
          
        { error != "" && <p className="text-red-600">{error}</p>}
        <div className="flex justify-end border-t border-slate-600 pt-2">
          <Button btn="muted" name='Fechar' type='notline' onClick={()=>props.close(false)} />
          <Button btn="info" name='Disparar Teste' icon="faPaperPlane" submit />
        </div>    
      </form>      
    }/>
  )
}