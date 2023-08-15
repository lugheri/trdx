import { useState, useEffect } from 'react';
import { Card } from "../../components/Cards"
import { TitlePage } from "../../components/Template/TitlePage"
import useAuth from "../../hooks/useAuth"
import { User,Student } from '../../contexts/Dtos/auth.dto';
import { IMyCourses } from '../Dtos/courses.dto';
import api from '../../services/api';
import { Loading } from '../../components/Loading';
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { urlBase } from '../../utils/baseUrl';

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
  useEffect(()=>{
    userData ? getMyCourses()
    : false
  },[userData])

  return(
      <div>
        <TitlePage 
          icon="faChalkboard" 
          title="Meus Cursos" 
          description="Acesse seus cursos por aqui"/>
          <Card component={
            <div className="overflow-x-hidden overflow-y-auto w-full h-[77vh] flex flex-wrap">
                { listMyCourses === null ? <Loading/> : listMyCourses.length == 0 ? <Empty/> : 
                  listMyCourses.map((course,key)=>(<Course key={key} infoCourse={course} userId={userData? userData.id : 0}/>
                ))}              
            </div>
          }/>
    </div>
  )
}

const Course : React.FC<{infoCourse:IMyCourses;userId:number}> = (props) => {
  const [ fileImage, setFileImage ] = useState(null)
  useEffect(()=>{
    const getInfoImage = async () => {
      try{
        const i = await api.get(`infoFile/${props.infoCourse.image}`)
        setFileImage(i.data.response.file)
        
      }catch(e){
        console.log(e)
      }
    }
    getInfoImage()
  },[props.infoCourse])

  const [ progress, setProgress] = useState(0);
  useEffect(()=>{
    const getProgress = async () => {
      try{
        const prog = await api.get(`progressCourse/${props.infoCourse.id}/${props.userId}`)
        setProgress(prog.data.response)        
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
      }catch(e){
        console.log(e)
      }
    }
    checkValidity()
  },[props.infoCourse])

  

  return (
    <div className="flex relative flex-col m-2 mb-2 w-[210px] max-h-[230px]  justify-center items-center rounded opacity-80 hover:opacity-100 cursor-pointer">      
      { validityCourse == 'expired' ? <div className="absolute w-full h-[220px] flex justify-center items-center -top-4 left-0 bg-black opacity-80 text-white font-bold text-4xl">EXPIRADO</div>: false }
      { fileImage ? <img className="w-auto rounded shadow"  src={`${urlBase}/gallery/${fileImage}`}/> : <Loading/> }
      {/*Progress Bar */}
      <div className="flex w-full justify-center items-center py-2">
        <div className="flex-1 flex bg-slate-800 h-2 rounded-md w-full overflow-hidden">
          <div className={`h-full bg-green-500`} style={{width:progress+'%'}}>
          </div>
        </div>
        <div className="text-xs font-bold text-slate-400 dark:text-slate-300 pl-1">
          {progress}% Concluído
        </div>
      </div>
    </div>
  )
}

const Empty = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full w-full text-slate-400 dark:text-slate-200">
      <FontAwesomeIcon className="text-3xl opacity-60 mb-2" icon={Fas.faFaceFrown}/> 
      <p>Parece que você ainda não possui nenhum curso</p>
    </div>
  )
}

