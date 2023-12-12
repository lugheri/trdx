import React, { useEffect, useState } from "react"
import { IStudent } from "../Dtos/student.dto"
import api from "../../../../services/api"
import { LoadingBars } from "../../../../components/Loading"
import moment from 'moment';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "../../../../components/Buttons";
import { urlBase } from "../../../../utils/baseUrl";
import { NavLink } from "react-router-dom";

type SearchStudentsComponent = {
  page:number,
  params:string,
  status:number
  /*filter:string,
  orderBy:string,
  order:'ASC'|'DESC'*/
}
export const SearchStudents : React.FC<SearchStudentsComponent> = (props) => {
  const [ students, setStudents ] = useState<IStudent[]|null>(null)
  const [ nextPage, setNextPage ] = useState(0)
  const filter = 'all'
  const orderBy = 'id'
  const order = 'DESC'
  const getStudents = async () => {
    try{
      const res = await api.get(`/searchParams/${props.status}/${props.params}/${props.page}/${filter}/${orderBy}/${order}`)
      setStudents(res.data.response)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{getStudents()},[props.params])

  return(
    <>
      { students === null ? <LoadingBars/> 
      : students.length == 0 ? props.page === 1 &&
        <div className="flex flex-col w-full justify-center items-center p-8 text-white">
          <FontAwesomeIcon className="my-4 text-4xl text-neutral-500/50" icon={Fas.faUserSlash}/>
          <p>Nenhum Aluno encontrado</p>
        </div>
      : <>
        { students.map((student,key)=><Student key={key} student={student}/>)}
        { nextPage === 0 
          ? students.length >= 15 
            && <Button block btn="muted" type="notline" name="Carregar Mais Alunos" onClick={()=>setNextPage(props.page+1)}/>
          : <SearchStudents status={props.status} page={nextPage} params={props.params} />
        }    
      </>} 
  </>)
}

type StudentComponent = {
  student:IStudent,
}
const Student : React.FC<StudentComponent> = (props) => {  
  const [ totalMyCourses, setTotalMyCourses] = useState(0)
  const getCoursesStudents = async () => {
    try{
      const res = await api.get(`/totalMyCourses/${props.student.id}`)
      setTotalMyCourses(res.data.response)
    }catch(err){
      console.log(err)
    }
  }
  const [ lessonsViewed, setLessonsViewed] = useState(0)
  const getLessonsViewedStudents = async () => {
    try{
      const res = await api.get(`/allLessonsViews/${props.student.id}`)
      setLessonsViewed(res.data.response)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    getCoursesStudents()
    getLessonsViewedStudents()
  },[])  
  
  const formatDate = (date:string) => {
    return moment(date).format('DD/MM/YY HH:mm');
  }



  return(
    <div className={`flex justify-between items-center ${props.student.status == 1 ? "bg-neutral-800" : "bg-neutral-800/50 border border-red-500/50"} w-full my-2 pr-4`}>      
      <div className="flex flex-col w-[80px]  h-[80px] justify-center items-center">
        <Photo photo_id={props.student.photo}/> 
      </div>
      <div className="flex flex-col  justify-center w-1/2 py-2 px-1">
        <p className={`${props.student.status == 1 ? "text-neutral-300" : "text-red-500"} font-light flex items-center`}>
          <span className="text-xl">{props.student.name}</span>           
          {props.student.community === 1 &&
            <>
              <FontAwesomeIcon className="mx-2 text-teal-500 text-[.2rem]" icon={Fas.faCircle}/>
              <b className="text-[#0f0] text-sm">Membro da Comunidade</b>
            </> }
        </p>
        <p className="text-neutral-300 text-sm font-light flex items-center">
          Cód: <b className="text-teal-500 ml-1"> {props.student.id}</b>
          <FontAwesomeIcon className="mx-2 text-teal-500 text-[.2rem]" icon={Fas.faCircle}/>
          <span>{props.student.mail}</span>
          <FontAwesomeIcon className="mx-2 text-teal-500 text-[.2rem]" icon={Fas.faCircle}/>
          <p className="text-white text-xs">{formatDate(props.student.since)}</p>
        </p>              
      </div>
      <div className="flex flex-col justify-center items-center w-[10%]">
        <p className="text-teal-500">{totalMyCourses}</p>
        <p className="text-neutral-300 text-xs font-light">Cursos</p>
      </div>  
      <div className="flex flex-col justify-center items-center w-[15%]">
        <p className="text-teal-500">{lessonsViewed}</p>
        <p className="text-neutral-300 text-xs font-light">Aulas Assistidas</p>
      </div>  
      <div className="flex flex-col  justify-center items-end w-[10%]">
        {/*<Button btn="success" icon="faFolderOpen" title="Abrir Ficha do Aluno" onClick={()=>setEditStudent(props.student)}/>*/}
        <NavLink
          className="flex justify-center m-1 items-center text-center cursor-pointer font-semibold bg-[#1abc9c] text-white hover:bg-[#16a085] border border-[#1abc9c] p-2 text-sm rounded-md"
          to={`/admin/students/actives/info/${props.student.id}`}
          title="Abrir Ficha do Aluno">
          <FontAwesomeIcon icon={Fas.faFolderOpen}/>
        </NavLink>
      </div>  
    </div>
   )
 }
 
 
const Photo : React.FC<{photo_id:number}> = (props)=> {
  const [ urlPhoto, setUrlPhoto ] = useState<string|null>(null)
  useEffect(()=>{
    const getPhoto = async () => {
      setUrlPhoto(null)
      try{        
        const photo = await api.get(`photoProfile/${props.photo_id}`)     
        photo.data.response == false ? setUrlPhoto(null) :
        setUrlPhoto(`${photo.data.response.file}`)
      }catch(e){console.log(e)}
    }
    getPhoto()    
  },[props.photo_id])

  return(
    <div className="flex w-full h-[100px] overflow-hidden rounded justify-center items-start pt-3">
      { urlPhoto ?
      <img src={`${urlBase}/gallery/${urlPhoto}`} alt="Foto do Aluno" style={{ maxWidth: '60%',borderRadius:'8px' }} />
      : <div className="bg-neutral-500/50 text-neutral-800 w-[60px] h-[60px] flex rounded justify-center items-center"><FontAwesomeIcon  icon={Fas.faUser}/></div>}
    </div>
  )
}