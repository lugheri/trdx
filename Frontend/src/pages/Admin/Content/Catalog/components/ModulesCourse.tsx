import { useEffect, useState, FormEvent} from "react";
import { Card } from "../../../../../components/Cards"
import api from "../../../../../services/api";
import { ICourse, IModuleCourse } from "../../Dtos/courses.dto"

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loading } from "../../../../../components/Loading";
import { Button } from "../../../../../components/Buttons";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { InputForm, InputNumberForm, SelectForm, TextAreaForm } from "../../../../../components/Inputs";
import { ModuleOrder } from "./ModuleOrder";

type ModuleCourseComponent = {
  infoCourse:ICourse
  setSetupModule: React.Dispatch<React.SetStateAction<null | number>>
}
export const ModuleCourse : React.FC<ModuleCourseComponent> = (props) => {
  const [ modules, setModules ] = useState<null | IModuleCourse[]>(null)
  const [ error, setError ] = useState<null | string>(null)
  const [ newModule, setNewModule ] = useState<null | number>(null)  
  const [ orderModule, setOrderModule ] = useState<null | number>(null)

  const getModule = async () => {
    try{
      const response = await api.get(`modulesCourse/${props.infoCourse.id}`)
      if (response && response.data && response.data.success) {
        setModules(response.data.response)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{ getModule()},[newModule,orderModule])

  return(
    <Card component={
        <div className="flex flex-col  w-full">
          { error ? <p className="text-red-500">{error}</p>
            : modules === null ? <Loading/> 
              : modules.length === 0 
                ? <div className="flex flex-col justify-center items-center w-full p-4 ">
                    <FontAwesomeIcon className="text-teal-500/60 text-4xl my-2" icon={Fas.faCube}/>
                    <p className="text-white font-light my-4">Este curso ainda não possui nenhum módulo</p> 
                    <Button name="Criar Novo Módulo" btn="success" type="outline" icon="faFolderPlus" onClick={()=>setNewModule(props.infoCourse.id)}/>
                  </div>
                : <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <p className="text-neutral-100">
                        <FontAwesomeIcon className="text-teal-500/50" icon={Fas.faCube}/> Módulos do Curso: {modules.length}
                      </p>
                      <div className="flex">
                        <Button name="Reordenar Módulos" btn="success" type="notline" icon="faSortNumericAsc" onClick={()=>setOrderModule(props.infoCourse.id)}/>
                        <Button name="Criar Novo Módulo" btn="success" icon="faFolderPlus" onClick={()=>setNewModule(props.infoCourse.id)}/>
                      </div>                      
                    </div>    
                    <div className="flex bg-neutral-950/50 flex-wrap rounded my-2 p-2">
                      {modules.map((module,key)=><ModuleItem key={key} module={module} setSetupModule={props.setSetupModule}/>)}
                    </div>   
                    {orderModule && <ModuleOrder course_id={orderModule} modules={modules} close={setOrderModule}/> }                      
                  </div>}
          {newModule && <NewModule courseId={newModule} setNewModule={setNewModule} totalModule={modules?modules.length:0}/>} 
          
        </div>}/>    
  )
}

type ModuleItemComponent = {
  module:IModuleCourse,
  setSetupModule: React.Dispatch<React.SetStateAction<null | number>>,  
}
const ModuleItem : React.FC<ModuleItemComponent> = (props) => {
  return(
    <div className={`flex flex-col justify-center items-center w-[19%] p-4 h-[270px] m-1 rounded relative
                    border bg-gray-800/50 hover:bg-gray-800 text-white
                    ${props.module.visibility == 1 ? "border-teal-500" : "border-red-500" }`} >
      <p className={`text-xl absolute top-2 left-2 
                    ${props.module.visibility == 1 ? "text-teal-500/50" : "text-red-500/50" }`}>
        {props.module.order}º
      </p>
      <FontAwesomeIcon className={`text-teal-500/50 text-6xl mb-2 
                                 ${props.module.visibility == 1 ? "text-teal-500/50" : "text-red-500/50" }`}
        icon={ props.module.type_module == 'Fase' ? Fas.faPlay 
                              : props.module.type_module == 'Módulo' ? Fas.faFolder :  Fas.faGift}/>
      <p className="text-xs font-light text-center mb-2">Tipo: {props.module.type_module}</p>
      <p className="text-sm my-3 text-center">{props.module.module}</p>
      {props.module.visibility == 1 ? <b className="text-teal-500">Público</b> 
      : <b className="text-red-500">Privado</b>}
      
      
      <Button icon="faWrench" btn="success" type="notline" name="Configurar" className="mt-8" onClick={()=>props.setSetupModule(props.module.id)} />
    </div>
  )
}

type NewModuleComponent = {
  courseId:number,
  setNewModule: React.Dispatch<React.SetStateAction<null | number>>,
  totalModule:number
}
const NewModule : React.FC<NewModuleComponent> = (props)=> {
  const [ error, setError ] = useState<null | string>(null)
  const [ name, setName ] = useState("")
  const [ typeModule, setTypeModule ] = useState('Módulo')
  const [ description, setDescription ] = useState("")
  const [ order, setOrder ] = useState(props.totalModule+1)
  const [ visibility, setVisibility ] = useState('1')
  
  const typeModules = [
    {type:'Módulo',name:'Módulo Padrão'},
    {type:'Fase',name:'Fase'},
    {type:'Bònus',name:'Bônus'},
  ]
  const typeVisibility = [
    {type:1,name:'Público'},
    {type:0,name:'Privado'}
  ]
  
  const saveNewModule = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        course_id:props.courseId,
        type_module:typeModule,
        module:name,
        description:description,
        visibility:parseInt(visibility),
        order:props.totalModule+1,      
      }
      console.log('data',data)
      const response = await api.post('newModuleCourse/',data)
      if (response && response.data && response.data.success) {
        props.setNewModule(null)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }

  }
  return(<Modal component={
    <div className="flex flex-col">
      <TitleModal icon="faFolderPlus" title="Crie um novo Módulo" close={()=>props.setNewModule(null)}/> 
      <form onSubmit={(e)=>saveNewModule(e)}>
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
          <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.setNewModule(null)} />
          <Button btn="success" icon="faFolderPlus" name='Cadastrar Módulo' submit />
        </div>
      </form>
    </div>
  }/>)
}





