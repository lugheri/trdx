import { Card } from "../../../../../components/Cards"
import * as Fab from "@fortawesome/free-brands-svg-icons";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../../../../components/Buttons";
import { FormEvent, useEffect, useState } from "react";
import { ILessonsModule } from "../../Dtos/courses.dto";
import api from "../../../../../services/api";
import { Loading } from "../../../../../components/Loading";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { InputForm, InputNumberForm, SelectForm, TextAreaForm } from "../../../../../components/Inputs";

type LessonSetupComponent = {
  setLessonSetup:React.Dispatch<React.SetStateAction<number|null>>,
  lessonId:number
}
export const LessonSetup:React.FC<LessonSetupComponent> = (props) => {
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


