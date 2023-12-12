import { FormEvent, useState, useEffect } from 'react';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../../../components/Buttons";
import { ISocialButton } from '../Dtos/homeConfig.dto';
import api from '../../../../services/api';
import { Loading } from '../../../../components/Loading';
import { Modal, TitleModal } from '../../../../components/Modal';
import { InputForm, InputNumberForm, SelectForm } from '../../../../components/Inputs';

export const SocialButtons  = () => {
  const [newButton, setNewButton ] = useState(false)
  const [editButton, setEditButton ] = useState<boolean|number>(false)
  const [deleteButton, setDeleteButton ] = useState<boolean|number>(false)

  const [ socialButtons, setSocialButtons ] = useState<null | ISocialButton[]>(null)
  const [ error, setError ] = useState<null | string>(null)
  const getSocialButtonsHome = async () => {
    try {
      const response = await api.get("getSocialMedias");  
      if (response && response.data && response.data.success) {
        setSocialButtons(response.data.response);
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os botões:', err);
    }
  }
  useEffect(() => {getSocialButtonsHome();}, [newButton,editButton,deleteButton]);

  return(
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <p className="py-4 text-neutral-200">
          <FontAwesomeIcon className="text-green-500/80" icon={Fas.faThumbsUp}/> Redes Sociais                
        </p>
        <Button submit btn="info" icon="faPlus" name='Cadastrar Nova Rede' size='sm' onClick={()=>setNewButton(true)} />
      </div>
      { error !== null ? <p className="text-red-500">{error}</p>
      : socialButtons === null ? <Loading/>
        : socialButtons.length === 0 
        ? <p className="text-red-500 ">Nenhuma rede adicionada!</p> 
        : <div className="flex flex-wrap">
            <p className="pb-2 text-sm text-neutral-300 font-light w-full">Clique nos botões para configura-los!</p>
            {socialButtons.map((button,key)=>
              <Button key={key} 
                onClick={()=>setEditButton(button.id)}
                className="w-full md:w-auto lg:w-auto xl:w-auto 2xl:w-auto"
                type="outline"
                btn={ button.social_media === 'whatsapp' ? "success"
                    : button.social_media === 'telegram' ? "info"
                    : button.social_media === 'instagram' ? "warning"
                    : button.social_media === 'youtube' ? "error"
                    : button.social_media === 'twitter' ? "info"
                    : button.social_media === 'mail' ? "light"
                    : "light"
                  }
                icon={button.social_media === "mail" ? "faEnvelope" : null} 
                iconBrand={ button.social_media === 'whatsapp' ? "faWhatsapp"
                          : button.social_media === 'telegram' ? "faTelegram"
                          : button.social_media === 'instagram' ? "faInstagram"
                          : button.social_media === 'youtube' ? "faYoutube"
                          : button.social_media === 'twitter' ? "faXTwitter"
                          : null
                }
                name={button.text}/>)}
          </div>}     

    { newButton && <NewButton setNewButton={setNewButton}/>}
    { editButton && <EditButton setEditButton={setEditButton} button_id={editButton} setDeleteButton={setDeleteButton}/>}
    { deleteButton && <DeleteButton setEditButton={setEditButton} setDeleteButton={setDeleteButton}  button_id={deleteButton} />}

    </div>  
  )
}

//New Button
type NewButtonComponent = {
  setNewButton: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewButton: React.FC<NewButtonComponent> = (props) => {
  const socialMedias = [
    {type:'whatsapp',name:'Whatsapp'},
    {type:'telegram',name:'Telegram'},
    {type:'instagram',name:'Instagram'},
    {type:'youtube',name:'You tube'},
    {type:'twitter',name:'Twitter'},
    {type:'mail',name:'E-mail'}
  ]
  
  const [error, setError ] = useState<string|null>(null)
  const [socialMedia, setSocialMedia ] = useState<'whatsapp'|'telegram'|'instagram'|'youtube'|'twitter'|'mail'>('whatsapp')
  const [name, setName ] = useState('')
  const [link, setLink ] = useState('')
  const [order, setOrder ] = useState(0)

  const createNewSocialButton = async (e:FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        social_media:socialMedia,
        text:name,
        link:link,
        order:order
      }
      const response = await api.post("newSocialMedia",data);  
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
        title='Nova Rede Social' 
        subtitle={`Adicione uma rede ou email na home page`}/>

      <form className="my-2 px-8 mb-8 " onSubmit={(e)=>createNewSocialButton(e)}>
        <InputForm label="Título" required value={name} onChange={setName}/>        
        
        <div className="flex">
          <SelectForm className="mr-1" label="Rede" options={socialMedias} lableKey='name' valueKey='type' value={socialMedia} onChange={setSocialMedia}/>
          <InputNumberForm className="ml-1" min={0} max={10} step={1} label="Ordem" value={order} onChange={setOrder}/>
        </div>
        <InputForm label="Link" required value={link} onChange={setLink}/>
        <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
          <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.setNewButton(false)} />
          { error ? <p className="text-red-300">{error}</p>
          : <Button submit btn="success" icon="faFloppyDisk" name='Cadastrar Rede' type='outline' />}
        </div>
      </form>
    
    </div>}/>
  )
}

//Edit Button
type EditButtonComponent = {
  setEditButton: React.Dispatch<React.SetStateAction<number|boolean>>;
  setDeleteButton: React.Dispatch<React.SetStateAction<number|boolean>>;
  button_id:boolean|number
}
const EditButton: React.FC<EditButtonComponent> = (props) => {
  const socialMedias = [
    {type:'whatsapp',name:'Whatsapp'},
    {type:'telegram',name:'Telegram'},
    {type:'instagram',name:'Instagram'},
    {type:'youtube',name:'You tube'},
    {type:'twitter',name:'Twitter'},
    {type:'mail',name:'E-mail'}
  ]
  
  const [error, setError ] = useState<string|null>(null)
  const [socialMedia, setSocialMedia ] = useState<'whatsapp'|'telegram'|'instagram'|'youtube'|'twitter'|'mail'>('whatsapp')
  const [name, setName ] = useState('')
  const [link, setLink ] = useState('')
  const [order, setOrder ] = useState(0)


  const infoSocialMedia = async () => {
    try{
      const response = await api.get(`infoSocialMedia/${props.button_id}`)

      if (response && response.data && response.data.success) {
        setSocialMedia(response.data.response.social_media)
        setName(response.data.response.text)
        setLink(response.data.response.link)
        setOrder(response.data.response.order)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    }catch(err){ console.log(err) }
  }
  useEffect(()=>{infoSocialMedia()},[])

  const updateButton = async (e:FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        social_media:socialMedia,
        text:name,
        link:link,
        order:order
      }
      const response = await api.patch(`updateSocialMedia/${props.button_id}`,data);  
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
        title='Editar Rede Social' 
        subtitle={`Altere os dados da rede ou email`}/>

      <form className="my-2 px-8 mb-8 " onSubmit={(e)=>updateButton(e)}>
        <InputForm label="Título" required value={name} onChange={setName}/>        
        
        <div className="flex">
          <SelectForm className="mr-1" label="Rede" options={socialMedias} lableKey='name' valueKey='type' value={socialMedia} onChange={setSocialMedia}/>
          <InputNumberForm className="ml-1" min={0} max={10} step={1} label="Ordem" value={order} onChange={setOrder}/>
        </div>
        <InputForm label="Link" required value={link} onChange={setLink}/>
        <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
          <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.setEditButton(false)} />
          <Button btn="error" name='Deletar' type='outline' onClick={()=>props.setDeleteButton(props.button_id)} />
          { error ? <p className="text-red-300">{error}</p>
          : <Button submit btn="info" icon="faEdit" name='Editar Rede' type='outline' />}
        </div>
      </form>
    
    </div>}/>
  )
}

//Remove Button
type DeleteButtonComponent = {
  setDeleteButton: React.Dispatch<React.SetStateAction<number|boolean>>;
  setEditButton: React.Dispatch<React.SetStateAction<number|boolean>>;
  button_id:boolean|number
}
const DeleteButton: React.FC<DeleteButtonComponent> = (props) => {
  const [error, setError ] = useState<string|null>(null)
  const deleteButton = async () => {   
    try {
      const response = await api.delete(`deleteSocialMedia/${props.button_id}`);  
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
        title='Remover Rede Social'/>

      <div className="flex p-6 mt-2 justify-center items-center">
        { error == null 
          ? <p className="text-red-400 text-lg">Confirmar remoção da Rede Social?</p>
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