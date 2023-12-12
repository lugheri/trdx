import { useEffect, useState,FormEvent } from "react"
import { ILessonsModule, IModuleCourse } from "../../Dtos/courses.dto"
import api from "../../../../../services/api"
import { Card } from "../../../../../components/Cards"
import { Loading } from "../../../../../components/Loading"
import { Button } from "../../../../../components/Buttons"
import * as Fab from "@fortawesome/free-brands-svg-icons";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputForm } from "../../../../../components/Inputs"
import { Modal, TitleModal } from "../../../../../components/Modal"
import { LessonsOrder } from "./LessonsOrder"


type LessonsModuleComponent = {
  setupLesson:number|null,
  infoModule:IModuleCourse,
  setSetupLessonModule: React.Dispatch<React.SetStateAction<null | number>>
}
export const LessonsModule: React.FC<LessonsModuleComponent> = (props)=> {
  const [ lessons, setLessons ] = useState<null | ILessonsModule[]>(null)
  const [ error, setError ] = useState<null | string>(null)
  const [ newLesson, setNewLesson ] = useState<null | number>(null)  
  const [ orderLesson, setOrderLesson ] = useState<null | number>(null)

  const getLesson = async () => {
    try{
      const response = await api.get(`lessonsModule/${props.infoModule.id}`)
      if (response && response.data && response.data.success) {
        setLessons(response.data.response)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{ getLesson()},[newLesson,props.setupLesson,orderLesson])

  return(
    <Card component={ 
      <div className="flex flex-col  w-full">
        { error ? <p className="text-red-500">{error}</p>
          : lessons === null ? <Loading/> 
            : lessons.length === 0 
              ? <div className="flex flex-col justify-center items-center w-full p-4 ">
                  <FontAwesomeIcon className="text-teal-500/60 text-4xl my-2" icon={Fas.faChalkboardTeacher}/>
                  <p className="text-white font-light my-4">Este módulo ainda não possui nenhuma aula</p> 
                  <Button name="Criar Nova Aula" btn="success" type="outline" icon="faPlus" onClick={()=>setNewLesson(props.infoModule.id)}/>
         
                </div>
              : <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <p className="text-neutral-100">
                      <FontAwesomeIcon className="text-teal-500/50" icon={Fas.faChalkboardTeacher}/> Aulas do Módulo: {lessons.length}
                    </p>
                    <div className="flex">
                      <Button name="Reordenar Aulas" btn="success" type="notline" icon="faSortNumericAsc" onClick={()=>setOrderLesson(props.infoModule.id)}/>
                      <Button name="Criar Nova Aula" btn="success" icon="faFolderPlus" onClick={()=>setNewLesson(props.infoModule.id)}/>
                    </div>
                  </div>              
                  <div className="flex bg-neutral-950/50 flex-wrap rounded my-2 p-2">
                    {lessons.map((lesson,key)=><LessonItem key={key} lesson={lesson} setSetupLesson={props.setSetupLessonModule}/>)}
                  </div>
                  {orderLesson && <LessonsOrder module_id={orderLesson} order_module={props.infoModule.order} lessons={lessons} close={setOrderLesson}/> }                 
                </div>}
      {newLesson && <NewLesson course_id={props.infoModule.course_id}  moduleId={newLesson} moduleOrder={props.infoModule.order} setNewLesson={setNewLesson} totalLessons={lessons ? lessons.length : 0}/>}      
    </div>}/>
  )
}


type LessonItemComponent = {
  lesson:ILessonsModule,
  setSetupLesson: React.Dispatch<React.SetStateAction<null | number>>
}
const LessonItem : React.FC<LessonItemComponent> = (props) => {
  return(
    <div className={`flex justify-between items-center w-full py-2 px-2 m-1 rounded bg-gray-800/50 hover:bg-gray-800
                     border ${props.lesson.visibility == 1 ? "border-teal-500" : "border-red-500" }`}>
      <FontAwesomeIcon className="opacity-50 text-teal-500 text-2xl mx-2" icon={Fas.faChalkboardTeacher}/>
      
      <div className="flex flex-col justify-center text-white">
        <p className="text-white text-sm text-center"><b>Cód.: </b>{props.lesson.id}</p>
        <p className=" text-white font-light text-xs text-center">{props.lesson.type_lesson}</p>
      </div>
      <div className="flex flex-col w-1/2 text-white">
        <p>{props.lesson.name}</p>
        <p className="font-light text-xs">{props.lesson.name}</p>
      </div>
      <div className="flex flex-col text-center text-white">
        <p>{props.lesson.order}°</p>
        <p className="font-light text-xs">ordem</p>
      </div> 
      <Button icon="faEdit" btn="success" name="Editar Aula" type="notline" onClick={()=>props.setSetupLesson(props.lesson.id)} />
    </div>
  )
}

type NewLessonComponent = {
  course_id:number,
  moduleId:number,
  moduleOrder:number,
  setNewLesson: React.Dispatch<React.SetStateAction<null | number>>,
  totalLessons:number
}
const NewLesson : React.FC<NewLessonComponent> = (props) => {
  const [ error, setError ] = useState<null | string>(null)
  //const [ typeLesson, setLesson ] = useState<null|string>('Aula')
  //const [ typeContent, setTypeContent ] = useState<null|string>('video')
  const [ link, setLink ] = useState("")
  const [ name, setName ] = useState("")
  const [ order, setOrder ] = useState(0)
  const nextOrder = async () => {
    try{
      const res = await api.get(`/nextLessonOrder/${props.moduleId}`)
      setOrder(res.data.response)
    }catch(err){console.log(err)}
  }

  useEffect(()=>{
    nextOrder()
  },[])

  const saveNewLesson = async (e:FormEvent) => {
    e.preventDefault()
    const match = link.match(/vimeo\.com\/(\d+)/);

    await nextOrder()

    try{
      const data = {
        course_id:props.course_id,
        module_id:props.moduleId,
        type_lesson:'Aula',
        type_content:'video',
        link:match ? match[1] : '0',
        video_platform:'vimeo',
        name:name,
        order:order,
        visibility:0    
      }
      const response = await api.post('newLessonModule/',data)
      if (response && response.data && response.data.success) {
        props.setNewLesson(null)
      } else {
        console.log(response.data.error)
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }

  }

  return(
    <Modal component={
      <div className="flex flex-col w-[50vw]">
        <TitleModal icon="faPlus" title="Cadastrar Nova Aula" close={()=>props.setNewLesson(null)}/>
        <form onSubmit={(e)=>saveNewLesson(e)}>
          { link ? 
            <RenderVideo link={link}/>
          : <div className="flex flex-col justify-center items-center p-4 bg-neutral-900 my-4 rounded">
              <FontAwesomeIcon className="text-6xl text-neutral-800 h-32" icon={Fas.faVideo}/>
            </div>}
          
          <InputForm  required label="Nome da Aula" value={name} onChange={setName} />
          <InputForm required label="Link do Vídeo" value={link} onChange={setLink} />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
            <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.setNewLesson(null)} />
            <Button btn="info" icon="faPlay" name='Prosseguir' submit />
          </div>
        </form>
      </div>}/>   
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


