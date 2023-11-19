import React, { useState, useEffect, FormEvent } from 'react';

import { ICourse } from '../../../../Students/Dtos/courses.dto';

import { Button } from "../../../../../components/Buttons"
import { Card } from '../../../../../components/Cards';
import api from '../../../../../services/api';

import { InputForm, SelectForm, TextAreaForm } from '../../../../../components/Inputs';
import { RenderImageGallery } from '../../../../../components/RenderImageGallery';
import { PageGallery } from './PageGallery';
import { Modal, TitleModal } from '../../../../../components/Modal';

type EditInfoCourseComponent = {
  infoCourse: ICourse;
  setOpenCourse: React.Dispatch<React.SetStateAction<null|number>>;
  setEditInfoCourse: React.Dispatch<React.SetStateAction<boolean>>
}

export const CourseEditInfo : React.FC<EditInfoCourseComponent> = (props) => {
  const [ nome, setNome] = useState(props.infoCourse.name)
  //const [warningNome, setWarningNome] = useState(false)
  const [ descricao, setDescricao] = useState(props.infoCourse.description)
  const [ autor, setAutor] = useState(props.infoCourse.author)
  const [ comunidade, setComunidade] = useState(props.infoCourse.community)
  const [ published, setPublished] = useState(props.infoCourse.published)
  const [ tags, setTags] = useState(props.infoCourse.tags)
  const [ editImage, setEditImage ] = useState<null|'image'|'bg'|'thumb'>(null)
  const [ capaAtualCurso, setCapaAtualCurso ] = useState(props.infoCourse.image)
  const [ capaCurso, setCapaCurso ] = useState<number>(props.infoCourse.image ? props.infoCourse.image : 0)

  const [ backgroundAtualCurso, setBackgroundAtualCurso ] = useState(props.infoCourse.background_image)
  const [ backgroundCurso, setBackgroundCurso ] = useState<number>(props.infoCourse.background_image ? props.infoCourse.background_image : 0)
  const [ default_thumb, setDefaultThumb ] = useState<number>(props.infoCourse.default_thumb ? props.infoCourse.default_thumb : 0)

  const [ deleteCourse, setDeleteCourse ] = useState(false)

  useEffect(()=>{
    setEditImage(null)
    setCapaAtualCurso(capaCurso)
    setBackgroundAtualCurso(backgroundCurso)
    setDefaultThumb(default_thumb)
  },[capaCurso,backgroundCurso,default_thumb])

  const editInfoCourse = async (e:FormEvent) => {
    e.preventDefault()
    try{
      //props.setOpenCourse(null)   
      const data = {
        "image":typeof capaCurso == 'string' ? parseInt(capaCurso) : capaCurso,
        "background_image":typeof backgroundCurso == 'string' ? parseInt(backgroundCurso) : backgroundCurso,
        "default_thumb":typeof default_thumb == 'string' ? parseInt(default_thumb) : default_thumb,
        "author":autor,
        "name":nome,
        "description":descricao,
        "tags":tags,
        "community":typeof comunidade == 'string' ? parseInt(comunidade,10) : comunidade ,
        "completed":0,
        "published":typeof published == 'string' ? parseInt(published,10) : published ,
        "status":1
      }
      console.log(data)
      const r = await api.patch(`editCourse/${props.infoCourse.id}`, data)  
      console.log(r)
      //props.setOpenCourse(props.infoCourse.id)   
      props.setEditInfoCourse(false)
    }catch(e){console.log(e)}
  }
  const optionSelComunidade = [{"valor":0,"label":"Não"},{"valor":1,"label":"Sim"}]
  const optionSelPublished = [{"valor":0,"label":"Privado"},{"valor":1,"label":"Público"}]
  return (   
    <form className="flex flex-col " onSubmit={(e)=>editInfoCourse(e)}>
      <div className="flex">
        {/*Capas*/}
        <div className="flex flex-col w-1/2 mr-2 px-1 overflow-h-auto">
          <p className="text-neutral-50 mt-2">Imagens do Curso</p>
          <div className="flex justify-center items-center">
            <div className="flex flex-col w-[60%] h-[400px] justify-center items-center bg-slate-700 rounded m-1">              
              {backgroundAtualCurso != 0 && <RenderImageGallery className='w-full h-full' imageId={backgroundAtualCurso} />}
              <Button name="Alterar Imagem de Fundo" size='sm' icon="faEdit" btn="info" type="notline" onClick={()=>{setEditImage('bg')}} />         
            </div>
            <div className="flex flex-col w-[40%]">
              <div className="flex flex-col w-full h-[260px]  justify-center items-center bg-slate-700 rounded m-1">              
                {capaAtualCurso != 0 && <RenderImageGallery className='w-full h-full' imageId={capaAtualCurso} />}
                <Button name="Alterar Capa" size='sm' icon="faEdit" btn="info" type="notline" onClick={()=>{setEditImage('image')}} />         
              </div>

              <div className="flex flex-col w-full h-[140px] justify-center items-center bg-slate-700 rounded m-1">              
                {default_thumb != 0 && <RenderImageGallery className='w-full h-full' imageId={default_thumb} />}
                <Button name="Thumb Padrão" size='sm' icon="faEdit" btn="info" type="notline" onClick={()=>{setEditImage('thumb')}} />         
              </div>
             
            </div>
          </div>
        </div>
        { editImage && <Modal component={
            <div>
              <TitleModal 
                icon='faEdit' close={()=>setEditImage(null)} 
                title='Editar Imagem do Curso' 
                subtitle={`Edite a imagem de ${editImage == 'bg' ? 'Fundo' : editImage == 'image' ? 'Capa' : 'Thumb'} do curso`}/>
                <div className="flex flex-col flex-1">           
                  <Card className='flex-1 min-h-[250px] max-h-[300px] overflow-auto' component={
                    <div className="flex w-full flex-1">
                      { editImage == 'bg' ? 
                        <PageGallery page={1} setImage={setBackgroundCurso}/>
                      : editImage == 'image' ? 
                        <PageGallery page={1} setImage={setCapaCurso}/>
                      : <PageGallery page={1} setImage={setDefaultThumb}/>}
                    </div>}/>
                </div>
            </div>
        }/> }

        <div className="flex flex-col w-[600px] font-light overflow-auto">
          <div className="flex flex-col w-full ">
            <InputForm label="Nome" required placeholder='Nome do Curso' value={nome} onChange={setNome}/>
          </div>
          <div className="flex flex-col w-full ">
            <TextAreaForm label="Descrição" placeholder='Descrição do Curso' value={descricao} onChange={setDescricao}/>
          </div>
          <div className="flex flex-col w-full ">
            <InputForm label="Autor" placeholder='Nome do Autor do Curso' value={autor} onChange={setAutor}/>
          </div>
          <div className="flex w-full ">
            <SelectForm className="mr-1" label="Comunidade" options={optionSelComunidade} valueKey="valor"  lableKey="label" value={comunidade} onChange={setComunidade}/>
            <SelectForm className="ml-1" label="Privacidade" options={optionSelPublished} valueKey="valor"  lableKey="label" value={published} onChange={setPublished}/>
          </div>
          <div className="flex flex-col w-full ">
            <TextAreaForm 
              label="Tags(Separadas por ponto e vírgula ';')" 
              placeholder='Insira tags para ajudar os alunos a encontrar este curso nas buscas' 
              value={tags} onChange={setTags}/>
          </div>
        </div>    

        {deleteCourse && <DeleteCourse 
                            courseId={props.infoCourse.id} courseName={props.infoCourse.name} 
                            setDeleteCourse={setDeleteCourse} 
                            setEditInfoCourse={props.setEditInfoCourse}
                            setOpenCourse={props.setOpenCourse}/>}

    </div>
    <div className="flex border-t mt-4 p-2 justify-end items-center">
      <Button name="Cancelar" btn="muted"  type='outline' onClick={()=>props.setEditInfoCourse(false)} />
      <Button name="Remover Curso" icon="faTrash" btn="error" onClick={()=>setDeleteCourse(true)} /> 
      <Button submit name="Salvar Alterações" icon="faSave" btn="success" /> 
    </div> 
  </form>
  )
}

type DeleteCourseComponent = {
  courseId:number,
  courseName:string,
  setDeleteCourse:React.Dispatch<React.SetStateAction<boolean>>,
  setEditInfoCourse:React.Dispatch<React.SetStateAction<boolean>>,
  setOpenCourse:React.Dispatch<React.SetStateAction<number|null>>,
}
const DeleteCourse : React.FC<DeleteCourseComponent> = (props) => {
  const removeCourse = async () => {
    try{
      const data = { "status":0 }
      await api.patch(`editCourse/${props.courseId}`, data) 
    }catch(e){console.log(e)}

    props.setDeleteCourse(false)
    props.setEditInfoCourse(false)
    props.setOpenCourse(null)
  }
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon='faTrash' title="Remover Curso" close={()=>props.setDeleteCourse(false)}  />
        <p className="text-white font-xl mt-8 mx-4 mb-4">
          Confirmar a remoção do curso <b>({props.courseId}) {props.courseName}</b></p>
        <div className="flex border-t mt-4 p-2 justify-end items-center">
          <Button name="Cancelar" btn="muted"  type='outline' onClick={()=>props.setDeleteCourse(false)} />
          <Button name="Sim, Remover" icon="faTrash" btn="error" onClick={()=>removeCourse()} /> 
        </div> 
      
      </div>
    }/>
  )
}