import { useEffect, useState } from "react"
import { Card } from "../../../../../components/Cards"
import api from "../../../../../services/api";

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../../../../components/Buttons";
import { IStudent } from "../../Dtos/student.dto";
import { CourseCard } from "./CourseCard";
import { AddCourses } from "./AddCourses";

interface ICourses{
  id:number;
  image:number;
  name:string;
}

type CourseStudentComponent = {
  infoStudent:IStudent,
  addCourses:number|null,
  setAddCourses:React.Dispatch<React.SetStateAction<number|null>>
  
}
export const CoursesStudent: React.FC<CourseStudentComponent> = (props) => {
  const [ courses, setCourses ] = useState<ICourses[]|null>(null)
  const [update,setUpdate] = useState(0)
  

  const getCourses = async () => {
    setCourses(null)
    try{
      const courses = await api.get(`studentsCourses/${props.infoStudent.id}`)
      setCourses(courses.data.response)
      setUpdate(0)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{getCourses()},[props.addCourses,update])

  const [viewModeCourses, setViewModeCourses] = useState<'cells'|'list'>('list')

  return(
    <>
      <Card component={ 
        courses === null 
        ? 
          <div className="flex flex-1 flex-col p-4 justify-center items-center">
            <FontAwesomeIcon  className="text-4xl my-4 text-green-500" icon={Fas.faCircleNotch} pulse/>
            <p className="text-neutral-300">Buscando cursos do aluno ...</p>
          </div> 
        :
          courses.length === 0 
          ?
            <div className="flex flex-1 flex-col p-4 justify-center items-center">
              <FontAwesomeIcon  className="text-6xl my-4 text-green-500" icon={Fas.faVideoSlash}/>
              <p className="text-neutral-300">Esta aluno não possui nenhum curso!</p>
              <Button className="my-2" name="Adicionar Curso" icon="faPlus" btn="success" type="outline" onClick={()=>props.setAddCourses(props.infoStudent.id)}/> 
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
                <Button className="my-2" name="Alterar Cursos do Aluno" icon="faPlus" btn="success" type="outline"  onClick={()=>props.setAddCourses(props.infoStudent.id)}/>              
              </div>
              <div className="flex flex-wrap mt-2">
                {courses.map((course,key)=><CourseCard key={key} 
                                                      id={course.id} 
                                                      image={course.image} 
                                                      name={course.name} 
                                                      studentId={props.infoStudent.id} 
                                                      studentName={props.infoStudent.name} 
                                                      viewMode={viewModeCourses}
                                                      setUpdate={setUpdate}/>
                )}
              </div> 
            </div>  
        }/> 
        {props.addCourses && <AddCourses infoStudent={props.infoStudent} close={props.setAddCourses}/>}      
      </>
  )
}