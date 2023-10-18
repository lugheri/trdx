import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Player } from "./components/Player";
import { SideModule } from "./components/SideModule";
import { Student } from '../../../contexts/Dtos/auth.dto';
import api from '../../../services/api';
import { ICourse } from '../Dtos/courses.dto';


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
  const [ infoCourse, setInfoCourse ] = useState<ICourse | null>(null)

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

    const getInfoCourse = async () => {
      try{
        const info = await api.get(`/infoCourse/${courseId}`)
        setInfoCourse(info.data.response)
      }catch(err){
        console.log(err)
      }
    }
    getInfoCourse()
    lessonId == 0 && continueLesson()
  },[])

  const [ openNotePad, setOpenNotePad ] = useState(false)

  //Mobile Side
  const [ mobileSide, setMobileSide ] = useState<'lesson'|'tools'|'comments'|null>(null)


  return(
    <div className="flex flex-col md:flex-row h-full overflow-auto">
      <div className="flex flex-1 flex-col md:h-[100%] md:relative md:overflow-auto pb-2">        
        <Player
          course_id={courseId} nameCourse={infoCourse ? infoCourse.name : ""}
          module_id={moduleOpen} 
          lesson_id={lessonId} setLessonId={setLessonId}
          student_id={userData ? userData.id : 0}          
          studentName={userData ? userData.name : ""}
          setOpenNotePad={setOpenNotePad}
          setMobileSide={setMobileSide} mobileSide={mobileSide}          
          />
          {/*Load Mobile Side */}        
      </div>
     
      <div className={`${mobileSide == 'lesson' ? "flex" : "hidden"} md:overflow-auto md:flex flex-col md:w-1/3 relative px-2`}>
        <SideModule 
          studentId={userData ? userData.id : 0}
          courseId={courseId}
          moduleOpen={moduleOpen} setModuleOpen={setModuleOpen}
          lessonId={lessonId} setLessonId={setLessonId}/>         
        { openNotePad && <NotePad 
                            course_id={courseId} 
                            module_id={moduleOpen}
                            lesson_id={lessonId}
                            student_id={userData ? userData.id : 0}
                            setClose={setOpenNotePad} 
                            />}        
        </div>
    </div>
  )
}


type INote = {
  course_id:number,
  module_id:number,
  lesson_id:number,
  student_id:number,
  setClose:React.Dispatch<React.SetStateAction<boolean>>,
  
}

const NotePad : React.FC<INote> = (props) => {
 

  return(
    <div
      className="flex flex-col w-[95%] right-0 h-[95%] absolute rounded-lg overflow-hidden justify-center m-2">
        <div className="bg-red-500 p-4 flex justify-between">
          Header 
          <button onClick={()=>props.setClose(false)}>Close</button>
        </div>
        <div className="bg-orange-500 flex flex-1">
          <div className="bg-green-500 w-1/4">
            side
          </div>
          <div className="flex flex-1 bg-blue-500">
            body
          </div>
        </div>      
    </div>
  )
}