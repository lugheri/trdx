import { useState, useEffect } from 'react';
import Banner from '/img/banner-home-2.png'
import { ICourse, ILessons, IMyCourses } from '../Dtos/courses.dto';
import useAuth from '../../../hooks/useAuth';
import { Student } from '../../../contexts/Dtos/auth.dto';
import api from '../../../services/api';
import { Loading } from '../../../components/Loading';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { urlBase } from '../../../utils/baseUrl';
import { useNavigate } from 'react-router-dom';


export const Home = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null  

  const homeVideo='797995639'
  const textHtml = `
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-weight: bolder;">
        <span style="font-size: 12pt; font-family: Montserrat; color:white;">
          :: PROGRAMAÇÃO DAS SALAS DE TRADE AO VIVO<br><br><br>SALA DE TRADE AO VIVO - DIURNA
        </span>
      </span>
      <span style="font-size: 12pt; font-family: Montserrat;"><o:p></o:p></span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify;line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat;">&nbsp;</span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="color: white; font-family: Montserrat; font-size: 12pt;">
        Segunda a Sexta às 10h de Brasília.
      </span><br>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat;">&nbsp;</span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat; color: white;">
        <span style="color: rgb(114, 124, 245);">
          <a href="https://us06web.zoom.us/j/82663172724">Aperta aqui</a>
        </span>
        <a href="https://us02web.zoom.us/j/82360488633">
          <span style="font-family: Cambria, serif; color: rgb(114, 124, 245);">&nbsp;</span>
        </a>
      </span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white;">
        para assistir&nbsp;
        <span style="font-weight: bolder;">no dia e hora marcado</span>.<o:p></o:p>
      </span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;"><br></p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;"><br></p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-weight: bolder;">
        <span style="font-size: 12pt; font-family: Montserrat; color: white;">
          SALA DE TRADE AO VIVO - NOTURNA
        </span>
      </span>
      <span style="font-size: 12pt; font-family: Montserrat;"><o:p></o:p></span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat; color: white;">
        <br>Quarta-feira 19/07 às 22h de Brasília.<br><br>
      </span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white;">
        <span style="color: rgb(114, 124, 245);">
          <a href="https://us06web.zoom.us/j/89771105722">Aperta aqui</a>
        </span>
        <a href="https://us02web.zoom.us/j/85743430223">
          <span style="font-family: Cambria, serif; color: rgb(114, 124, 245);">&nbsp;</span>
        </a>
      </span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white;">para assistir&nbsp;
      <span style="font-weight: bolder;">no dia e hora marcado</span>.<o:p></o:p>
      </span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat; color: white;"><br></span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify;line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat; color: white;"><br></span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-size: 14.4px; font-weight: bolder;">
        <span style="font-size: 12pt; font-family: Montserrat; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">
          Obs.:
        </span>
      </span>
      <span style="font-size: 12pt; font-family: Cambria, serif; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">&nbsp;</span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">
        Todas as salas são gravadas, para assistir
      </span>
      <span style="font-size: 12pt; font-family: Cambria, serif; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">&nbsp;</span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">
      acesse "Gravações Sala" 
      </span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">
        disponível aqui na área de alunos.
      </span>
    </p>`


  const [ nextLessonId, setNextLessonId ] = useState<number|null>(null)

  useEffect(()=>{
    const getNextLesson = async () => {
      try{
        const nextLesson = await api.get(`lastLessonViewed/${userData ? userData.id : 0}`)          
        setNextLessonId(nextLesson.data.response)
      }catch(err){
        console.log(err)
      }
    }
    getNextLesson()
  },[])

  return(
    <div className="flex flex-col items-center py-2 p-4">    
      <div className="w-full h-[275px] rounded-t-3xl relative overflow-hidden">
        <img src={Banner} className="w-full my-2 rounded-t-3xl absolute"/> 
        <div className="bg-gradient-to-b from-transparent via-transparent to-[#070707] w-full flex absolute z-10 absolute h-full">
        </div>
      </div>

      <div className="flex flex-col md:flex-row my-8 w-full">
        <div className="w-full md:w-[40%]">
          <iframe 
            className="h-full min-h-[40vh] rounded-md overflow-hidden" 
            width="100%" 
            allow="autoplay; fullscreen" 
            src={`https://player.vimeo.com/video/${homeVideo}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
        </div>
        <div className="flex flex-1 p-4">
          <div dangerouslySetInnerHTML={{ __html:textHtml}}/>
        </div>
      </div>

      { nextLessonId && <NextLesson lessonId={nextLessonId}/> } 
      <MyCourses studentId={userData ? userData.id : 0} />     
            
    </div>
  )
}

const NextLesson: React.FC<{lessonId:number}> = ({lessonId}) => {
  const [infoLesson, setInfoLesson] = useState<ILessons | null>(null); // Inicializa com null ou um valor padrão apropriado

  useEffect(()=>{
    const infoNextLesson = async () => {
      const info = await api.get(`/infoLesson/${lessonId}`)
      setInfoLesson(info.data.response)
    }
    infoNextLesson()
  },[])
  return (
    <div className="flex flex-col md:flex-row w-full my-8 justify-start items-center">
      <div className="w-full mb-4 md:w-[40%] h-[200px] flex justify-center items-center bg-slate-900 mx-4 text-neutral-600">CAPA</div>
      <div className="flex flex-col justify-start items-center md:items-start">
        <p className="text-neutral-100 font-bold text-xl w-full text-center md:text-left">{infoLesson?.name}</p>
        <p className="text-neutral-100 font-light mt-4 w-full text-center md:text-left">{infoLesson?.description} sem descrição de curso</p>
        <button 
                className="bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow-lg py-2 px-4 text-center my-2 rounded shadown text-sm font-semibold">
          <FontAwesomeIcon className="opacity-50" icon={Fas.faPlay}/> Continuar Conteúdo
        </button>
      </div>        
    </div>
  )
}

const MyCourses: React.FC<{studentId:number}> = ({studentId}) => {
  const [ listMyCourses, setListMyCourses ] = useState<IMyCourses[]|null>(null)
  const getMyCourses = async () => {
    try{
      const mc = await api.get(`myCourses/${studentId}`)
      setListMyCourses(mc.data.response)
    }catch(e){
      console.log(e)
    }    
  }
  useEffect(()=>{ getMyCourses()},[])
  return (
    <div className="flex flex-wrap">
     { listMyCourses === null ? <Loading/> : listMyCourses.length == 0 ? <Empty/> : 
       listMyCourses.map((course,key)=>(<Course key={key} infoCourse={course} userId={studentId}/>
      ))}     
    </div>
  )
}

const Course : React.FC<{infoCourse:IMyCourses;userId:number}> = (props) => {
  //const [ fileImage, setFileImage ] = useState(null)
  const [ dataCourse, setDataCourse ] = useState< ICourse | null>(null)
  useEffect(()=>{
    const getDataCourse = async () => {
      try{
        const prog = await api.get(`infoCourse/${props.infoCourse.id}`)
        setDataCourse(prog.data.response)        
      }catch(e){
        console.log(e)
      }
    }
    getDataCourse()
  },[])


  const [ validityCourse, setValidityCourse] = useState(null);
  useEffect(()=>{
    const checkValidity = async () => {
      try{
        const contract = await api.get(`validityCourse/${props.infoCourse.id}/${props.userId}`)
        setValidityCourse(contract.data.response)    
        console.log(validityCourse)    
      }catch(e){
        console.log(e)
      }
    }
    checkValidity()
  },[props.infoCourse])

  const navigate = useNavigate();
  
  const openCourse = () => {
    const hash_CourseId: string = btoa(`[{"courseId":"${props.infoCourse.id}"}]`);
    navigate(`/classRoom/course/${hash_CourseId}`)
  }  

  return(
    <div onClick={()=>openCourse()}
         className="flex flex-col p-2 w-full px-3 mb-4 md:w-[24%] md:mx-[.25%] md:mb-1 opacity-90 cursor-pointer hover:opacity-100">
      <div className="bg-slate-300 w-full h-32 rounded-xl flex justify-center items-center overflow-hidden">
        <RenderImage className="w-full h-full" imageId={props.infoCourse.image}/>
      </div> 
      <p className="text-white text-sm mb-2 font-bold min-h-[50px] flex items-center">{dataCourse?.name}</p>
      
    </div>
  )
}

const RenderImage : React.FC<{className:string,imageId:number}> = (props) => {
  const [ fileImage, setFileImage ] = useState(null)

  useEffect(()=>{
    const getInfoImage = async () => {
      try{
        const i = await api.get(`infoFile/${props.imageId}`)
        setFileImage(i.data.response.file)
      }catch(e){
        console.log(e)
      }
    }
    getInfoImage()
  },[props.imageId])

  return(
    fileImage == null ? <Loading/> : 
    <div 
      className={props.className} 
      style={{backgroundImage:`url(${urlBase}/gallery/${fileImage})`,
              backgroundSize:'cover',
              backgroundPosition:'center'}}/>
  )
}


const Empty = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full  text-slate-400 dark:text-slate-200">
      <FontAwesomeIcon className="text-3xl opacity-60 mb-2" icon={Fas.faFaceFrown}/> 
      <p>Parece que você ainda não possui nenhum curso</p>
    </div>
  )
}