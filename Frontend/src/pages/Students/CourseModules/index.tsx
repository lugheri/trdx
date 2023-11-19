import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Student } from "../../../contexts/Dtos/auth.dto";
import api from "../../../services/api";
import { ICourse } from "../Dtos/courses.dto";
import { Loading } from "../../../components/Loading";
import { urlBase } from "../../../utils/baseUrl";

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RenderImageGallery } from "../../../components/RenderImageGallery";
import { ModulesCourse } from "./components/ModulesCourse";


export const CourseModules = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null
  const location = useLocation();  
  const params = location.pathname.split('/')[3]  
  interface CourseObject {
    courseId: string;
  }
  const base64Decoded: CourseObject[] = JSON.parse(atob(params));
  const courseId = base64Decoded[0].courseId

  const [ progressCourse, setProgressCourse] = useState(0);
  const [ infoCourse, setInfoCourse] = useState<ICourse|null>(null)
  const [ fileImage, setFileImage ] = useState<null|string>(null)

  const getProgressCourse = async () => {
    try{
      const prog = await api.get(`progressCourse/${courseId}/${userData?.id}`)
      setProgressCourse(prog.data.response)        
    }catch(e){ console.log(e)}
  }
  const getInfoCourse = async () => {
    try{
      const ic = await api.get(`infoCourse/${courseId}`)
      setInfoCourse(ic.data.response)
    }catch(e){console.log(e) }
  }
  const getInfoImage = async (imageId:number) => {
    try{
      if(imageId){
        const i = await api.get(`infoFile/${imageId}`)
        setFileImage(i.data.response.file)
      }else{
        setFileImage("")
      }
    }catch(e){console.log(e)}
  }

  useEffect(()=>{   
    getProgressCourse()
    getInfoCourse()
  },[])

  useEffect(()=>{   
    infoCourse && getInfoImage(infoCourse.background_image ? infoCourse.background_image : infoCourse.image)
  },[infoCourse])



  return(
    <>
      { infoCourse === null ? <Loading/> :
      <div 
        className="relative flex flex-col" 
        style={{
          backgroundSize:'100% auto',
          backgroundRepeat:'no-repeat',
          background: `linear-gradient(to bottom,rgba(9, 9, 9, 0),
                                              rgba(9, 9, 9, 0.4),
                                              rgba(9, 9, 9, 0.6),
                                              rgba(9, 9, 9, 0.9),
                                              rgba(9, 9, 9, 1),
                                              rgba(9, 9, 9, 1),
                                              rgba(9, 9, 9, 1)),
                      url(${urlBase}/gallery/${fileImage})`,        
        }}>
          <ButtonOpenLesson
            progressCourse={progressCourse} 
            imageCourseId={infoCourse.image} 
            courseId={infoCourse.id}/>  
        <div className="flex flex-col  h-screen mr-4 ml-20 lg:ml-24 xl:ml-24 2xl:ml-24">
          <ModulesCourse courseId={parseInt(courseId, 10)} userId={userData ? userData.id : 0}/>
        </div>        
      </div>}
    </>
  )    
}

type ButtonOpenLessonComponent = {
  progressCourse:number;
  imageCourseId:number;
  courseId:number
}
const ButtonOpenLesson : React.FC<ButtonOpenLessonComponent> = (props) => {
  const navigate = useNavigate();  
  const openModule = () => {
    const hash_lessonId: string = btoa(`[{"courseId":"${props.courseId}","moduleId":"0"}]`);
    navigate(`/classRoom/course/lesson/${hash_lessonId}`)
  }

  return(
    <div 
      className="flex z-10 absolute cursor-pointer px-4 py-2 bg-black/70 hover:bg-black top-[50%] md:top-[10%] right-0 text-white font-light"
      onClick={()=>openModule()}>
      { props.progressCourse == 0 ?
        <div className="flex w-full h-full items-center">
          <div className="w-[60px] h-[35px] md:w-[100px] md:h-[55px] bg-slate-300 ">
            <RenderImageGallery className="w-full h-full" imageId={props.imageCourseId}/>
          </div>
          <p className="px-2 md:px-6 text-sm">
            Iniciar Curso <FontAwesomeIcon className="pl-4" icon={Fas.faChevronRight}/>
          </p>
        </div>
      : <div className="flex w-full h-full items-center">           
          <div className="w-[60px] h-[35px] md:w-[100px] md:h-[55px] bg-slate-300">
            <RenderImageGallery className="w-full h-full" imageId={props.imageCourseId}/>
          </div>
          <p className="px-2 md:px-6 text-sm">
            Continuar Curso <FontAwesomeIcon className="pl-4" icon={Fas.faChevronRight}/>
          </p>
        </div>
      }
    </div>
  )
}




