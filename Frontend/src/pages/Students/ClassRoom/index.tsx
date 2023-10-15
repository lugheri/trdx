import { useState } from 'react';
import { useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Player } from "./components/Player";
import { SideModule } from "./components/SideModule";
import { Student } from '../../../contexts/Dtos/auth.dto';



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


  return(
    <div className="flex h-full">
      <div className="flex flex-1 flex-col ">       
        <Player course_id={courseId} module_id={moduleId} lesson_id={lessonId} student_id={userData ? userData.id : 0}/>
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