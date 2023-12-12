import { Card } from "../../../../../components/Cards"
import * as Fab from "@fortawesome/free-brands-svg-icons";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../../../../components/Buttons";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ILessonsAccessRule, ILessonsModule, IModuleCourse } from "../../Dtos/courses.dto";
import api from "../../../../../services/api";
import { LoadingBars } from "../../../../../components/Loading";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { InputForm, InputNumberForm, SelectForm, TextAreaForm } from "../../../../../components/Inputs";
import { TextEditor } from "../../../../../components/TextEditor";
import moment from 'moment';
import DOMPurify from 'dompurify';
import { IAttachmentsLesson } from "../../../../Students/Dtos/courses.dto";

type LessonSetupComponent = {
  setLessonSetup:React.Dispatch<React.SetStateAction<number|null>>,
  infoModule:IModuleCourse|null,
  lessonId:number,
  course:string
}
export const LessonSetup:React.FC<LessonSetupComponent> = (props) => {
  const [ infoLesson, setInfoLesson ] = useState<ILessonsModule|null>(null)
  const [ nameLesson, setNameLesson ] = useState("")
  const [ editVideo, setEditVideo ] = useState(false)
  const [ editDescription, setEditDescription ] = useState(false)
  const [ editAccessRule, setEditAccessRule ] = useState(false)
  const [ addAttachment, setAddAttachment ] = useState(false)
  const [ editVisibility, setEditVisibility ] = useState(false)
  const [ removeLesson, setRemoveLesson ] = useState(false)

  //Save Name Lesson
  const [ saveNameMessage, setSaveNameMessage ] = useState("")
  const saveNameLesson = async () => {
    try{
      const r = await api.patch(`editLessonModule/${props.lessonId}`,{name:nameLesson})
      console.log(r)
      setSaveNameMessage("Título da aula alterado com sucesso!")
      setTimeout(()=>{setSaveNameMessage("")},3000)
      
      
    }catch(e){console.log(e)}
  }
  //Info
  const getInfo = async () => {
    try{
      const i = await api.get(`infoLesson/${props.lessonId}`)
      setInfoLesson(i.data.response)
      setNameLesson(i.data.response.name)
      
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{ getInfo() },[editVideo,editDescription,editVisibility,removeLesson]) 
  //Rules
  const [ accessRule, setAccessRule ] = useState<ILessonsAccessRule|null>(null)
  const lessonAccessRules = async () => {
    try{
      const i = await api.get(`lessonAccessRule/${props.lessonId}`)
      console.log('lessonAccessRule',i.data)
      setAccessRule(i.data.response)      
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{lessonAccessRules()},[editAccessRule]) 

  //Attachments
  const [ attachments, setAttachments ] = useState<IAttachmentsLesson[]|null>(null)
  const [ delAttachment, setDelAttachment ] = useState<IAttachmentsLesson|null>(null)
  const lessonAttachments = async () => {
    try{
      const i = await api.get(`getAttachmentsLesson/${props.lessonId}`)
      console.log('lessonAccessRule',i.data)
      setAttachments(i.data.response)      
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{lessonAttachments()},[addAttachment,delAttachment])   

  const openLinkVideo = async (link:string) => { window.open(link, '_blank'); }

  const sanitizedHtml = (text:string) =>{
    return DOMPurify.sanitize(text);
  }
  
  return(
    <>
      { infoLesson === null ? <LoadingBars/>
      :
      <div className="flex flex-col">
        {/*Info Course lesson*/}
        <Card component={
          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <p className="text-neutral-100">
                <FontAwesomeIcon className="text-teal-500/50" icon={Fas.faCube}/> Informações do Curso
              </p>
              <Button icon="faReply" btn="muted" name="Voltar" onClick={()=>props.setLessonSetup(null)}/>
            </div>
            <div className="flex w-full">           
              <div className="flex flex-col w-full justify-center px-4">
                <p className="text-white font-light"><b>Curso: </b>{props.course}</p>
                <p className="text-white font-light"><b>Módulo: </b>{props.infoModule ? props.infoModule.module : ""}</p>
                <p className="text-white font-light"><b>Código da Aula: </b>{props.lessonId}</p>
              </div>     
            </div>
          </div>}/>
        {/*Title lesson*/}
        <Card component={
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col flex-1">
            <p className="text-teal-500 text-sm text-center">{saveNameMessage}</p>
              <InputForm label="Título da Aula" value={nameLesson} onChange={setNameLesson}/>
            </div>          
            <div  className="mt-3 ml-2">
              <Button  btn="success" type="notline" icon="faFloppyDisk" name="Salvar Título" onClick={()=>saveNameLesson()}/>
            </div>
          </div>}/>

        <div className="flex w-full">
          <div className="flex flex-col w-3/4">
            {/*Video*/}
            <Card component={
              <div className="flex w-full justify-between items-center">
                <iframe  
                className="w-[70%] h-[300px]" 
                width="100%" 
                allow="autoplay; fullscreen" 
                src={`https://player.vimeo.com/video/${infoLesson.link}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
                <div className="flex px-4 w-[30%]">
                  {infoLesson.video_platform == 'vimeo' 
                  ? 
                    <div className="flex flex-col">
                      <p  className="text-4xl text-sky-400 mb-4"> <FontAwesomeIcon icon={Fab.faVimeo}/> Vimeo</p>
                      <p className="text-neutral-300 mb-2">
                        <strong>Id do Vídeo: </strong><br/> <span className="text-xl font-light mx-4">{infoLesson.link}</span>
                      </p>
                      <p className="text-neutral-300 mb-2 text-sm">
                        <strong>Link do Vídeo:</strong>
                        <Button btn="info" block type="notline" size="sm" icon="faExternalLink" name="Acessar Vídeo" onClick={()=>{openLinkVideo(`http://vimeo.com/${infoLesson.link}`)}}/>
                      </p>
                      <Button icon="faEdit" name="Alterar Vídeo" btn="muted" size="sm" onClick={()=>setEditVideo(true)}/>
                    </div>
                  :
                    <div className="flex flex-col"></div> 
                  }
                </div>
                { editVideo && <NewVideo lessonId={infoLesson.id} close={setEditVideo}/>}

              </div>
            }/>
            {/*Description lesson*/}
            <Card component={
              <div className="flex flex-col w-full justify-center items-center">
                <p className="text-white w-full">Descrição do Vídeo</p>
                <div className="bg-neutral-950 mt-2 p-2 rounded flex  w-full">
                  <div className="my-2 font-extralight text-white" dangerouslySetInnerHTML={{ __html: sanitizedHtml(infoLesson.description) }} />
                </div>
                <Button icon="faEdit" name="Editar Descrição" btn="muted" size="sm" onClick={()=>setEditDescription(true)}/>
              </div>}/>
            { editDescription && <EditDescription description={infoLesson.description} lessonId={infoLesson.id} close={setEditDescription}/>}
          </div>
          <div className="flex flex-col flex-1">
            {/*Access Rules*/}
            <Card component={
              <div className="flex flex-col w-full">
                <p className="text-white">
                  <FontAwesomeIcon className="text-teal-500" icon={Fas.faCalendarCheck}/> Regra de Liberação
                </p>
                {accessRule ? 
                  accessRule.rule_access == 'L' 
                  ? <div className="flex flex-col bg-teal-500 py-4 px-2 rounded text-white justify-center items-center">
                      <p>{accessRule.rule_access} - Liberação Imediata</p>
                      <p className="mt-2 text-xs text-center font-light">A aula estará disponível para o aluno assim que ele acessa-la</p>
                    </div> 
                  : accessRule.rule_access == 'D'
                  ? <div className="flex flex-col bg-orange-500 p-2 rounded text-white justify-center items-center">
                      <p>{accessRule.rule_access} - {accessRule.days_to_access} Dias após a compra</p>
                      <p className="mt-2 text-xs text-center font-light">A aula será liberada {accessRule.days_to_access} dia(s) após a data de compra</p>
                    </div> 
                  : accessRule.rule_access == 'F'
                  ? <div className="flex flex-col bg-red-500 p-2 rounded text-white justify-center items-center">
                  <p>{accessRule.rule_access} - Data fixada</p>
                  <p className="mt-2 text-xs text-center font-light">A aula estará disponível apenas após {moment(accessRule.date_of_access).format('DD/MM/YYYY')}</p>
                </div>  : 
                  <p className="text-red-500 font-light text-sm">Ocorreu um erro para identificar a regra <strong>{accessRule.rule_access}</strong></p>
                : <div className="flex flex-col bg-teal-500 p-2 rounded text-white justify-center items-center">
                    <p>Liberação Imediata</p>
                    <p className="mt-2 text-xs text-center font-light">A aula estará disponível para o aluno assim que ele acessa-la</p>
                  </div> }
                  <Button btn="muted" icon="faCalendarWeek" name="Alterar Regra de Liberação" size="sm" onClick={()=>setEditAccessRule(true)}/>
                  { editAccessRule && 
                    <EditAccessRule 
                      ruleLesson={accessRule} 
                      lessonId={infoLesson.id} 
                      close={setEditAccessRule}/>}
              </div>}/>

            {/*Attachments*/}
            <Card component={
              <div className="flex flex-col w-full">
                <p className="text-white">
                  <FontAwesomeIcon className="text-teal-500" icon={Fas.faPaperclip}/> Anexo de Materiais
                </p>  
                <div className="flex flex-col justify-center items-center border-b border-slate-600">
                  { attachments === null ? <LoadingBars/>
                  : attachments.length == 0 
                  ? <p className="text-sm text-neutral-300">Esta aula não possui anexos!</p>
                  : attachments.map((att,key)=>
                    <div className="flex justify-between items-center w-full bg-teal-500/30 border border-teal-500 rounded mb-1  px-2" key={key}>
                      <p className="flex-1 text-sm text-white">
                        <FontAwesomeIcon className="opacity-60" icon={Fas[att.type == 'link' ? "faExternalLink" : "faFile"]}/> {att.name}
                      </p>
                      <Button className="px-0 mx-0" icon="faTrash" border="circle" btn="error" size='sm' type="notline" onClick={()=>setDelAttachment(att)}/>
                    </div>)}
                      
                </div>
                
                <Button btn="muted" icon="faPlus" name="Anexar novo material" block size="sm" onClick={()=>setAddAttachment(true)}/>
                { addAttachment && 
                  <AddAttachment close={setAddAttachment}
                    course_id={infoLesson.course_id} module_id={infoLesson.module_id} lessonId={infoLesson.id} /> }
                { delAttachment  && <DelAttachment close={setDelAttachment} attachment={delAttachment} /> }
              </div>              
              }/>

            {/*Visible*/}
            <Card component={
              <div className="flex flex-col w-full">
                <p className="text-white">
                  <FontAwesomeIcon className="text-teal-500" icon={Fas.faBullhorn}/> Visibilidade da Aula
                </p>
                {infoLesson.visibility == 1
                ? <p className="text-teal-500 text-lg text-center w-full p-4"><FontAwesomeIcon className="opacity-50" icon={Fas.faEye}/> Pública</p>  
                : <p className="text-red-500 text-lg text-center w-full p-4"><FontAwesomeIcon className="opacity-50" icon={Fas.faEyeSlash}/> Privada</p> }
                <Button btn="muted" icon="faPowerOff" name="Alterar Visibilidade" block size="sm" onClick={()=>setEditVisibility(true)} />
              </div>
              }/>
            {editVisibility && <ChangeStatus close={setEditVisibility} lessonId={infoLesson.id} visibility={infoLesson.visibility == 1 ? 0 : 1}/>}
              
            <Button btn="error" icon="faTrash" type="notline" name="Excluir Aula" onClick={()=>setRemoveLesson(true)}/>
            { removeLesson && <RemoveLesson close={setRemoveLesson} lessonId={infoLesson.id}/>}
          </div>
        </div>
      </div>}
    </>)
}

type NewVideoComponent = {
  lessonId:number,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const NewVideo: React.FC<NewVideoComponent> = (props) => {
  const [ linkVideo, setLinkVideo ] = useState("")
  const [ idVideo, setIdVideo ] = useState("")
  const [ platformVideo, setPlatformVideo ] = useState("")
  const updateNewVideo = async () => {
    try{
      const data = {video_platform:platformVideo,link:idVideo}
      const r = await api.patch(`editLessonModule/${props.lessonId}`,data) 
      console.log(r)      
      setIdVideo("")
      setPlatformVideo("")
      props.close(false)
    }catch(e){console.log(e)}
  }

  useEffect(()=>{
    if(linkVideo == ""){
      setIdVideo("")
      setPlatformVideo("")
    }else{
      const match = linkVideo.match(/vimeo\.com\/(\d+)/);
      setPlatformVideo( match ? 'vimeo' : 'erro')
      setIdVideo( match ? match[1] : 'erro')
    }
  },[linkVideo])

  const openLinkVideo = async (link:string) => { window.open(link, '_blank'); }
  
  return(
    <Modal className="w-1/3" component={
      <div className="flex flex-col">
        <TitleModal icon="faVideoCamera" title="Alterar Vídeo" close={()=>props.close(false)}/>
        <div className="flex flex-col">
          <InputForm label="Link do Novo Vídeo" value={linkVideo} onChange={setLinkVideo}/>
          { platformVideo == 'vimeo' ?
              <div className="flex flex-col w-full justify-between items-center">
                <iframe className="w-[90%] h-[200px]" width="100%" allow="autoplay; fullscreen"
                  src={`https://player.vimeo.com/video/${idVideo}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
                <div className="flex p-4 w-full">
                  <div className="flex flex-col justify-center items-center w-full">
                    <p  className="text-2xl text-sky-400"> 
                      <FontAwesomeIcon icon={Fab.faVimeo}/> Vimeo
                    </p>
                    <p className="text-neutral-300 mb-2">
                      <strong>Id do Vídeo: </strong>
                      <span className="text-xl font-light mx-4">{idVideo}</span>
                    </p>
                    <Button icon="faFloppyDisk" btn="success" name="Salvar Novo Vídeo" onClick={()=>updateNewVideo()}/>
                  </div>
                </div>
                </div>  
            : platformVideo === 'erro' &&
              <div className="flex flex-col justify-center items-center">
                <FontAwesomeIcon className="text-pink-600 text-4xl" icon={Fas.faExclamationTriangle}/>
                <p className="text-neutral-300 font-light">Ocorreu um erro ao carregar o seu vídeo</p>
                <p className="text-neutral-300 font-light text-sm">Por favor, cheque seu link e tente novamente!</p>
                <Button btn="info" block type="notline" icon="faExternalLink" name="Checar Vídeo" 
                onClick={()=>{openLinkVideo(linkVideo)}}/>
              </div>}

          <div className="flex justify-end border-t border-slate-600 pt-4">
            <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
          </div>    
        </div>
      </div>
    }/>
  )
}

type EditDescriptionComponent = {
  lessonId:number,
  description:string,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const EditDescription: React.FC<EditDescriptionComponent> = (props) => {
  const [ description, setDescription ] = useState(props.description)
  const updateDescription = async () => {
    try{
      const data = {description:description}
      const r = await api.patch(`editLessonModule/${props.lessonId}`,data)   
      console.log(r)  
      props.close(false)
    }catch(e){console.log(e)}
  }

  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal icon="faEdit" title="Editar descrição da Aula" close={()=>props.close(false)}/>
        <div className="flex flex-col">
        <div className="flex flex-col justify-center my-4">
          <label className="font-semibold italic text-sm text-neutral-300 py-1">Edição de Texto</label>
          <TextEditor text={description} setText={setDescription}/>          
        </div>
          <div className="flex justify-end border-t border-slate-600 pt-4">
            <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
            <Button icon="faFloppyDisk" btn="success" name="Salvar Nova Descrição" onClick={()=>updateDescription()}/>
          </div>    
        </div>
      </div>
    }/>
  )
}

type EditAccessRuleComponent = {
  lessonId:number,
  ruleLesson:ILessonsAccessRule|null,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const EditAccessRule: React.FC<EditAccessRuleComponent> = (props) => {
  const [rule, setRule ] = useState(props.ruleLesson ? props.ruleLesson.rule_access : "L")
  const [days, setDays ] = useState(props.ruleLesson ? props.ruleLesson.days_to_access : 0)
  const [date, setDate ] = useState(props.ruleLesson ? props.ruleLesson.date_of_access : "")
  const updateAccessRule = async () => {
    try{  
      const data = {
        rule_access:rule,
        days_to_access:days,
        date_of_access:date
      }
      const r = await api.patch(`editLessonAccessRule/${props.lessonId}`,data)
      console.log(r) 
      props.close(false) 
    }catch(e){console.log(e)}
  }

  const accessRules = [
    {rule:'L',name:'L - Liberação Imediata'},
    {rule:'D',name:'D - Quanditade de dias após a compra'},
    {rule:'F',name:'F - Data Fixa'},
  ]
  return(
    <Modal className="w-1/3" component={
      <div className="flex flex-col">
        <TitleModal icon="faCalendarCheck" title="Editar Regra de Liberação da Aula" close={()=>props.close(false)}/>
        <div className="flex flex-col">
          <div className="flex flex-col justify-center my-4">
            <SelectForm value={rule} onChange={setRule}
              label="Selecione uma regra de liberação" 
              options={accessRules} lableKey="name" valueKey="rule"/>   

            { rule == 'D' 
              ? 
                <div className="p-4 rounded text-center bg-orange-600/50 border border-orange-500 text-white font-light">
                  <strong>D - Dias após a compra</strong>
                  <InputNumberForm step={1} value={days} onChange={setDays} />
                  <p className="text-xs">A aula estará após a quantidade de dias informados a contar pela data de compra</p>
                </div>
              : rule == 'F'
              ?
                <div className="p-4 rounded text-center bg-red-600/50 border border-red-500 text-white font-light">
                  <strong>F - Data Fixa</strong>
                  <InputForm inputType="date" value={date} onChange={setDate} />
                  <p className="text-xs">A aula estará disponível apenas após a data informada!</p>
                </div>
              :
                <div className="p-4 rounded text-center bg-teal-500 text-white font-light">
                  <strong>L - Liberação Imediata</strong>
                  <p className="text-xs">A aula estará disponível para o aluno assim que ele acessa-la</p>
                </div>}
          </div>
          <div className="flex justify-end border-t border-slate-600 pt-4">
            <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
            <Button icon="faFloppyDisk" btn="success" name="Salvar Nova Regra" onClick={()=>updateAccessRule()}/>
          </div>    
        </div>
      </div>
    }/>
  )
}

type AddAttachmentComponent = {
  course_id:number,
  module_id:number,
  lessonId:number,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const AddAttachment: React.FC<AddAttachmentComponent> = (props) => {
  const [ typeMaterial, setTypeMaterial ] = useState<'file'|'link'|null>(null)
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [link, setLink] = useState("")
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const addLink = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        course_id:props.course_id,
        module_id:props.module_id,
        lesson_id:props.lessonId,
        name:title,
        description:description,
        type:'link',
        material:link,
        status:1
      }
      const r = await api.post('newAttachmentsLesson',data)
      console.log(r.data)
      props.close(false)
    }catch(e){console.log(e)}
  }

  const handleImportSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (file) {
      // Execute a função de callback passando o arquivo, título e descrição
      try{
        const data = {
          course_id:props.course_id,
          module_id:props.module_id,
          lesson_id:props.lessonId,
          name:title,
          description:description,
          type:'arquivo',
          file:file,
          status:1
        }
        console.log('data'),data
        const r = await api.post('uploadFileAttachments',data, { headers: { 'Content-Type': 'multipart/form-data',}})
        console.log(r.data)
        props.close(false)
      }catch(e){console.log(e)}
      

      // Limpe os campos do formulário após o envio
      setFile(null);
      setTitle('');
      setDescription('');
    }
  };

  return(
    <Modal className="w-2/4" component={
      <div className="flex flex-col">
        <TitleModal icon="faPaperclip" title="Inserir Anexo" close={()=>props.close(false)}
                subtitle="Selecione o tipo de material que você deseja adicionar!"/>
        { typeMaterial === null 
        ?
          <div className="flex flex-col">
            <div className="flex  justify-center my-4">
              <Card className="flex-1" component={
                <div className="flex w-full flex-col justify-between items-center">
                  <FontAwesomeIcon className="text-4xl text-teal-500/50 my-2" icon={Fas.faFileArchive}/>
                  <p className="text-teal-500 text-lg">Arquivo</p>
                  <p className="text-neutral-300 text-center font-light text-xs mb-4">
                    Disponibilize arquivos para download em sua plataforma!
                  </p>
                  <Button icon="faUpload" btn="success" type="outline" size="sm" name="Importar Arquivo" onClick={()=>setTypeMaterial('file')}/>
                </div>}/>
                
              <Card className="flex-1" component={
                <div className="flex w-full flex-col justify-between items-center">
                  <FontAwesomeIcon className="text-4xl text-teal-500/50 my-2" icon={Fas.faExternalLink}/>
                  <p className="text-teal-500 text-lg">Link Externo</p>
                  <p className="text-neutral-300 text-center font-light text-xs mb-4">
                    Insira o link de sites, e-books, vídeos, blogs, etc!
                  </p>
                  <Button icon="faExternalLink" btn="success" type="outline" size="sm" name="Inserir Link" onClick={()=>setTypeMaterial('link')}/>
                </div>}/>            
            </div>
            <div className="flex justify-end border-t border-slate-600 pt-4">
              <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
            </div>    
          </div>
        : typeMaterial == "file" 
        ?
          <div className="flex flex-col">
            <form onSubmit={handleImportSubmit}>
              <div className="flex flex-col ">
                <div className="flex py-2 justify-between items-center">
                  <p className="text-white">
                    <FontAwesomeIcon className="text-teal-500 mr-1" icon={Fas.faFileUpload}/>
                    Inserir Arquivo
                  </p>
                  <Button btn="muted" name="Alterar Tipo de Material" type="notline" size="sm" onClick={()=>setTypeMaterial(null)}/>
                </div>
                <div className="flex">
                  <div className="mr-1">                    
                    <InputForm required label="Título" value={title} onChange={setTitle}/>
                  </div>
                  <div className="flex-1">
                    <label className="font-semibold italic text-sm text-neutral-300 py-1">Inserir Arquivo</label>
                    <input type="file" id="fileInput" onChange={handleFileChange} required
                           className={`w-full font-light shadow text-white border rounded-md p-2 placeholder:italic placeholder:font-light placeholder:text-neutral-400 mb-4 bg-neutral-500/20 border-neutral-700 focus:border-b-4 focus:border-x-0 focus:border-t-0 focus:ring-0 focus:border-teal-600 `} 
                           accept=".pdf, .txt, .text, .jpg, .jpeg, .png, .gif" />
                  </div>
                </div>
                <TextAreaForm label="Descrição" value={description} onChange={setDescription}/>
              </div>
              <div className="flex justify-end border-t border-slate-600 pt-4">
                <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
                <Button btn="info" icon="faPlus" name="Inserir Link" submit/>
              </div>  
            </form>
          </div>
        : 
          <div className="flex flex-col">
            <form onSubmit={(e)=>addLink(e)}>
              <div className="flex flex-col ">
                <div className="flex py-2 justify-between items-center">
                  <p className="text-white">
                    <FontAwesomeIcon className="text-teal-500 mr-1" icon={Fas.faExternalLink}/>
                    Inserir Link
                  </p>
                  <Button btn="muted" name="Alterar Tipo de Material" type="notline" size="sm" onClick={()=>setTypeMaterial(null)}/>
                </div>
                <div className="flex">
                  <div className="mr-1">
                    <InputForm required label="Título" value={title} onChange={setTitle}/>
                  </div>
                  <div className="flex-1">
                    <InputForm required label="Link" value={link} onChange={setLink}/>
                  </div>
                </div>
                <TextAreaForm label="Descrição" value={description} onChange={setDescription}/>
              </div>
              <div className="flex justify-end border-t border-slate-600 pt-4">
                <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
                <Button btn="info" icon="faPlus" name="Inserir Link" submit/>
              </div>   
            </form>
          </div>}          
      </div>
    }/>)
}
type DelAttachmentComponent = {
  attachment:IAttachmentsLesson,
  close:React.Dispatch<React.SetStateAction<IAttachmentsLesson|null>>
}
const DelAttachment: React.FC<DelAttachmentComponent> = (props) => {
  const removerAttachment = async () => {
    try{
      const r = await api.delete(`removeAttachmentsLesson/${props.attachment.id}/${props.attachment.lesson_id}}`)
      console.log(r.data)
      props.close(null)
    }catch(e){console.log(e)}
  }
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon="faTrash" title="Remover Anexo" close={()=>props.close(null)}/>
        <div className="flex flex-col my-4">
          <p className="p-2 mb-4 text-white font-light">
            Confirmar remoção do Anexo <b className="text-red-500">{props.attachment.name}</b>?
          </p>
          <div className="flex justify-end border-t border-slate-600 pt-4">
            <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(null)}/>
            <Button btn="error" icon="faTrash" name="Sim, Remover" onClick={()=>removerAttachment()} />
          </div>  
        </div>
      </div>}/>
  )
}


type ChangeStatusComponent = {
  lessonId:number,
  visibility:number,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const ChangeStatus: React.FC<ChangeStatusComponent> = (props) => {
  const changeVisibility = async () => {
    try{
      const data = {visibility:props.visibility}
      const r = await api.patch(`editLessonModule/${props.lessonId}`,data)   
      console.log(r)  
      props.close(false)
    }catch(e){console.log(e)}
  }
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon="faBullhorn" title="Alterar visibilidade da aula" close={()=>props.close(false)}/>
        <div className="flex flex-col my-4">
          <p className="p-2 mb-4 text-white font-light">
            {props.visibility == 1 
            ? "Confirmar Públicação da aula?" 
            : "Deseja Ocultar a visibilidade desta aula?"}
          </p>
          <div className="flex justify-end border-t border-slate-600 pt-4">
            <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
            <Button btn={props.visibility == 1 ? "success" : "error" } icon="faPowerOff" name={props.visibility == 1 ? "Publicar" : "Ocultar" } onClick={()=>changeVisibility()} />
          </div>  
        </div>
      </div>}/>
  )
}


type RemoveLessonComponent = {
  lessonId:number,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const RemoveLesson: React.FC<RemoveLessonComponent> = (props) => {
  const removerLesson = async () => {
    try{
      const data = {status:0}
      const r = await api.patch(`editLessonModule/${props.lessonId}`,data)   
      console.log(r)  
      props.close(false)
    }catch(e){console.log(e)}
  }
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon="faTrash" title="Remover Anexo" close={()=>props.close(false)}/>
        <div className="flex flex-col my-4">
          <p className="p-2 mb-4 text-white font-light">
            Confirmar remoção desta aula?
          </p>
          <div className="flex justify-end border-t border-slate-600 pt-4">
            <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
            <Button btn="error" icon="faTrash" name="Sim, Remover" onClick={()=>removerLesson()} />
          </div>  
        </div>
      </div>}/>
  )
}








{/*

export const LessonSetupOld:React.FC<LessonSetupComponent> = (props) => {
  const [ infoLesson, setInfoLesson ] = useState<ILessonsModule|null>(null)
  const [ editLesson, setEditLesson ] = useState<ILessonsModule|null>(null)
  const [ deletelesson, setDeleteLesson ] = useState<number|null>(null)

  const getInfo = async () => {
    try{
      const i = await api.get(`infoLesson/${props.lessonId}`)
      setInfoLesson(i.data.response)
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{ getInfo()},[editLesson]) 


  return(
    <div className="flex flex-col">
      <Card component={
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center mb-2">
            <p className="text-neutral-100">
              <FontAwesomeIcon className="text-teal-500/50" icon={Fas.faChalkboardTeacher}/> Informações da Aula
            </p>
            <div className="flex">
              <Button icon="faReply" btn="muted" name="Voltar" onClick={()=>props.setLessonSetup(null)}/>
              <Button icon="faEdit" btn="info" name="Editar Informações" onClick={()=>setEditLesson(infoLesson)}/>
            </div>        
          </div>          
        </div>
      }/>
      { infoLesson === null ? <Loading/> 
      :
        <div className="flex">
          <Card className="w-[75%]" component={
            <div className="flex flex-col w-full">
            <p className="text-white font-bold text-lg">{infoLesson.name}</p>
            
            <iframe  
              className="h-full min-h-[50vh] my-2" 
              width="100%" 
              allow="autoplay; fullscreen" 
              src={`https://player.vimeo.com/video/${infoLesson.link}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
        

            <p className="text-white font-light">{infoLesson.description}</p>
            </div>}/>
          
          <div className="flex flex-col w-[25%]">
            <Card component={
              <div className="flex flex-col w-full justify-center  items-center">
                <p className="text-neutral-600/60">Regra de Liberação</p>
              </div>}/>
              <Card component={
                <div className="flex flex-col w-full justify-center  items-center">
                  <p className="text-neutral-600/60">Anexos: </p>
                </div>}/>
              <Card component={
                <div className="flex flex-col w-full justify-center  items-center">
                  <p className="text-neutral-300/60">Ordem: {infoLesson.order}º </p>
                </div>}/>
              <Card component={
                <div className="flex flex-col w-full justify-center  items-center">
                 {infoLesson.visibility == 1 ? <b className="text-teal-500">Público</b>
                 : <b className="text-red-500">Privado</b>}
                </div>}/>
          </div>     
          { editLesson && <EditLesson lesson={infoLesson} setDeleteLesson={setDeleteLesson} setEditLesson={setEditLesson}/>}
          { deletelesson && <DeleteModule lessonId={deletelesson} setLessonSetup={props.setLessonSetup} setDeleteLesson={setDeleteLesson} setEditLesson={setEditLesson}/>}      
      </div>}
    </div>
  )
}
type EditLessonComponent = {
  lesson:ILessonsModule,
  setEditLesson:React.Dispatch<React.SetStateAction<ILessonsModule|null>>,
  setDeleteLesson:React.Dispatch<React.SetStateAction<number|null>>,
}
const EditLesson : React.FC<EditLessonComponent> = (props) => {
  const [ error, setError ] = useState<null | string>(null)
  const link = props.lesson.link
  const [ newLink, setNewLink ] = useState("")
  const [ name, setName ] = useState(props.lesson.name)
  const [ description, setDescription ] = useState(props.lesson.description)
  const [ tags, setTags ] = useState(props.lesson.tags)
  const [ order, setOrder ] = useState(props.lesson.order)
  const [ visibility, setVisibility ] = useState(props.lesson.visibility)  
  const typeVisibility = [
    {type:1,name:'Público'},
    {type:0,name:'Privado'}
  ]
  
  const saveEditLesson = async (e:FormEvent) => {
    e.preventDefault()
    const match = newLink.match(/vimeo\.com\/(\d+)/);
    try{
      const data = {        
        link:newLink ? match ? match[1] : '0' : link,
        name:name,
        description:description ? description : "",
        tags:tags ? tags : "",
        order:order,
        visibility:typeof visibility == 'string' ? parseInt(visibility,10) : visibility, 
      }
      const response = await api.patch(`editLessonModule/${props.lesson.id}`,data)
      if (response && response.data && response.data.success) {
        props.setEditLesson(null)
      } else {
        console.log(response.data.error)
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }
  }

  
  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal icon="faEdit" title="Edite as informções da Aula" close={()=>props.setEditLesson(null)}/>
        <form onSubmit={(e)=>saveEditLesson(e)}>
          { newLink 
          ? <div className="flex flex-col p-2"><p className="text-white">Novo Vídeo</p><RenderVideo link={newLink}/></div>
          : props.lesson.link ? <iframe  
                    className="h-full min-h-[30vh] my-2" 
                    width="100%" 
                    allow="autoplay; fullscreen" 
                    src={`https://player.vimeo.com/video/${props.lesson.link}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
   
          : <div className="flex flex-col justify-center items-center p-4 bg-neutral-900 my-4 rounded">
              <FontAwesomeIcon className="text-6xl text-neutral-800 h-32" icon={Fas.faVideo}/>
            </div>} 

        <div className="flex flex-col min-w-[400px] p-4 mt-2 justify-center items-center">
          <div className="flex flex-col w-full">
          <div className="flex w-full">
            <InputForm className="mr-1" label="Substituir Link do Vídeo" placeholder="Insira o novo link do seu vídeo" value={newLink} onChange={setNewLink} />
            <InputForm className="ml-1" required label="Título de Aula" value={name} onChange={setName} />
          </div>
          <div className="flex w-full">
            <TextAreaForm className="mr-1" label="Descrição" value={description} onChange={setDescription} />
            <TextAreaForm className="ml-1" label="Tags" value={tags} onChange={setTags} />
          </div>
          <div className="flex w-full">
            <SelectForm className="mr-1" label="Visibilidade" options={typeVisibility} lableKey='name' valueKey='type' value={visibility} onChange={setVisibility}/>
            <InputNumberForm className="ml-1" label="Ordem de Exibição" min={1} step={1} value={order} onChange={setOrder} />
          </div>
        </div>  
        </div>
        
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
          <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.setEditLesson(null)} />
          <Button btn="error" name='Remover' icon='faTrash' onClick={()=>props.setDeleteLesson(props.lesson.id)} />
          <Button btn="success" icon="faFloppyDisk" name='Salvar Alterações da Aula' submit />
        </div>
      </form>
      </div>
    }/>
  )
}
type DeleteLessonComponent = {
  lessonId:number,
  setEditLesson:React.Dispatch<React.SetStateAction<ILessonsModule|null>>,
  setDeleteLesson:React.Dispatch<React.SetStateAction<number|null>>,
  setLessonSetup:React.Dispatch<React.SetStateAction<null | number>>,
}
const DeleteModule : React.FC<DeleteLessonComponent> = (props) => {
  const removeLesson = async () => {
    try{
      const data = { "status":0 }
      await api.patch(`editLessonModule/${props.lessonId}`, data) 
    }catch(e){console.log(e)}
    props.setDeleteLesson(null)
    props.setEditLesson(null)
    props.setLessonSetup(null)
  }

  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon="faTrash" title="Remover Módulo" close={()=>props.setDeleteLesson(null)}/>
        <p className="text-white font-xl mt-8 mx-4 mb-4">
          Confirmar a remoção desta aula?
        </p>
        <div className="flex border-t mt-4 p-2 justify-end items-center">
          <Button name="Cancelar" btn="muted"  type='outline' onClick={()=>props.setDeleteLesson(null)} />
          <Button name="Sim, Remover" icon="faTrash" btn="error" onClick={()=>removeLesson()} /> 
        </div> 
      </div>
    }/>
  )
}
type RenderVideoComponent = {
  link:string
}
const RenderVideo: React.FC<RenderVideoComponent> = (props) => {
  const [idVideo, setIdVideo ] = useState<string|null>(null)
  const getVimeoVideoId = () => {
    const match = props.link.match(/vimeo\.com\/(\d+)/);
    setIdVideo(match ? match[1] : "");
  };


  useEffect(()=>{
    getVimeoVideoId()
  },[props.link])

  return(
    <div className="flex justify-center items-center ">
      {idVideo === null ? <Loading/>
      : idVideo ?
        <>
          <iframe  
              className="h-full min-h-[30vh] my-2" 
              width="100%" 
              allow="autoplay; fullscreen" 
              src={`https://player.vimeo.com/video/${idVideo}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
        
          <div className="flex flex-col text-white mx-2 px-2">
            <p  className="text-4xl text-sky-400"> <FontAwesomeIcon icon={Fab.faVimeo}/> Vimeo</p>
            <p className="text font-light">Verifique se o vídeo foi carregado corretamente</p>
            <p className="text-xs font-light">Se sim clique em Prosseguir, caso contrário, verifique se seu link esta correto ou tente inserir um link diferente!
            </p>
          </div>
        </>
      : <div className="flex flex-col justify-center items-center p-8">
          <FontAwesomeIcon className="text-pink-500/50 text-4xl my-4" icon={Fas.faVideoSlash}/>
          <p className="text-white">Ocorreu uma falha ao carregar seu vídeo</p>
          <p className="text-slate-200 font-light text-sm">Cheque o link do seu vídeo novamente para prosseguir!</p>
        </div>
}
     
    </div>
  )
}
*/}

