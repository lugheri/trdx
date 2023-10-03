import { useState, useEffect } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { Card } from "../../../../components/Cards";
import { StudentProfilePhoto } from "../../../../components/StudentProfilePhoto";
import { Button } from "../../../../components/Buttons";
import { IStudent } from '../Dtos/student.dto';
import api from '../../../../services/api';
import { Loading } from '../../../../components/Loading';
import moment from 'moment';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IFileGallery } from '../../../Students/Dtos/gallery.dto';
import { urlBase } from '../../../../utils/baseUrl';

interface ILastAccess{
  id:number;
  date:string;
  hour:number;
  student_id:number;
  nactioname:string;
}

interface ICourses{
  id:number;
  image:number;
  name:string;
}

export const StudentInfo = () => {
  const location = useLocation();
  const studentId = location.pathname.split('/')[5] 

  const [ infoStudent, setInfoStudent ] = useState<IStudent|null>(null)
  const [ lastAccess, setLastAccess ] = useState<ILastAccess|null>(null)
  const [ courses, setCourses ] = useState<ICourses[]|null>(null)
  useEffect(()=>{
    const getInfoUser = async () => {
      try{
        const info = await api.get(`getStudent/${studentId}`)
        setInfoStudent(info.data.response)
      }catch(err){
        console.log(err)
      }
    }
    const getLastAccess = async () => {
      try{
        const access = await api.get(`lastStudentAccess/${studentId}`)
        setLastAccess(access.data.response)
      }catch(err){
        console.log(err)
      }
    }
    const getCourses = async () => {
      try{
        const courses = await api.get(`studentsCourses/${studentId}`)
        setCourses(courses.data.response)
      }catch(err){
        console.log(err)
      }
    }
    getInfoUser()
    getLastAccess()
    getCourses()
  },[])

  const formatDate = (date:string) => {
    return moment(date).format('DD/MM/YY HH:mm');
  }

  return(
    infoStudent === null ? <Loading/>:
    <div className="flex h-full overflow-hidden">
      <div className="flex flex-col flex-1 overflow-auto">
        {/*Information Aluno*/}
        <div className="flex">
          { infoStudent.status === 0 ? 
           <div className="flex flex-1 justify-center items-center bg-gradient-to-br from-red-300 to-red-500 shadow-red-800 shadow-md m-2 p-4 rounded">
            <FontAwesomeIcon className="text-4xl mr-3 font-bold text-red-900" icon={Fas.faBan}/>
            <div>
              <p className="text-lg font-bold text-red-900">Acesso Inativo</p>
              <p className="text-xs font-bold text-red-800">Tipo de Acesso</p>                
            </div>
          </div>
          : infoStudent.comunity == 1 ? 
            <div className="flex flex-1 justify-center items-center bg-gradient-to-br from-teal-300 to-green-500 shadow-green-800 shadow-md m-2 p-4 rounded">
              <FontAwesomeIcon className="text-4xl mr-3 font-bold text-teal-900" icon={Fas.faUsers}/>
              <div>
                <p className="text-lg font-bold text-teal-900">Membro da Comunidade</p>
                <p className="text-xs font-bold text-teal-800">Tipo de Acesso</p>                
              </div>
            </div>
          : <div className="flex flex-1 justify-center items-center bg-gradient-to-br from-sky-300 to-blue-500 shadow-sky-800 shadow-md m-2 p-4 rounded">
              <FontAwesomeIcon className="text-4xl mr-3 font-bold text-sky-900" icon={Fas.faUserCircle}/>
              <div>
                <p className="text-lg font-bold text-blue-900">Aluno Convencional</p>
                <p className="text-xs font-bold text-blue-800">Tipo de Acesso</p>                
              </div>
            </div>
          }
          <Card component={
            <div className="flex flex-col">
              <p className="text-neutral-400 text-sm"><strong>Aluno Desde: </strong>{formatDate(infoStudent.since)} </p>
              <p className="text-white"><strong>Último Acesso: </strong>{lastAccess === null ? <FontAwesomeIcon icon={Fas.faCircleNotch} className="text-green-500" pulse/> : formatDate(`${lastAccess.date} ${lastAccess.hour}`)} </p>
            </div>
          }/>
          <NavLink 
            className="flex justify-center m-1 my-2 items-center text-center cursor-pointer font-semibold text-neutral-400 hover:text-neutral-900 hover:bg-neutral-400  border border-neutral-400 p-2 text-sm rounded-md"
            to={`/admin/students/actives/`}>
            <FontAwesomeIcon icon={Fas.faReply}/> Voltar
          </NavLink>
        </div>

        {/*Courses Student*/}
        <Card component={ 
          courses === null ? 
            <div className="flex flex-1 flex-col p-4 justify-center items-center">
              <FontAwesomeIcon  className="text-4xl my-4 text-green-500" icon={Fas.faCircleNotch} pulse/>
              <p className="text-neutral-300">Buscando cursos do aluno ...</p>
            </div> 
          : courses.length === 0 ?
            <div className="flex flex-1 flex-col p-4 justify-center items-center">
              <FontAwesomeIcon  className="text-6xl my-4 text-green-500" icon={Fas.faVideoSlash}/>
              <p className="text-neutral-300">Esta aluno não possui nenhum curso!</p>
              <Button className="my-2" name="Adicionar Curso" icon="faPlus" btn="success" type="outline" /> 
            </div> 
          :
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-neutral-300"><FontAwesomeIcon  className="text-green-500" icon={Fas.faLaptop}/> Cursos do Aluno </p>
                <p className="text-neutral-400 text-sm">{courses.length} Curso(s) Cadastrado(s)</p>
              </div>
              <Button className="my-2" name="Adicionar Novo Curso" size="sm" icon="faPlus" btn="success" type="outline" />              
            </div>
            <div className="flex flex-wrap mt-2">
              {courses.map((course,key)=>
                <CourseCard key={key} id={course.id} image={course.image} name={course.name}/>
              )}
            </div>
          </div>          
        }/>


        <div className="flex">
          <Card className="flex-1" component={
            <div className="flex flex-col">
              <p className="text-neutral-300"><FontAwesomeIcon  className="text-green-500" icon={Fas.faComment}/> Comentários rescentes</p>
              <div className="flex flex-wrap mt-2"></div>
            </div>}/>
          <Card component={<div>Help</div>}/>
        </div>
      </div>

      <div className="flex flex-col w-1/4">
        <Card className="h-full overflow-auto" component={
          <div className="flex flex-col w-full justify-between items-center">
            <div className="w-full flex flex-col justify-center items-center py-8 border-b border-b-neutral-800">
              <StudentProfilePhoto photo_id={infoStudent.photo} class="w-[125px] h-[125px] mt-2"/>
              <p className="mt-2 text-white font-bold">{infoStudent.name}</p>
              <p className="mb-2 text-xs text-neutral-300">{infoStudent.mail}</p>             
            </div>
            <div className="w-full flex-1 flex flex-col justify-start items-center py-8 ">             
              <Button name="Alterar Dados" icon="faUserEdit" btn="info" type="outline" size="sm" block/>
              <Button name="Reenviar Acesso" icon="faPaperPlane" btn="info" type="outline" size="sm" block/>
              <Button name="Remover da Comunidade" icon="faUsersSlash" btn="error" type="outline" size="sm" block/>
              <Button name="Inativar Acesso" icon="faUserSlash" btn="error" type="outline" size="sm" block/>              
            </div>
            <div className="w-full bg-slate-500 rounded flex flex-col justify-center items-center py-8">
              <div>Avaliacao</div>
            </div>
          </div>
        }/>        
      </div>
    </div>
  )
}


const CourseCard : React.FC<ICourses> = (props) => {
  const [ infoImage, setInfoImage ]= useState<IFileGallery|null>(null)
  useEffect(()=>{
    const getInfoImage = async () => {
      try{
        const info = await api.get(`infoFile/${props.image}`)
        setInfoImage(info.data.response)
      }catch(e){
        console.log(e)
      } 
    }
    getInfoImage()
  },[])

  return(
    <div className="shadow-neutral-950 shadow overflow-hidden flex flex-col w-[24.3%] rounded bg-neutral-700 mr-1 mb-1 opacity-60 hover:opacity-100 cursor-pointer" title={props.name}>
      { props.image !== 0 ? 
        infoImage ? <img src={`${urlBase}/gallery/${infoImage.file}`} className='w-full'/> : <Loading/>
        : <div className="flex flex-col w-full h-[180px] bg-neutral-500 text-neutral-800 flex justify-center items-center">
            <FontAwesomeIcon className="text-4xl" icon={Fas.faCamera}/>
            <p>Sem Capa</p>
          </div>
     }
    </div>
  )

}