import React, { useState, useEffect } from 'react';
import { ICourse } from '../../../../Students/Dtos/courses.dto';

import { Button } from "../../../../../components/Buttons"
import api from '../../../../../services/api';
import { Loading } from '../../../../../components/Loading';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { RenderImageGallery } from '../../../../../components/RenderImageGallery';

export const CourseList : React.FC<{openCourse:null|number,published:number,setOpenCourse: React.Dispatch<React.SetStateAction<null|number>>}> = (props) => {
  const [ listCourses, setListCourses ] = useState<ICourse[]|null>(null)
  const [ totalCourses, setTotalCourses ] = useState<number>(0)
  const getListCourses = async () => {
    try{
      const filter = {"status":1,"published":props.published}     
      const c = await api.post('listCourses',filter);       
      setListCourses(c.data.response)
      setTotalCourses(c.data.response.length)
    }catch(e){ console.log(e)}      
  }
  useEffect(()=>{ getListCourses() },[props.openCourse])
  return(
    <div className="flex flex-col w-full">
      <p className="font-bold text-neutral-400 my-2">
        {totalCourses} Curso(s) {props.published === 1 ? "Públicado(s)!" : "Privado(s)!"}
      </p>
      <div className="overflow-hidden p-2 rounded flex flex-wrap bg-neutral-950/50 rounded-md">
        { listCourses === null ? <Loading/>
        : listCourses.map((course,key)=>
          <div key={key} 
            className="bg-neutral-600 shadow-md m-2 w-[31%] rounded flex flex-col justify-start items-center">
            <div className="bg-neutral-950/40 w-full h-[180px] flex justify-center items-center relative overflow-hidden">
              <RenderImageGallery className="w-full h-full" imageId={course.default_thumb}/>
              { course.published == 1 ? 
                <div className="absolute bottom-0 right-2 bg-teal-500 text-white px-2 py-1 text-xs font-bold shadow rounded-t-lg">
                  <FontAwesomeIcon icon={Fas.faBullhorn}/> Público
                </div> 
              : <div className="absolute bottom-0 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold shadow rounded-t-lg">
                  <FontAwesomeIcon icon={Fas.faLock}/> Privado
                </div>}
            </div>
            <div className="flex flex-col w-full p-1 justify-start items-start">
              <p className="text-neutral-200 font-black h-[50px]">
                {course.name.slice(0, 45)}
              </p>
              <p className="text-neutral-200 text-sm font-light h-[50px]" title={course.description}>
                { course.description.length > 50 ? course.description.slice(0, 45) + ' . . . ' : course.description }
              </p>
              <div className="flex w-2/3 text-sm mt-4 text-neutral-300 justify-between">
                <p title="Id do Curso"><strong>Cód.:</strong> {course.id} </p>
                <p title="Usuários no curso"><FontAwesomeIcon icon={Fas.faUsers}/> 0 </p>
                <p title="Avaliação média do curso"><FontAwesomeIcon icon={Fas.faStar}/> 0 </p>
              </div>
              <div className="flex w-full justify-center items-end mt-2">
                <Button icon="faFolderOpen" name="Abrir Curso" block btn="success" type="outline" size="sm" onClick={()=>props.setOpenCourse(course.id)} />
              </div>
            </div>              
          </div>
        )}  
      </div>
    </div>
  )
}