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
            <div className="overflow-auto w-full h-[77vh] flex-wrap flex ">
                { listMyCourses === null ? <Loading/> : listMyCourses.length == 0 ? <Empty/> : 
                  listMyCourses.map((course,key)=>(<Course key={key} infoCourse={course}/>
                ))} 
            </div>
          }/>
    </div>
  )
}

const Course : React.FC<{infoCourse:IMyCourses}> = (props) => {
  return (
    <div className="bg-white m-1 rounded shadow flex justify-center items-center text-center w-[200px] h-[200px]">
      {props.infoCourse.name}
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