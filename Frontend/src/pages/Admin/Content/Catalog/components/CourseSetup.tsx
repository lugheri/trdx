import React, { useState, useEffect } from 'react';

import { ICourse } from '../../../../Students/Dtos/courses.dto';

import { Button } from "../../../../../components/Buttons"
import { Card } from '../../../../../components/Cards';
import api from '../../../../../services/api';
import { Loading } from '../../../../../components/Loading';

import { Modal, TitleModal } from '../../../../../components/Modal';
import { RenderImageGallery } from '../../../../../components/RenderImageGallery';
import { CourseEditInfo } from './CourseEditInfo';
import { ModuleCourse } from './ModulesCourse';
import { ModuleSetup } from './ModuleSetup';

type OpenCourseComponent = {
  setOpenCourse: React.Dispatch<React.SetStateAction<null|number>>;
  openCourse: number
}
export const CourseSetup : React.FC<OpenCourseComponent> = (props) => {
  const [ setupModule, setSetupModule ] = useState<null | number>(null)
  const [ infoCourse, setInfoCourse ] = useState<null|ICourse>(null)
  const [ editInfoCourse, setEditInfoCourse ] = useState(false)




  const getInfo = async () => {
    try{
      const i = await api.get(`infoCourse/${props.openCourse}`)
      setInfoCourse(i.data.response)
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{ getInfo()},[editInfoCourse])
  return(
    <>
      { infoCourse === null ? <Loading/> :
    
      <div className="flex flex-col">
        <div className="px-4 pb-1">
          <p className="text-neutral-300 text-lg font-bold">Página do Curso</p>
        </div>
        { setupModule == null ? 
          <>
            <Card  component={            
                <div className="flex flex-1 items-center">
                  <div className="border bg-white rounded w-[200px] flex justify-center items-center overflow-hidden p-1 shadow-black shadow-md">
                    <RenderImageGallery className="w-full h-full" imageId={infoCourse.image} imgTag/>
                  </div>
                  <div className="flex flex-col flex-1 pl-3 border-l border-slate-300 ml-3 ">
                    <p className="text-neutral-400 font-light"><strong>Cód.: </strong>{infoCourse.id}</p>
                    <p className="text-neutral-400 font-light"><strong>Título: </strong>{infoCourse.name}</p>
                    <p className="text-neutral-400 font-light"><strong>Descrição: </strong>{infoCourse.description}</p>
                    <p className="text-neutral-400 font-light"><strong>Por: </strong>{infoCourse.author}</p>
                    <p className="text-neutral-400 font-light"><strong>Tags: </strong>{infoCourse.tags}</p>
                    <div className="flex mb-4">
                      <p className="text-neutral-400 font-light"><strong>Privacidade: </strong>{infoCourse.published == 1 ? "Público" : "Privado"}</p>
                      <p className="text-neutral-400 font-light ml-8"><strong>Comunidade: </strong>{infoCourse.community == 1 ? "Sim" : "Não"}</p>
                    </div>
                    <div className="flex justify-end items-center p-2 bg-gradient-to-r from-neutral-900 to-neutral-800 flex-1 w-full">
                      <Button icon="faReply" name="Voltar" btn="muted" type="notline" size="sm" className='rounded-none' onClick={()=>props.setOpenCourse(null)} />
                      <Button icon="faChartColumn" name="Estatísticas" btn="info" type="notline" size="sm" className='rounded-none'/>
                      <Button icon="faEnvelopeOpenText" name="Configurar E-mails" btn="info" type="notline" size="sm" className='rounded-none'/>
                      <Button icon="faEdit" name="Editar Informações" btn="info" type="notline" size="sm" className='rounded-none' onClick={()=>setEditInfoCourse(true)}/>
                    </div>
                  </div>             
              </div>
            }/>

            { infoCourse && <ModuleCourse infoCourse={infoCourse} setSetupModule={setSetupModule}/>}
            { editInfoCourse ? <Modal component={
              <div>
                <TitleModal 
                  icon='faEdit' close={()=>setEditInfoCourse(false)} 
                  title='Editar Informações do Curso' 
                  subtitle={`Edite as informações básicas do curso ${infoCourse.name} `}/>
                  {infoCourse ? 
                    <CourseEditInfo infoCourse={infoCourse} setOpenCourse={props.setOpenCourse} setEditInfoCourse={setEditInfoCourse}/>
                  : <Loading/>}
                </div>
            }/> : false }
          </>
        : <ModuleSetup moduleId={setupModule} course={infoCourse.name} setSetupModule={setSetupModule}/>}

      
        
      </div>
    }
  </>)
}
