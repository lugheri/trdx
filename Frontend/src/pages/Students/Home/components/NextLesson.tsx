import { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { ICourse, ILessons } from '../../Dtos/courses.dto';
import { useNavigate } from 'react-router-dom';
import { RenderImageGallery } from '../../../../components/RenderImageGallery';
import { ButtonDefault } from '../../../../components/Buttons';
import DOMPurify from 'dompurify';

type NextLessonComponent = {
  studentId:number;
}
export const NextLesson : React.FC<NextLessonComponent> = (props) => {
  const [ nextLessonId, setNextLessonId ] = useState<number|null>(null)
  const getNextLesson = async () => {
    try{
      const nextLesson = await api.get(`lastLessonViewed/${props.studentId}`)          
      setNextLessonId(nextLesson.data.response)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{getNextLesson()},[])

  return(
    <>
     { nextLessonId ? <InfoNextLesson lessonId={nextLessonId}/> : <p></p> } 
    </>
  )
}

const InfoNextLesson : React.FC<{lessonId:number}> = (props) => {
  const [ infoLesson, setInfoLesson] = useState<ILessons | null>(null); // Inicializa com null ou um valor padrão apropriado
  const [ infoCourse, setInfoCourse] = useState<ICourse | null>(null); 
  const infoNextLesson = async () => {
    const info = await api.get(`/infoLesson/${props.lessonId}`)
    setInfoLesson(info.data.response)      
    const course = await api.get(`/infoCourse/${info.data.response.course_id}`) 
    setInfoCourse(course.data.response)
  }
  useEffect(()=>{infoNextLesson()},[])
  const navigate = useNavigate();  
  const openModule = () => {
    const hash_lessonId: string = btoa(`[{"courseId":"${infoLesson?.course_id}","moduleId":"0"}]`);
    navigate(`/classRoom/course/lesson/${hash_lessonId}`)
  }

  
  const sanitizedHtml = (text:string) =>{
    return DOMPurify.sanitize(text);
  }


  return (
    <>
      { infoLesson &&
        <div className="flex flex-col mt-[100px] justify-center items-center 
                        mr-4 ml-4 
                        md:ml-28 lg:ml-28 xl:ml-28 2xl:ml-28 
                        md:flex-row lg:flex-row xl:flex-row 2xl:flex-row">
          <div className="w-[95%] md:w-1/2 lg:w-1/3 overflow-hidden mb-4 rounded-xl relative flex justify-center items-center bg-slate-900 text-neutral-600">
            <p className="p-2 bg-neutral-800 text-white text-xs font-light rounded-md absolute top-4 left-4 shadow">
              Continue de onde parou 
            </p>
            { infoCourse ? <RenderImageGallery className="w-full" imageId={infoCourse.default_thumb} imgTag/>
            : <p>CAPA</p>}
          </div>
          <div className="flex flex-col flex-1 justify-start items-center md:items-start 
                          px-1 mx-1 md:px-4 md:mx-4">
            <p className="text-neutral-100 font-bold text-xl w-full text-center md:text-left">{infoLesson.name}</p>
            <p className="text-neutral-100 font-light my-4 w-full text-center md:text-left" dangerouslySetInnerHTML={{ __html: sanitizedHtml(infoLesson.description ? infoLesson.description: infoCourse ? infoCourse.description : "") }} />
            <ButtonDefault icon="faPlay" className="mb-3" onClick={()=>openModule()} name="Continuar Conteúdo"/>        
          </div>        
        </div>
      }
    </>
  )
}