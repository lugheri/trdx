import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Player } from "./components/Player";
import { SideModule } from "./components/SideModule";
import { Student } from '../../../contexts/Dtos/auth.dto';
import api from '../../../services/api';


export const ClassRoom = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null

  const location = useLocation();  
  const params = location.pathname.split('/')[4]
  interface LessonObject {
    courseId: string;
    moduleId: string;
  }
  const base64Decoded: LessonObject[] = JSON.parse(atob(params));
  const courseId = parseInt(base64Decoded[0].courseId,10)
  const moduleId = parseInt(base64Decoded[0].moduleId,10)
  const [ lessonId, setLessonId ] = useState<number>(0)
  const [ moduleOpen, setModuleOpen ] = useState<number>(moduleId)

  useEffect(()=>{
    const continueLesson = async () => {
      try{
        const info = await api.get(`/continueCourse/${userData ? userData.id : 0}/${courseId}`)
        console.log('INFO',info.data)
        setModuleOpen(info.data.response['module'])
        setLessonId(info.data.response['nextLesson'])
      }catch(err){
        console.log(err)
      }
    }
    lessonId == 0 && continueLesson()
  },[])


  return(
    <div className="flex h-full">
      <div className="flex flex-1 flex-col h-[100%] overflow-auto pb-2">        
        <Player
          course_id={courseId} 
          module_id={moduleOpen} 
          lesson_id={lessonId} setLessonId={setLessonId}
          student_id={userData ? userData.id : 0}          
          studentName={userData ? userData.name : ""}/>
      </div>
      <div className="flex w-1/3 flex-col overflow-auto px-2">
        <SideModule 
          studentId={userData ? userData.id : 0}
          courseId={courseId}
          moduleOpen={moduleOpen} setModuleOpen={setModuleOpen}
          lessonId={lessonId} setLessonId={setLessonId}/>        
      </div>
    </div>
  )
}