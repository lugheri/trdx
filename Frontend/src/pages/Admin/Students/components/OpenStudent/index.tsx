import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IStudent } from "../../Dtos/student.dto";
import api from "../../../../../services/api";

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import moment from 'moment';
import { LoadingBars } from "../../../../../components/Loading";
import { Card } from "../../../../../components/Cards";
import { CoursesStudent } from "./CoursesStudent";
import { CommentStudent } from "./CommentsStudent";
import { SideStudent } from "./SideStudent";

interface ILastAccess{
  id:number;
  date:string;
  hour:number;
  student_id:number;
  nactioname:string;
}

export const OpenStudent = () => {
  const location = useLocation();
  const studentId = location.pathname.split('/')[5] 

  const [addCourses, setAddCourses] = useState<number|null>(null)
  const [ updateStudent, setUpdateStudent] = useState(0)

  const [ infoStudent, setInfoStudent ] = useState<IStudent|null>(null)
  const getInfoUser = async () => {
    try{
      const info = await api.get(`getStudent/${studentId}`)
      setInfoStudent(info.data.response)
    }catch(err){
      console.log(err)
    }
  }

  const [ lastAccess, setLastAccess ] = useState<ILastAccess|false|null>(false)
  const getLastAccess = async () => {
    try{
      const access = await api.get(`lastStudentAccess/${studentId}`)
      setLastAccess(access.data.response)
    }catch(err){
      console.log(err)
    }
  }  

  useEffect(()=>{   
    getInfoUser()
    getLastAccess()
    setUpdateStudent(0)    
  },[addCourses,updateStudent])

  const formatDate = (date:string) => {
    return moment(date).format('DD/MM/YY HH:mm');
  }
  

  return(
    <>
      { infoStudent === null 
        ? <LoadingBars/>
        : <div className="flex h-full overflow-hidden">
            <div className="flex flex-col flex-1 overflow-auto">
              {/*Dada Students */}
              <div className="flex">
                { infoStudent.status === 0 
                  ? <div className="flex flex-1 justify-center items-center bg-neutral-800 shadow-red-800 border border-red-500 shadow-md m-2 p-4 rounded">
                      <FontAwesomeIcon className="text-4xl mr-3 font-bold text-red-600" icon={Fas.faBan}/>
                      <div>
                        <p className="text-lg font-bold text-red-500">Acesso Inativo</p>
                        <p className="text-xs font-bold text-red-700">O acesso deste aluno esta bloqueado!</p>                
                      </div>
                    </div>
                  : infoStudent.community == 1 
                    ? <div className="flex flex-1 justify-center items-center bg-neutral-800 shadow-green-800 border border-teal-500 shadow-md m-2 p-4 rounded">
                        <FontAwesomeIcon className="text-4xl mr-3 font-bold text-teal-500" icon={Fas.faUsers}/>
                        <div>
                          <p className="text-lg font-bold text-teal-500">Comunidade</p>
                          <p className="text-xs font-bold text-teal-700">Este aluno é membro da comunidade</p>                
                        </div>
                      </div>
                    : <div className="flex flex-1 justify-center items-center bg-neutral-800 shadow-sky-800 border border-sky-500 shadow-md shadow-md m-2 p-4 rounded">
                        <FontAwesomeIcon className="text-4xl mr-3 font-bold text-sky-500" icon={Fas.faUserCircle}/>
                        <div>
                          <p className="text-lg font-bold text-sky-500">Aluno Convencional</p>
                          <p className="text-xs font-bold text-sky-700">Tipo de Acesso</p>                
                        </div>
                      </div>}

                <Card component={
                  <div className="flex flex-col">
                    <p className="text-neutral-400 text-sm">                      
                      <strong>Aluno Desde: </strong>{formatDate(infoStudent.since)} 
                    </p>
                    <p className="text-white">
                      <strong>Último Acesso: </strong>
                      { lastAccess 
                        ? <span className="text-green-500 font-bold">{formatDate(`${lastAccess.date} ${lastAccess.hour}`)}</span> 
                        : lastAccess === null 
                          ? <span className="text-teal-500"> - </span>  
                          : <FontAwesomeIcon icon={Fas.faCircleNotch} className="text-green-500" pulse/> } 
                    </p>
                  </div>}/>

                  <NavLink 
                    className="flex justify-center m-1 my-2 items-center text-center cursor-pointer font-semibold text-neutral-400 hover:text-neutral-900 hover:bg-neutral-400  border border-neutral-400 p-2 text-sm rounded-md"
                    to={`/admin/students/actives/`}>
                    <FontAwesomeIcon icon={Fas.faReply}/> Voltar
                  </NavLink>
              </div>

              <CoursesStudent infoStudent={infoStudent} 
                addCourses={addCourses} setAddCourses={setAddCourses}/>
              <CommentStudent infoStudent={infoStudent}/>             
            </div>
            {/*Side Students */}
            <SideStudent infoStudent={infoStudent} setUpdateStudent={setUpdateStudent}/>
          </div>}
    </>
  )
}