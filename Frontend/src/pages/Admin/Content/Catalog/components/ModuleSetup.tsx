import { FormEvent, useEffect, useState } from "react";
import { IModuleCourse } from "../../Dtos/courses.dto"

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from "../../../../../components/Cards";
import { Button } from "../../../../../components/Buttons";
import api from "../../../../../services/api";
import { Loading } from "../../../../../components/Loading";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { InputForm, InputNumberForm, SelectForm, TextAreaForm } from "../../../../../components/Inputs";
import { LessonsModule } from "./LessonsModule";
import { LessonSetup } from "./LessonSetup";


type SetupModuleLessonsComponent = {
  course:string,
  moduleId:number,
  setSetupModule: React.Dispatch<React.SetStateAction<null | number>>
}
export const ModuleSetup : React.FC<SetupModuleLessonsComponent> = (props) => {
  const [ editModule, setEditModule ] = useState<IModuleCourse|null>(null)
  const [ deleteModule, setDeleteModule ] = useState<number|boolean>(false)

  const [ setupLesson, setSetupLesson ] = useState<null | number>(null)

  const [ infoModule, setInfoModule ] = useState<IModuleCourse|null>(null)
  const getInfo = async () => {
    try{
      const i = await api.get(`infoModuleCourse/${props.moduleId}`)
      setInfoModule(i.data.response)
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{ getInfo()},[editModule])




  return(
    <div className="flex flex-col">
      { setupLesson ? <LessonSetup infoModule={infoModule} course={props.course} lessonId={setupLesson} setLessonSetup={setSetupLesson} />
      : infoModule === null ? <Loading/> : 
      <>
        <Card component={
          <div className="flex flex-col w-full">
            <div className="flex justify-between mb-2">
              <p className="text-neutral-100">
                <FontAwesomeIcon className="text-teal-500/50" icon={Fas.faCube}/> Informações do Módulo
              </p>
              <Button icon="faReply" btn="muted" name="Voltar" onClick={()=>props.setSetupModule(null)}/>
            </div>
          <div className="flex w-full">
            <div className="flex flex-col justify-center items-center w-1/6 border-r border-neutral-600">
              <FontAwesomeIcon className="opacity-50 text-teal-500 text-4xl mb-2"
                icon={ infoModule.type_module == 'Fase' ? Fas.faPlay 
                    : infoModule.type_module == 'Módulo' ? Fas.faFolder :  Fas.faGift}/>
              <p className="text-white text-xs font-light">{infoModule.order}º</p>
              <p className="text-white text-xs font-light">{infoModule.type_module}</p>
              {infoModule.visibility == 1 ? <p className="text-green-500">Público</p> : <p className="text-red-500">Privado</p>}
            </div>
            <div className="flex flex-col w-full justify-center px-4">
              <p className="text-white font-light"><b>Cód.: </b>{infoModule.id}</p>
              <p className="text-white font-light"><b>Módulo: </b>{infoModule.module}</p>
              <p className="text-white font-light"><b>Descrição: </b>{infoModule.description}</p>
              <p className="text-white font-light"><b>Curso: </b>{props.course}</p>
            </div>     
            <Button className="flex" icon="faEdit" btn="info" name="Editar" onClick={()=>setEditModule(infoModule)}/>  
          </div>
          { editModule && <EditModule module={infoModule} setDeleteModule={setDeleteModule} setEditModule={setEditModule}/>}
          { deleteModule && <DeleteModule moduleName={infoModule.module} moduleId={infoModule.id} setDeleteModule={setDeleteModule} setEditModule={setEditModule} setSetupModule={props.setSetupModule}/>}
        </div>}/>        
        <LessonsModule infoModule={infoModule} setupLesson={setupLesson} setSetupLessonModule={setSetupLesson} />
      </>
      }
      
      
          
    </div>)
}

type EditModuleComponent = {
  module:IModuleCourse,
  setEditModule:React.Dispatch<React.SetStateAction<IModuleCourse|null>>,
  setDeleteModule:React.Dispatch<React.SetStateAction<number|boolean>>,
}
const EditModule : React.FC<EditModuleComponent> = (props) => {
  const [ error, setError ] = useState<null | string>(null)
  const [ name, setName ] = useState(props.module.module)
  const [ typeModule, setTypeModule ] = useState(props.module.type_module)
  const [ description, setDescription ] = useState(props.module.description)
  const [ order, setOrder ] = useState(props.module.order)
  const [ visibility, setVisibility ] = useState(props.module.visibility)
  
  const typeModules = [
    {type:'Módulo',name:'Módulo Padrão'},
    {type:'Fase',name:'Fase'},
    {type:'Bònus',name:'Bônus'},
  ]
  const typeVisibility = [
    {type:1,name:'Público'},
    {type:0,name:'Privado'}
  ]
  
  const saveEditModule = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        course_id:props.module.course_id,
        type_module:typeModule,
        module:name,
        description:description,
        visibility:typeof visibility == 'string' ? parseInt(visibility,10) : visibility,
        order:order,      
      }
      console.log('data',data)
      const response = await api.patch(`editModuleCourse/${props.module.id}`,data)
      if (response && response.data && response.data.success) {
        props.setEditModule(null)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }

  
  }
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon="faEdit" title="Edite as informções do Módulo" close={()=>props.setEditModule(null)}/>
        <form onSubmit={(e)=>saveEditModule(e)}>
        <div className="flex flex-col min-w-[400px] p-4 mt-2 justify-center items-center">
          <div className="flex flex-col w-full">
          <InputForm required label="Módulo" value={name} onChange={setName} />
          <SelectForm label="Tipo de Módulo" options={typeModules} lableKey='name' valueKey='type' value={typeModule} onChange={setTypeModule}/>
          <TextAreaForm required label="Descrição" value={description} onChange={setDescription} />
          <div className="flex w-full">
            <SelectForm className="mr-1" label="Visibilidade" options={typeVisibility} lableKey='name' valueKey='type' value={visibility} onChange={setVisibility}/>
            <InputNumberForm className="ml-1" label="Ordem de Exibição" min={1} step={1} value={order} onChange={setOrder} />
          </div>
        </div>  
        </div>
        
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
          <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.setEditModule(null)} />
          <Button btn="error" name='Remover' icon='faTrash' onClick={()=>props.setDeleteModule(props.module.id)} />
          <Button btn="success" icon="faFolderPlus" name='Salvar Alterações Módulo' submit />
        </div>
      </form>
      </div>
    }/>
  )
}

type DeleteModuleComponent = {
  moduleName:string,
  moduleId:number
  setEditModule:React.Dispatch<React.SetStateAction<IModuleCourse|null>>,
  setDeleteModule:React.Dispatch<React.SetStateAction<number|boolean>>,
  setSetupModule:React.Dispatch<React.SetStateAction<null | number>>,
}
const DeleteModule : React.FC<DeleteModuleComponent> = (props) => {
  const removeModule = async () => {
    try{
      const data = { "status":0 }
      await api.patch(`editModuleCourse/${props.moduleId}`, data) 
    }catch(e){console.log(e)}
    props.setDeleteModule(false)
    props.setEditModule(null)
    props.setSetupModule(null)
  }

  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon="faTrash" title="Remover Módulo" close={()=>props.setDeleteModule(false)}/>
        <p className="text-white font-xl mt-8 mx-4 mb-4">
          Confirmar a remoção do módulo <b>({props.moduleId}) {props.moduleName}</b></p>
        <div className="flex border-t mt-4 p-2 justify-end items-center">
          <Button name="Cancelar" btn="muted"  type='outline' onClick={()=>props.setDeleteModule(false)} />
          <Button name="Sim, Remover" icon="faTrash" btn="error" onClick={()=>removeModule()} /> 
        </div> 
      </div>
    }/>
  )
}