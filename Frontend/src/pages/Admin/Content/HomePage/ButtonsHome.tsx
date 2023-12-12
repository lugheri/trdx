import { FormEvent, useState, useEffect } from 'react';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../../../components/Buttons";
import { IButtonHomeConfig } from '../Dtos/homeConfig.dto';
import api from '../../../../services/api';
import { Loading } from '../../../../components/Loading';
import { Modal, TitleModal } from '../../../../components/Modal';
import { InputForm, InputNumberForm, SelectForm } from '../../../../components/Inputs';

export const ButtonsHome : React.FC<{typeStudent:'community'|'student'}> = (props) => {
  const [newButton, setNewButton ] = useState(false)
  const [editButton, setEditButton ] = useState<boolean|number>(false)
  const [deleteButton, setDeleteButton ] = useState<boolean|number>(false)

  const [ buttonsHome, setButtonsHome ] = useState<null | IButtonHomeConfig[]>(null)
  const [ error, setError ] = useState<null | string>(null)
  const getButtonsHome = async () => {
    try {
      const response = props.typeStudent === 'community' 
        ? await api.get("getButtonsCommunity") 
        : await api.get("getButtons");  
      if (response && response.data && response.data.success) {
        setButtonsHome(response.data.response);
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os botões:', err);
    }
  }
  useEffect(() => {getButtonsHome();}, [newButton,editButton,deleteButton]);

  return(
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <p className="py-4 text-neutral-200">
          <FontAwesomeIcon className="text-green-500/80" icon={Fas.faMousePointer}/> Botões                
        </p>
        <Button submit btn="info" icon="faPlus" name='Criar Novo Botão' size='sm' onClick={()=>setNewButton(true)} />
      </div>
      { error !== null ? <p className="text-red-500">{error}</p>
      : buttonsHome === null ? <Loading/>
        : buttonsHome.length === 0 
        ? <p className="text-red-500 ">Nenhum botao adicionado!</p> 
        : <div className="flex flex-wrap">
            <p className="pb-2 text-sm text-neutral-300 font-light w-full">Clique nos botões para configura-los!</p>
            {buttonsHome.map((button,key)=>
              <Button key={key} btn={button.type == 'default' ? 'success' : button.type } icon={button.icon} size='sm' name={button.name} onClick={()=>setEditButton(button.id)}/>)}
          </div>}     

    { newButton && <NewButton setNewButton={setNewButton} typeStudent={props.typeStudent}/>}
    { editButton && <EditButton setEditButton={setEditButton} button_id={editButton} setDeleteButton={setDeleteButton} typeStudent={props.typeStudent}/>}
    { deleteButton && <DeleteButton setEditButton={setEditButton} setDeleteButton={setDeleteButton}  button_id={deleteButton}  typeStudent={props.typeStudent}/>}

    </div>  
  )
}

//New Button
type NewButtonComponent = {
  setNewButton: React.Dispatch<React.SetStateAction<boolean>>;
  typeStudent:'community'|'student'
}
const NewButton: React.FC<NewButtonComponent> = (props) => {
  const typesButtons = [
    {type:'default',name:'Verde (Padrão)'},
    {type:'light',name:'Cinza'},
    {type:'info',name:'Azul'},
    {type:'warning',name:'Laranja'},
    {type:'error',name:'Vermelho'},
  ]
  const iconsButtons = [
    {icon:'faPlay',name:'Play'},
    {icon:'faArrowUpRightFromSquare',name:'Link'},
    {icon:'faQuestion',name:'Dúvidas'},
    {icon:'faListCheck',name:'Questoes'}
  ]
  const [error, setError ] = useState<string|null>(null)
  const [type, setType ] = useState<'light'|'info'|'success'|'warning'|'error'|'muted'|'default'>('default')
  const [icon, setIcon ] = useState('')
  const [name, setName ] = useState('')
  const [link, setLink ] = useState('')
  const [order, setOrder ] = useState(0)

  const createNewButton = async (e:FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        type:type,
        icon:icon,
        name:name,
        link:link,
        order:order
      }
      const response = props.typeStudent === 'community' 
        ? await api.post("newButtonCommunity",data) 
        : await api.post("newButton",data);  
      if (response && response.data && response.data.success) {
        props.setNewButton(false)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os botões:', err);
    }
  }
  return(<Modal component={
    <div>
      <TitleModal 
        icon='faPlus' close={()=>props.setNewButton(false)} 
        title='Novo Botão' 
        subtitle={`Adicionar botão na home page`}/>

      <form className="my-2 px-8 mb-8 " onSubmit={(e)=>createNewButton(e)}>
        <InputForm label="Título" required value={name} onChange={setName}/>        
        
        <div className="flex">
          <SelectForm className="mr-1" label="Cor" options={typesButtons} lableKey='name' valueKey='type' value={type} onChange={setType}/>
          <SelectForm className="mx-2" label="Icone" empty='Selecione um Ícone' options={iconsButtons} lableKey='icon' valueKey='type' value={icon} onChange={setIcon}/>
          <InputNumberForm className="ml-1" min={0} max={10} step={1} label="Ordem" value={order} onChange={setOrder}/>
        </div>
        <InputForm label="Link" required value={link} onChange={setLink}/>
        <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
          <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.setNewButton(false)} />
          { error ? <p className="text-red-300">{error}</p>
          : <Button submit btn="success" icon="faFloppyDisk" name='Criar Botão' type='outline' />}
        </div>
      </form>
    
    </div>}/>
  )
}

//Edit Button
type EditButtonComponent = {
  setEditButton: React.Dispatch<React.SetStateAction<number|boolean>>;
  setDeleteButton: React.Dispatch<React.SetStateAction<number|boolean>>;
  typeStudent:'community'|'student',
  button_id:boolean|number
}
const EditButton: React.FC<EditButtonComponent> = (props) => {
  const typesButtons = [
    {type:'default',name:'Verde (Padrão)'},
    {type:'light',name:'Cinza'},
    {type:'info',name:'Azul'},
    {type:'warning',name:'Laranja'},
    {type:'error',name:'Vermelho'},
  ]
  const iconsButtons = [
    {icon:'faPlay',name:'Play'},
    {icon:'faArrowUpRightFromSquare',name:'Link'},
    {icon:'faQuestion',name:'Dúvidas'},
    {icon:'faListCheck',name:'Questoes'}
  ]
  const [error, setError ] = useState<string|null>(null)
  const [type, setType ] = useState<'light'|'info'|'success'|'warning'|'error'|'muted'|'default'>('default')
  const [icon, setIcon ] = useState('')
  const [name, setName ] = useState('')
  const [link, setLink ] = useState('')
  const [order, setOrder ] = useState(0)

  const getInfoButton = async () => {
    try{
      const response =  props.typeStudent === 'community' 
      ? await api.get(`infoButtonCommunity/${props.button_id}`) 
      : await api.get(`infoButton/${props.button_id}`)

      if (response && response.data && response.data.success) {
        setType(response.data.response.type)
        setIcon(response.data.response.icon)
        setName(response.data.response.name)
        setLink(response.data.response.link)
        setOrder(response.data.response.order)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    }catch(err){ console.log(err) }
  }
  useEffect(()=>{getInfoButton()},[])

  const updateButton = async (e:FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        type:type,
        icon:icon,
        name:name,
        link:link,
        order:order
      }
      const response = props.typeStudent === 'community' 
        ? await api.patch(`updateButtonCommunity/${props.button_id}`,data) 
        : await api.patch(`updateButton/${props.button_id}`,data);  
      if (response && response.data && response.data.success) {
        props.setEditButton(false)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os botões:', err);
    }
  }
  return(<Modal component={
    <div>
      <TitleModal 
        icon='faEdit' close={()=>props.setEditButton(false)} 
        title='Editar Botão' 
        subtitle={`Altere os dados do botão na home page`}/>

      <form className="my-2 px-8 mb-8 " onSubmit={(e)=>updateButton(e)}>
        <InputForm label="Título" required value={name} onChange={setName}/>        
        
        <div className="flex">
          <SelectForm className="mr-1" label="Cor" options={typesButtons} lableKey='name' valueKey='type' value={type} onChange={setType}/>
          <SelectForm className="mx-2" label="Icone" empty='Selecione um Ícone' options={iconsButtons} lableKey='icon' valueKey='type' value={icon} onChange={setIcon}/>
          <InputNumberForm className="ml-1" min={0} max={10} step={1} label="Ordem" value={order} onChange={setOrder}/>
        </div>
        <InputForm label="Link" required value={link} onChange={setLink}/>
        <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
          <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.setEditButton(false)} />
          <Button btn="error" name='Deletar' type='outline' onClick={()=>props.setDeleteButton(props.button_id)} />
          { error ? <p className="text-red-300">{error}</p>
          : <Button submit btn="info" icon="faEdit" name='Editar Botão' type='outline' />}
        </div>
      </form>
    
    </div>}/>
  )
}

//Remove Button
type DeleteButtonComponent = {
  setDeleteButton: React.Dispatch<React.SetStateAction<number|boolean>>;
  setEditButton: React.Dispatch<React.SetStateAction<number|boolean>>;
  typeStudent:'community'|'student',
  button_id:boolean|number
}
const DeleteButton: React.FC<DeleteButtonComponent> = (props) => {
  const [error, setError ] = useState<string|null>(null)
  const deleteButton = async () => {   
    try {
      const response = props.typeStudent === 'community' 
        ? await api.delete(`deleteButtonCommunity/${props.button_id}`) 
        : await api.delete(`deleteButton/${props.button_id}`);  
      if (response && response.data && response.data.success) {
        props.setDeleteButton(false)
        props.setEditButton(false)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os botões:', err);
    }
  }
  return(<Modal component={
    <div>
      <TitleModal 
        icon='faTrash' close={()=>props.setDeleteButton(false)} 
        title='Remover Botão'/>

      <div className="flex p-6 mt-2 justify-center items-center">
        { error == null 
          ? <p className="text-red-400 text-lg">Confirmar remoção do botão da home?</p>
          : <p className="text-red-400 text-lg">{error}</p>
        }
      </div>  

      <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
        <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.setDeleteButton(false)} />
        <Button btn="error" icon="faTrash" name='Sim, Deletar' onClick={()=>deleteButton()} />
      </div>
    </div>}/>
  )
}