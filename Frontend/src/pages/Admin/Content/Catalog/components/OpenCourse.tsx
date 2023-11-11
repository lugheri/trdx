import React, { useState, useEffect } from 'react';

import { ICourse } from '../../../../Students/Dtos/courses.dto';

import { Button } from "../../../../../components/Buttons"
import { Card } from '../../../../../components/Cards';
import api from '../../../../../services/api';
import { Loading } from '../../../../../components/Loading';

import { Modal, TitleModal } from '../../../../../components/Modal';
import { RenderImageGallery } from '../../../../../components/RenderImageGallery';
import { EditInfoCourse } from './EditInfoCourse';

type OpenCourseComponent = {
  setOpenCourse: React.Dispatch<React.SetStateAction<null|number>>;
  openCourse: number
}
export const OpenCourse : React.FC<OpenCourseComponent> = (props) => {
  const [ infoCourse, setInfoCourse ] = useState<null|ICourse>(null)
  const [ editInfoCourse, setEditInfoCourse ] = useState(false)
  const getInfo = async () => {
    try{
      const i = await api.get(`infoCourse/${props.openCourse}`)
      setInfoCourse(i.data.response)
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{ getInfo()},[props.openCourse])
  return(
    <div className="flex flex-col">
      <div className="px-4 pb-1">
        <p className="text-neutral-300 text-lg font-bold">Página do Curso</p>
      </div>
      <Card  component={
        infoCourse === null ? <Loading/> :
          <div className="flex flex-1 items-center">
            <div className="border bg-white rounded w-[200px] h-[100px] flex justify-center items-center overflow-hidden p-1 shadow-black shadow-md">
              <RenderImageGallery className="w-full h-full" imageId={infoCourse.image}/>
            </div>
            <div className="flex flex-col flex-1 pl-3 border-l border-slate-300 ml-3 ">
              <p className="text-neutral-400 font-light"><strong>Cód.: </strong>{infoCourse.id}</p>
              <p className="text-neutral-400 font-light"><strong>Título: </strong>{infoCourse.name}</p>
              <p className="text-neutral-400 font-light"><strong>Descrição: </strong>{infoCourse.description}</p>
              <p className="text-neutral-400 font-light"><strong>Por: </strong>{infoCourse.author}</p>
              <p className="text-neutral-400 font-light"><strong>Tags: </strong>{infoCourse.tags}</p>
              <p className="text-neutral-400 font-light"><strong>Privacidade: </strong>{infoCourse.published == 1 ? "Público" : "Privado"}</p>
              <div className="flex justify-end items-center p-2 bg-gradient-to-r from-neutral-900 to-neutral-800 flex-1 w-full">
                <Button icon="faReply" name="Voltar" btn="muted" type="notline" size="sm" className='rounded-none' onClick={()=>props.setOpenCourse(null)} />
                <Button icon="faListCheck" name="Provas" btn="info" type="notline" size="sm" className='rounded-none'/>
                <Button icon="faChartColumn" name="Estatísticas" btn="info" type="notline" size="sm" className='rounded-none'/>
                <Button icon="faEnvelopeOpenText" name="Configurar E-mails" btn="info" type="notline" size="sm" className='rounded-none'/>
                <Button icon="faEdit" name="Editar Informações" btn="info" type="notline" size="sm" className='rounded-none' onClick={()=>setEditInfoCourse(true)}/>
              </div>
            </div>
        </div>
      }/>

      <p>Conteudo ...</p>

      { editInfoCourse ? <Modal component={
        <div>
          <TitleModal 
            icon='faEdit' close={()=>setEditInfoCourse(false)} 
            title='Editar Informações do Curso' 
            subtitle={`Edite as informações básicas do curso ${infoCourse?.name} `}/>
            {infoCourse ? 
              <EditInfoCourse infoCourse={infoCourse} setOpenCourse={props.setOpenCourse} setEditInfoCourse={setEditInfoCourse}/>
            : <Loading/>}
          </div>
      }/> : false }
      
    </div>
   
  )
}
