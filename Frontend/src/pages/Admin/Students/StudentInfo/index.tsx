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
import { Modal, TitleModal } from '../../../../components/Modal';
import { CourseCard } from '../components/CourseCard';
import { AddCourses } from '../components/AddCourses';

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

  /*Modal Triggers*/
  const [addCourses, setAddCourses] = useState<number|null>(null)
  const [editStudentInfo, setEditStudentInfo] = useState<number|null>(null)
  const [sendAccess, setSendAccess] = useState<number|null>(null)
  const [editComunityAccess, setEditComunityAccess] = useState<number|null>(null)
  const [editStatusAccess, setEditStatusAccess] = useState<number|null>(null)

  /*Viewer Mode Courses*/
  const [viewModeCourses, setViewModeCourses] = useState<'cells'|'list'>('list')

  const [ infoStudent, setInfoStudent ] = useState<IStudent|null>(null)
  const [ lastAccess, setLastAccess ] = useState<ILastAccess|false|null>(false)
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
      setCourses(null)
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
  },[addCourses])

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
              <p className="text-white"><strong>Último Acesso: </strong>{lastAccess ? <span className="text-green-500 font-bold">{formatDate(`${lastAccess.date} ${lastAccess.hour}`)}</span> : lastAccess === null ? <span className="text-teal-500"> - </span>  : <FontAwesomeIcon icon={Fas.faCircleNotch} className="text-green-500" pulse/> } </p>
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
              <Button className="my-2" name="Adicionar Curso" icon="faPlus" btn="success" type="outline" onClick={()=>setAddCourses(infoStudent.id)}/> 
            </div> 
          :
          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-neutral-300"><FontAwesomeIcon  className="text-green-500" icon={Fas.faLaptop}/> Cursos do Aluno </p>
                <p className="text-neutral-400 text-sm">{courses.length} Curso(s) Cadastrado(s)</p>
              </div>
              <div className="flex">
                <Button className="mr-0 rounded-r-none mt-2 mb-3" icon="faTableCellsLarge" btn={viewModeCourses == 'cells' ? 'success' : 'muted'} type={viewModeCourses == 'cells' ? 'default' : 'outline'} onClick={()=>setViewModeCourses('cells')} size='sm' />
                <Button className="ml-0 rounded-l-none mt-2 mb-3" icon="faList" btn={viewModeCourses == 'list' ? 'success' : 'muted'} type={viewModeCourses == 'list' ? 'default' : 'outline'} onClick={()=>setViewModeCourses('list')} size='sm' />
              </div>
              
              <Button className="my-2" name="Alterar Cursos do Aluno" icon="faPlus" btn="success" type="outline"  onClick={()=>setAddCourses(infoStudent.id)}/>              
            </div>
            <div className="flex flex-wrap mt-2">
              {courses.map((course,key)=>
                <CourseCard key={key} id={course.id} image={course.image} name={course.name} studentId={infoStudent.id} studentName={infoStudent.name} viewMode={viewModeCourses} />
              )}
            </div>
          </div>          
        }/>

        {/*Comments and Supoort Student*/}  
        <div className="flex">
          <Card className="flex-1" component={
            <div className="flex flex-col">
              <p className="text-neutral-300"><FontAwesomeIcon  className="text-green-500" icon={Fas.faComment}/> Comentários recentes</p>
              <div className="flex flex-wrap mt-2"></div>
            </div>}/>
          <Card component={<div>Help</div>}/>
        </div>
      </div>

      {/*SideRight*/}  
      <div className="flex flex-col w-1/4">
        <Card className="h-full overflow-auto" component={
          <div className="flex flex-col w-full justify-between items-center">
            <div className="w-full flex flex-col justify-center items-center py-8 border-b border-b-neutral-800">
              <StudentProfilePhoto photo_id={infoStudent.photo} class="w-[125px] h-[125px] mt-2"/>
              <p className="mt-2 text-xs font-bold text-neutral-500">Código: {infoStudent.id}</p> 
              <p className="text-white font-bold">{infoStudent.name}</p>
              <p className="mb-2 text-xs text-neutral-300">{infoStudent.mail}</p>             
            </div>
            <div className="w-full flex-1 flex flex-col justify-start items-center py-8 ">             
              <Button name="Alterar Dados" icon="faUserEdit" btn="info" type="outline" size="sm" block onClick={()=>setEditStudentInfo(infoStudent.id)}/>
              <Button name="Reenviar Acesso" icon="faPaperPlane" btn="info" type="outline" size="sm" block onClick={()=>setSendAccess(infoStudent.id)}/>
              <Button name="Remover da Comunidade" icon="faUsersSlash" btn="error" type="outline" size="sm" block onClick={()=>setEditComunityAccess(infoStudent.id)}/>
              <Button name="Inativar Acesso" icon="faUserSlash" btn="error" type="outline" size="sm" block onClick={()=>setEditStatusAccess(infoStudent.id)}/>              
            </div>
            <div className="w-full bg-slate-500 rounded flex flex-col justify-center items-center py-8">
              <div>Avaliacao</div>
            </div>
          </div>
        }/>        
      </div>
      {/*Modais*/}
      { addCourses && <Modal component={<div>
                        <TitleModal icon='faPlus' close={()=>setAddCourses(null)} 
                                    title='Adicionar Novos Cursos'
                                    subtitle={`Cadastre novos cursos para o aluno ${infoStudent.name}`}/>
                        <AddCourses studentId={infoStudent.id} close={setAddCourses}/>                      
                                       </div>}/>}

      { editStudentInfo && <Modal component={<div>
                        <TitleModal icon='faUserEdit' close={()=>setEditStudentInfo(null)} 
                                    title='Visualizar/Editar informações do Aluno'
                                    subtitle={`Edite ou apenas visualize as informações do aluno ${infoStudent.name}`}/>
                                       </div>}/>}

      { sendAccess && <Modal component={<div>
                        <TitleModal icon='faPaperPlane' close={()=>setSendAccess(null)} 
                                    title='Reenviar dados de acesso'
                                    subtitle={`Reenvie os dados de acesso do aluno ${infoStudent.name}`}/>
                                       </div>}/>}

      { editComunityAccess && <Modal component={<div>
                        <TitleModal icon={`${infoStudent.comunity == 0 ? 'faUsers' : 'faUsersSlash'}`} close={()=>setEditComunityAccess(null)} 
                                    title={`${infoStudent.comunity == 0 ? 'Incluir Aluno na' : 'Remover Aluno da'} Comunidade`}
                                    subtitle={`${infoStudent.comunity == 0 ? 'Inclua' : 'Remova'} o aluno ${infoStudent.name} da Comunidade`}/>
                                              </div>}/>}

      { editStatusAccess && <Modal component={<div>
                        <TitleModal icon={`${infoStudent.status == 0 ? 'faUserPlus' : 'faUserSlash'}`} close={()=>setEditStatusAccess(null)} 
                                    title={`${infoStudent.status == 0 ? 'Reativar' : 'Inativar'} Acesso`}
                                    subtitle={`${infoStudent.status == 0 ? 'Reative' : 'Inative'} o acesso do aluno ${infoStudent.name}`}/>
                                              </div>}/>}
    </div>
  )
}
