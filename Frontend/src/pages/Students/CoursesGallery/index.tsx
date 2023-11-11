import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth"

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TitlePage } from "../../../components/Template/TitlePage"
import { Student } from '../../../contexts/Dtos/auth.dto';
import { ICourse, IMyCourses } from '../Dtos/courses.dto';
import api from '../../../services/api';
import { Loading } from '../../../components/Loading';
import { urlBase } from '../../../utils/baseUrl';

export const CoursesGallery = () => {
  const authenticated = useAuth(); 
  const userData:Student|null = authenticated ? authenticated.userData : null

  const [ listMyCourses, setListMyCourses ] = useState<IMyCourses[]|null>(null)
  const getMyCourses = async () => {
    try{
      const mc = await api.get(`myCourses/${userData?.id}`)
      setListMyCourses(mc.data.response)
    }catch(e){
      console.log(e)
    }    
  }
  useEffect(()=>{ userData ? getMyCourses() : false },[userData])

  return(
    <div className="ml-28 mr-4">
      <TitlePage title="Meus cursos"/>
      <div className="flex">
        <div className="overflow-x-hidden overflow-y-auto w-full h-[77vh] flex flex-wrap">
          { listMyCourses === null ? <Loading/> : listMyCourses.length == 0 ? <Empty/> : 
            listMyCourses.map((course,key)=>(<Course key={key} infoCourse={course} userId={userData? userData.id : 0}/>
          ))}              
        </div>
      </div>     
    </div>
  )
}

const Course : React.FC<{infoCourse:IMyCourses;userId:number}> = (props) => {
  //const [ fileImage, setFileImage ] = useState(null)
  const [ progress, setProgress] = useState(0);

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

  useEffect(()=>{
    const getProgress = async () => {
      try{
        const prog = await api.get(`progressCourse/${props.infoCourse.id}/${props.userId}`)
        setProgress(prog.data.response)      
        console.log(progress)  
      }catch(e){
        console.log(e)
      }
    }
    getProgress()
  },[props.infoCourse])

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

  const [ progressCourse, setProgressCourse] = useState(0);
  useEffect(()=>{
    const getProgressCourse = async () => {
      try{
        const prog = await api.get(`progressCourse/${props.infoCourse.id}/${props.userId}`)
        setProgressCourse(prog.data.response)        
      }catch(e){
        console.log(e)
      }
    }
    getProgressCourse()
  },[])
  

  return(
    <div onClick={()=>openCourse()}
         className="flex flex-col p-2 w-full px-3 mb-4 md:w-[24%] md:mx-[.25%] md:mb-1 opacity-90 cursor-pointer hover:opacity-100">
      <div className="bg-slate-300 w-full h-32 rounded-xl flex justify-center items-center overflow-hidden">
        <RenderImage className="w-full h-full" imageId={props.infoCourse.image}/>
      </div> 
      <p className="text-white text-sm mb-2 font-bold min-h-[50px] flex items-center">{dataCourse?.name}</p>
      <p className="text-gray-100 text-xs font-light">{progressCourse}% concluido</p>
      <div className="w-1/2 md:w-full h-[10px] p-[1px]  mb-4 bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] rounded-md shadow">
        <div className="w-full h-full bg-neutral-900 rounded-md shadow overflow-hidden"> 
          <div className="h-full  bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] rounded duration-1000 ease-out" style={{width:`${progressCourse}%`}}></div>
        </div>
      </div>
      <p className="text-white text-sm font-thin md:min-h-[150px] flex items-start">{dataCourse == null ? "" : dataCourse.description.length > 150 ? dataCourse.description.slice(0, 145) + ' . . . ' : dataCourse.description}</p>
    </div>
   
   
   /* <div onClick={()=>openCourse()}
      className="flex relative flex-col m-2 mb-2 w-[210px] max-h-[230px] justify-center items-center rounded opacity-80 hover:opacity-100 cursor-pointer">      
      { validityCourse == 'expired' ? <div className="absolute w-full h-[220px] flex justify-center items-center -top-4 left-0 bg-black opacity-80 text-white font-bold text-4xl">EXPIRADO</div>: false }
      { fileImage ? <img className="w-auto rounded shadow"  src={`${urlBase}/gallery/${fileImage}`}/> : <Loading/> }
      <div className="flex w-full justify-center items-center py-2">
        <div className="flex-1 flex bg-slate-800 h-2 rounded-md w-full overflow-hidden">
          <div className={`h-full bg-green-500`} style={{width:progress+'%'}}>
          </div>
        </div>
        <div className="text-xs font-bold text-slate-400 dark:text-slate-300 pl-1">
          {progress}% Concluído
        </div>
      </div>
    </div>*/
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

