import { useState, useEffect, FormEvent } from 'react';
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"
import { LevelType } from '../../../Dtos/levels.dto';
import api from '../../../../services/api';
import { Card } from '../../../../components/Cards';
import { Modal, TitleModal } from '../../../../components/Modal';
import { InputForm, TextAreaForm } from '../../../../components/Inputs';

export const Levels = () => {
  const [ newLevel, setNewLevel ] = useState<boolean>(false)
  const [ editLevel, setEditLevel ] = useState<boolean|number>(false)
  const [ update, setUpdate ] = useState<boolean>(false)
  const [ levels, setLevels] = useState<LevelType[]>([])
  const getLevels = async () => {
    try{
      const lvs = await api.get('listLevels/1')
      setLevels(lvs.data.response)
      setUpdate(false)
    }catch(e){
      console.log(e)
    }
  }
  
  useEffect(()=>{
    console.log('getLevels')
    getLevels()
  },[update])
  
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faKey" 
        title="Níveis de Acesso" 
        description="Crie os níveis de acesso dos para os cargos de usuários"
        rightComponent={<Button btn="success" border='circle' icon="faPlus" name="Novo Nível" onClick={()=>setNewLevel(true)} /> }/>

      <div className="" >       
        { levels.length == 0 ? (
          <div className="flex flex-col justify-center items-center h-80 text-slate-600 dark:text-slate-300">
            <FontAwesomeIcon icon={Fas.faFaceFrown} className="opacity-70 text-4xl" />
            <p className="fonr-bold text-lg"> Nenhum nivel cadastrado</p>            
          </div>
        ) : levels.map((level,key)=>(
          <Card key={key} className="w-[175px] h-[200px] py-0 px-0 block float-left overflow-auto" component={
            <div className="flex flex-col w-full">
              <div className="flex flex-1 flex-col justify-between items-center py-4 px-2">
                <FontAwesomeIcon className="text-4xl text-slate-400 pb-2" icon={Fas.faKey}/>
                <p className="font-semibold text-lg text-gray-700 dark:text-gray-300">{ level.name }</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{ level.description }</p>
              </div>
              <div className="border-t flex w-full justify-end items-center p-2 bg-slate-50 dark:bg-gray-700 dark:border-gray-600">
                <Button title="Configurar Acessos" icon="faWrench" size="sm" btn="muted" type="notline" onClick={()=>setEditLevel(level.id)}/>                
                <Button title="Editar Nível" icon="faEdit" size="sm" btn="info" type="notline" onClick={()=>setEditLevel(level.id)}/>                
              </div>
            </div>
          }/>
          
        ))}
      </div>
      {/*MODAIS */}  
      { newLevel ? (<Modal className="w-[90%] md:w-1/2 lg:w-1/4" component={<NewLevel opened={setNewLevel} update={setUpdate}/>}/>):false}
      { editLevel ? (<Modal className="w-[90%] md:w-1/2 lg:w-1/4" component={<EditLevel levelId={editLevel} opened={setEditLevel} update={setUpdate}/>}/>):false}
    </div>
  )
}

//Modais
/*
* New Level
*/
const NewLevel:React.FC<{opened: React.Dispatch<React.SetStateAction<boolean>>;
                         update: React.Dispatch<React.SetStateAction<boolean>>}>= (props) => {
  const [name,setName]=useState<string>("")
  const [description,setDescription]=useState<string>("")
  const createLevel = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const dataLevel = {
        "name":name,
        "description":description
      }
      await api.post('newLevel',dataLevel)
      props.update(true)
      props.opened(false)
    }catch(e){
      console.log(e)
    }    
  }
  return(
    <div className="flex flex-col">
      <TitleModal icon='faPlus' title='Criar Nível' subtitle='Preencha os dados e crie um novo Nível' close={()=>props.opened(false)}/>
      <form onSubmit={(e)=>createLevel(e)}>
        <div className="py-4">
          <InputForm value={name} label="Nível" placeholder="Nome do Nivel" onChange={setName} required/>
          <TextAreaForm value={description} label="Descrição" placeholder="Breve Descrição do Nivel" onChange={setDescription}/>
        </div>
        <div className="border-t dark:border-slate-600 flex justify-end items-center pt-3">
          <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.opened(false)}/>
          <Button submit name="Criar Nível" icon="faPlus" size="sm" btn="info"/>
        </div>  
      </form>
    </div>
  )
}

/*
* Edit Level
*/
const EditLevel:React.FC<{levelId:number|boolean; 
                          opened:React.Dispatch<React.SetStateAction<boolean|number>>;
                          update:React.Dispatch<React.SetStateAction<boolean>>}> = (props) => {
  const [ deleteLevel, setDeleteLevel ] = useState<number|boolean>(false)
  const [ name, setName ] = useState<string>("")
  const [ description, setDescription ] = useState<string>("")

  const getInfoLevel = async() => {
    try{
      const infoLevel = await api.get(`GetLevel/${props.levelId}`)
      setName(infoLevel.data.response.name)
      setDescription(infoLevel.data.response.description)
    }catch(e){
      console.log(e)
    }
  }

  const saveDataLevel = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const dataLevel = {
        "name":name,
        "description":description
      }
      await api.patch(`EditLevel/${props.levelId}`,dataLevel)
      props.update(true)
      props.opened(false)
    }catch(e){
      console.log(e)
    }    
  }
  useEffect(()=>{
    getInfoLevel()
  },[])

  return(
    <div className="flex flex-col">
      <TitleModal icon='faEdit' title='Editar Nível' subtitle='Verifique, edite ou remova os dados do Nível' close={()=>props.opened(false)}/>
      <form onSubmit={(e)=>saveDataLevel(e)}>
        <div className="py-4">
          <InputForm value={name} label="Nível" placeholder="Nome do Nivel" onChange={setName} required/>
          <TextAreaForm value={description} label="Descrição" placeholder="Breve Descrição do Nivel" onChange={setDescription}/>
        </div>
        <div className="border-t dark:border-slate-600 flex justify-end items-center pt-3">
          <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.opened(false)}/>
          <Button name="Remover" icon="faTrash" size="sm" btn="error" type="outline" className="mx-0" onClick={()=>setDeleteLevel(props.levelId)}/>
          <Button submit name="Salvar alterações" icon="faSave" size="sm" btn="success"/>
        </div>  
      </form>    
      {deleteLevel ? (<Modal component={<RemoveLevel levelId={deleteLevel} opened={setDeleteLevel} openParent={props.opened} update={props.update}/>}/>) :false}
    </div>
  )
}

/*
* Remove Level
*/
const RemoveLevel: React.FC<{levelId:number|boolean;
                              opened:React.Dispatch<React.SetStateAction<number|boolean>>
                              openParent:React.Dispatch<React.SetStateAction<number|boolean>>
                              update:React.Dispatch<React.SetStateAction<boolean>>}> = (props) => {
  const removerLevel = async () => {
    try{
      await api.delete(`RemoveLevel/${props.levelId}`)
      props.openParent(false)
      props.opened(false)
      props.update(true)

    }catch(e){
      console.log(e)
    }
  }

  const [ name, setName ] = useState<string>("")
  const getInfoLevel = async() => {
    try{
      const infoLevel = await api.get(`GetLevel/${props.levelId}`)
      setName(infoLevel.data.response.name)
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{
    getInfoLevel()
  },[])

  return(
    <div className="flex flex-col">
      <TitleModal icon='faTrash' title='Remover Nível' subtitle='Confirme os dados do nível antes de remover!' close={()=>props.opened(false)}/>
      <div className="p-4">
        <p className="text-xl dark:text-slate-300">Confirmar a remoção no nível {name}?</p>
      </div>
      <div className="border-t dark:border-slate-600 flex justify-end items-center pt-3">
        <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.opened(false)}/>
        <Button name="Sim, Remover" icon="faTrash" size="sm" btn="error" type="outline" className="mx-0" onClick={()=>removerLevel()}/>
        </div>  
    </div>
  )
}