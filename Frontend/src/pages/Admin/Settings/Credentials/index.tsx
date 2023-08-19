import { useState, useEffect, FormEvent } from 'react';
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"
import api from '../../../../services/api';
import { Card } from '../../../../components/Cards';
import { Modal, TitleModal } from '../../../../components/Modal';
import { InputForm, SelectForm, TextAreaForm } from '../../../../components/Inputs';
import { CredentialType } from '../../../Dtos/credential.dto';
import { LevelType } from '../../../Dtos/levels.dto';

export const Credentials = () => {
  const [ newCredential, setNewCredential ] = useState<boolean>(false)
  const [ editCredential, setEditCredential ] = useState<boolean|number>(false)
  const [ update, setUpdate ] = useState<boolean>(false)
  const [ credentials, setCredentials] = useState<CredentialType[]>([])
  const getCredentials = async () => {
    try{
      const crd = await api.get('listCredentials/1')
      setCredentials(crd.data.response)
      setUpdate(false)
    }catch(e){
      console.log(e)
    }
  }

 
  /*const nameLevels = async(levelId:number):Promise<any> => {
    try{
      const lvls = await api.get(`GetLevel/${levelId}`)
      const name=lvls.data.response.name
      return name
    }catch(e){
      console.log(e)
    }    
  }*/
  
  useEffect(()=>{
    getCredentials()
  },[update])
  
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faIdCardClip" 
        title="Cargos" 
        description="Crie os cargos dos para os credenciar os usuários"
        rightComponent={<Button btn="success" border='circle' icon="faPlus" name="Novo Cargo" onClick={()=>setNewCredential(true)} /> }/>

      <div className="" >       
        { credentials.length == 0 ? (
          <div className="flex flex-col justify-center items-center h-80 text-slate-600 dark:text-slate-300">
            <FontAwesomeIcon icon={Fas.faFaceFrown} className="opacity-70 text-4xl" />
            <p className="fonr-bold text-lg">Nenhum cargo cadastrado</p>            
          </div>
        ) : credentials.map((credential,key)=>(
              <Card key={key} className="w-[190px] h-[240px] py-0 px-0 block float-left overflow-auto" component={
                <div className="flex flex-col w-full">
                  <div className="flex flex-1 flex-col justify-between items-center py-4 px-2">
                    <FontAwesomeIcon className="text-4xl text-slate-400 pb-2" icon={Fas.faIdBadge}/>
                    <p className="font-semibold text-lg text-gray-700 dark:text-gray-300">{ credential.name }</p>
                    <NameLevel level={credential.level_id} update={update}/>
                   
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{ credential.description }</p>
                  </div>
                  <div className="border-t flex w-full justify-end items-center p-2 bg-slate-50 dark:bg-gray-700 dark:border-gray-600">
                    <Button title="Editar Cargo" icon="faEdit" size="sm" btn="info" type="outline" onClick={()=>setEditCredential(credential.id)}/>                
                  </div>
                </div>
              }/>
          ))          
        }
      </div>
      {/*MODAIS */}  
      { newCredential ? (<Modal className="w-[90%] md:w-1/2 lg:w-1/4" component={<NewCredential opened={setNewCredential} update={setUpdate}/>}/>):false}
      { editCredential ? (<Modal className="w-[90%] md:w-1/2 lg:w-1/4" component={<EditCredential credentialId={editCredential} opened={setEditCredential} update={setUpdate}/>}/>):false}
    </div>
  )
}

const NameLevel:React.FC<{level: number; update:boolean}>= (props) => {
  const [name,setName]=useState("")
  const nameLevel = async() => {
    try{
      const lvls = await api.get(`GetLevel/${props.level}`)
      setName(lvls.data.response.name)
    }catch(e){
      console.log(e)
    }    
  }
  useEffect(()=>{
    nameLevel()
  },[props.update])
  
  return(
    <p className="font-semibold text-xs text-gray-700 dark:text-gray-300">
      <FontAwesomeIcon className="text-slate-400 mr-1" icon={Fas.faKey}/>
                    {name}
    </p>
  )
}

//Modais
/*
* New Credential
*/
const NewCredential:React.FC<{opened: React.Dispatch<React.SetStateAction<boolean|number|any>>;
                              update: React.Dispatch<React.SetStateAction<boolean>>}>= (props) => {
  const [name,setName]=useState<string>("")
  const [levelId,setLevelId]=useState<string>('0')
  const [description,setDescription]=useState<string>("")
  const createCredential = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const dataCredential = {
        "name":name,
        "level_id":parseInt(levelId),
        "description":description
      }
      await api.post('newCredential',dataCredential)
     
      props.update(true)
      props.opened(false)
    }catch(e){
      console.log(e)
    }    
  }

  const [ levels, setLevels ] = useState<LevelType|[]>([])
  const getLevels = async() => {
    try{
      const lvls = await api.get('listLevels/1')
      setLevels(lvls.data.response)
    }catch(e){
      console.log(e)
    }    
  }
  useEffect(()=>{
    getLevels()
  },[])
  
  return(
    <div className="flex flex-col">
      <TitleModal icon='faPlus' title='Criar Nível' subtitle='Preencha os dados e crie um novo Nível' close={()=>props.opened(false)}/>
      <form onSubmit={(e)=>createCredential(e)}>
        <div className="py-4">
          <InputForm value={name} label="Cargo" placeholder="Nome do Cargo" onChange={setName} required/>
          <SelectForm value={levelId} empty="Selecione um nível" options={levels} valueKey="id" lableKey="name" onChange={setLevelId}/>          
          <TextAreaForm value={description} label="Descrição" placeholder="Breve Descrição do Cargo" onChange={setDescription}/>
        </div>
        <div className="border-t dark:border-slate-600 flex justify-end items-center pt-3">
          <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.opened(false)}/>
          <Button submit name="Criar Cargo" icon="faPlus" size="sm" btn="info"/>
        </div>  
      </form>
    </div>
  )
}

/*
* Edit Credential
*/
const EditCredential:React.FC<{credentialId:number|boolean; 
                          opened:React.Dispatch<React.SetStateAction<boolean|number>>;
                          update:React.Dispatch<React.SetStateAction<boolean>>}> = (props) => {
  const [ deleteCredential, setDeleteCredential ] = useState<number|boolean>(false)
  const [ name, setName ] = useState<string>("")
  const [ levelId, setLevelId ] = useState<string>('0')  
  const [ description, setDescription ] = useState<string>("")

  const getInfoCredential = async() => {
    try{
      const infoCredential = await api.get(`getCredential/${props.credentialId}`)
      setName(infoCredential.data.response.name)
      setLevelId(infoCredential.data.response.level_id)
      setDescription(infoCredential.data.response.description)
    }catch(e){
      console.log(e)
    }
  }

  const [ levels, setLevels ] = useState<LevelType|[]>([])
  const getLevels = async() => {
    try{
      const lvls = await api.get('listLevels/1')
      setLevels(lvls.data.response)
    }catch(e){
      console.log(e)
    }    
  }

  const saveDataCredential = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const dataLevel = {
        "name":name,
        "level_id":parseInt(levelId),
        "description":description
      }
      await api.patch(`EditCredential/${props.credentialId}`,dataLevel)
      props.update(true)
      props.opened(false)
    }catch(e){
      console.log(e)
    }    
  }
  useEffect(()=>{
    getInfoCredential()
    getLevels()
  },[])

  return(
    <div className="flex flex-col">
      <TitleModal icon='faEdit' title='Editar Cargo' subtitle='Verifique, edite ou remova os dados do Cargo' close={()=>props.opened(false)}/>
      <form onSubmit={(e)=>saveDataCredential(e)}>
        <div className="py-4">
          <InputForm value={name} label="Cargo" placeholder="Nome do Cargo" onChange={setName} required/>
          <SelectForm value={levelId} empty="Selecione um nível" options={levels} valueKey="id" lableKey="name" onChange={setLevelId}/>
          <TextAreaForm value={description} label="Descrição" placeholder="Breve Descrição do Cargo" onChange={setDescription}/>
        </div>
        <div className="border-t dark:border-slate-600 flex justify-end items-center pt-3">
          <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.opened(false)}/>
          <Button name="Remover" icon="faTrash" size="sm" btn="error" type="outline" className="mx-0" onClick={()=>setDeleteCredential(props.credentialId)}/>
          <Button submit name="Salvar alterações" icon="faSave" size="sm" btn="success"/>
        </div>  
      </form>    
      {deleteCredential ? (<Modal component={<RemoveCredential credentialId={deleteCredential} opened={setDeleteCredential} openParent={props.opened} update={props.update}/>}/>) :false}
    </div>
  )
}

/*
* Remove Credential
*/
const RemoveCredential: React.FC<{credentialId:number|boolean;
                              opened:React.Dispatch<React.SetStateAction<number|boolean>>
                              openParent:React.Dispatch<React.SetStateAction<number|boolean>>
                              update:React.Dispatch<React.SetStateAction<boolean>>}> = (props) => {
  const removerCredencial = async () => {
    try{
      await api.delete(`RemoveCredential/${props.credentialId}`)
      props.openParent(false)
      props.opened(false)
      props.update(true)

    }catch(e){
      console.log(e)
    }
  }

  const [ name, setName ] = useState<string>("")
  const getInfoCredential = async() => {
    try{
      const infoCredential = await api.get(`getCredential/${props.credentialId}`)
      setName(infoCredential.data.response.name)
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{
    getInfoCredential()
  },[])

  return(
    <div className="flex flex-col">
      <TitleModal icon='faTrash' title='Remover Cargo' subtitle='Confirme os dados do Cargo antes de remover!' close={()=>props.opened(false)}/>
      <div className="p-4">
        <p className="text-xl dark:text-slate-300">Confirmar a remoção no cargo: {name}?</p>
      </div>
      <div className="border-t dark:border-slate-600 flex justify-end items-center pt-3">
        <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.opened(false)}/>
        <Button name="Sim, Remover" icon="faTrash" size="sm" btn="error" type="outline" className="mx-0" onClick={()=>removerCredencial()}/>
        </div>  
    </div>
  )
}