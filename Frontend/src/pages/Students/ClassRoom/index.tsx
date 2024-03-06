import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Player } from "./components/Player";
import { SideModule } from "./components/SideModule";
import { Student } from '../../../contexts/Dtos/auth.dto';
import api from '../../../services/api';
import { ICourse } from '../Dtos/courses.dto';
import { NotePad } from './components/NotePad';

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

  const continueLesson = async () => {
    try{
      const info = await api.get(`/continueCourse/${userData ? userData.id : 0}/${courseId}`)
      setModuleOpen(moduleOpen > 0 ? moduleOpen : info.data.response['module'])
      const fl = await api.get(`firstLessonModule/${moduleOpen}`)
      const firstLessonModule: number = moduleOpen > 0 && fl.data.response
      console.log("module open",moduleOpen)
      console.log("lesson",
                  moduleOpen > 0 ? 
                    firstLessonModule 
                    : info.data.response['nextLesson'] === 0 ? 
                      info.data.response['lastLesson'] 
                      : info.data.response['nextLesson'])
      console.log("firstLessonModule",firstLessonModule)
      
      setLessonId(moduleOpen > 0 ? 
                  firstLessonModule
                  : info.data.response['nextLesson'] === 0 ? 
                    info.data.response['lastLesson'] 
                    : info.data.response['nextLesson'] )
    }catch(err){console.log(err)}
  }
  const getInfoCourse = async () => {
    try{
      const info = await api.get(`/infoCourse/${courseId}`)
      setInfoCourse(info.data.response)
    }catch(err){console.log(err)}
  }

  const [ openNotePad, setOpenNotePad ] = useState(false)
  const [ openNotePadMobile, setOpenNotePadMobile ] = useState(false)
  //Mobile Side
  const [ mobileSide, setMobileSide ] = useState<'lesson'|'tools'|'comments'|null>(null)

  useEffect(()=>{
    getInfoCourse()
    lessonId == 0 && continueLesson()
  },[])

  const [ checkLesson, setCheckLesson ] = useState<number|null>(null) 

  return(
    <div className="flex flex-col md:flex-row h-full overflow-auto mr-1 ml-1 md:ml-28
                    lg:ml-28 xl:ml-28 2xl:ml-28 ">                  
      <div className="flex flex-1 flex-col md:h-[100%] md:relative md:overflow-auto pb-2">  
        <Player
          course_id={courseId} nameCourse={infoCourse ? infoCourse.name : ""}
          module_id={moduleOpen} 
          lesson_id={lessonId} setLessonId={setLessonId}
          student_id={userData ? userData.id : 0}          
          studentName={userData ? userData.name : ""}          
          setModuleOpen={setModuleOpen}
          setOpenNotePad={setOpenNotePad} setOpenNotePadMobile={setOpenNotePadMobile}
          setMobileSide={setMobileSide} mobileSide={mobileSide}   
          setCheckLesson={setCheckLesson}       
          />
        {/*Load Mobile Side */} 
        { openNotePadMobile && 
          <NotePad 
            course_id={courseId} 
            nameCourse={infoCourse ? infoCourse.name : ""}
            module_id={moduleOpen}
            lesson_id={lessonId}
            student_id={userData ? userData.id : 0}
            setClose={setOpenNotePad} 
            setCloseMobile={setOpenNotePadMobile}/>}         
      </div>    
      <div className={`${mobileSide == 'lesson' ? "flex" : "hidden"} md:overflow-auto md:flex flex-col md:w-1/3 relative px-2`}>
        <SideModule 
          studentId={userData ? userData.id : 0}
          checkLesson={checkLesson}
          courseId={courseId}
          imageCourse={infoCourse ? infoCourse.image : 0}
          moduleOpen={moduleOpen} setModuleOpen={setModuleOpen}
          lessonId={lessonId} setLessonId={setLessonId}/>         
        { openNotePad && 
          <NotePad 
            course_id={courseId} 
            nameCourse={infoCourse ? infoCourse.name : ""}
            module_id={moduleOpen}
            lesson_id={lessonId}
            student_id={userData ? userData.id : 0}
            setClose={setOpenNotePad} 
            setCloseMobile={setOpenNotePadMobile}/>}        
      </div>
    </div>
  )
}

