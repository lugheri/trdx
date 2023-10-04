import { useState, useEffect } from 'react'
import { Button } from "../../../../components/Buttons"
import { ICourse } from '../../Content/Dtos/courses.dto'
import api from '../../../../services/api'
import { Loading } from '../../../../components/Loading'

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IFileGallery } from '../../../Students/Dtos/gallery.dto'
import { urlBase } from '../../../../utils/baseUrl'

interface IAddCourses{
  studentId:number,
  close:React.Dispatch<React.SetStateAction<number|null>>
}
export const AddCourses : React.FC<IAddCourses> = (props) => {
  const [ courses, setListCourses ] = useState<ICourse[]|null>(null)
  useEffect(()=>{
    const getCourses = async () => {
      try{
        const list = await api.post(`listCourses`,{status:1})
        setListCourses(list.data.response)
      }catch(err){
        console.log(err)
      }
    }
   
    getCourses()
    
  },[])
  return (
    <div className="flex flex-col">
      { courses === null ? <div className="flex flex-col p-8 justify-center items-center"><Loading/></div> :
        courses.length === 0 ? 
        <div className="flex flex-col p-2 py-8 justify-center items-center">
          <FontAwesomeIcon icon={Fas.faVideoSlash} className="text-5xl my-4 text-green-500"/>
          <p className="text-neutral-200">Parece que você ainda não tem nenhum curso disponível!</p>
        </div>
        : <div className="flex flex-wrap max-h-[400px] overflow-auto py-2">
            {courses.map((course,key)=><CourseItemList key={key} course={course} studentId={props.studentId} />)}
         </div>
      }
      
      <div className="border-t border-slate-600 flex justify-end items-center pt-3">
        <Button name="Fechar" btn="muted" type="notline" onClick={()=>props.close(null)}/>
      </div>
    </div>
  )
}

const CourseItemList: React.FC<{course:ICourse;studentId:number}> = (props) => {
  const [ infoImage, setInfoImage ]= useState<IFileGallery|null>(null)
  const [ checkActiveCourse, setCheckActiveCourse]= useState<boolean|null>(null)
  useEffect(()=>{
    const getInfoImage = async () => {
      try{
        const info = await api.get(`infoFile/${props.course.image}`)
        setInfoImage(info.data.response)
      }catch(e){
        console.log(e)
      } 
    }    
    const getCheckCourseStudent = async () => {
      try{
        const check = await api.get(`checkCourseStudent/${props.studentId}/${props.course.id}`)
        setCheckActiveCourse(check.data.response)
      }catch(e){
        console.log(e)
      } 
    }   
    getInfoImage()
    getCheckCourseStudent()
  },[])

  const delCourse = () => {
    setCheckActiveCourse(false)
  }
  const addCourse = () => {
    setCheckActiveCourse(true)
  }

  return(
    <div className="shadow-neutral-950 shadow overflow-hidden flex flex-col w-[19.5%] rounded bg-neutral-700 mr-1 mb-1 relative" title={props.course.name}>
      {checkActiveCourse === null ? 
        <div className="flex flex-col justify-center items-center bg-neutral-800 opacity-90 w-full h-full absolute">
          <FontAwesomeIcon icon={Fas.faCircleNotch} className="text-xl text-teal-500" pulse/>
        </div>          
      : checkActiveCourse ? 
        <div className="flex flex-col justify-center items-center cursor-pointer group bg-slate-800/90 w-full h-full absolute" onClick={()=>delCourse()}>
          <FontAwesomeIcon icon={Fas.faCheckCircle} className='block group-hover:hidden text-teal-500 text-4xl py-8'/>
          <FontAwesomeIcon icon={Fas.faXmarkCircle} className='hidden group-hover:block text-red-500 text-4xl py-8'/>
          <p className="text-xs font-bold mt-4 text-center group-hover:opacity-100 opacity-0 text-red-600"> Remover Curso</p>
        </div>
      :
        <div className="flex flex-col justify-center items-center group cursor-pointer hover:bg-slate-900/75 w-full h-full absolute" onClick={()=>addCourse()}>
          <FontAwesomeIcon icon={Fas.faPlusCircle} className='group-hover:block hidden text-slate-300 text-4xl py-8'/>
          <p className="text-xs font-bold mt-4 text-center group-hover:opacity-100 opacity-0 text-slate-300 "> Adicionar Curso</p>
        </div>
      }
      
      
      { props.course.image !== 0 ? 
        infoImage ? <img src={`${urlBase}/gallery/${infoImage.file}`} className='w-full'/> : <Loading/>
        : <div className="flex flex-col w-full h-[180px] bg-neutral-500 text-neutral-800 flex justify-center items-center">
            <FontAwesomeIcon className="text-4xl" icon={Fas.faCamera}/>
            <p>Sem Capa</p>
          </div>
      }
    </div>
  )
}