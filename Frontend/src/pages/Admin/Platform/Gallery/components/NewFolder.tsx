import React, { FormEvent, useState } from "react"
import { Modal, TitleModal } from "../../../../../components/Modal"
import { InputForm, TextAreaForm } from "../../../../../components/Inputs";
import { Button } from "../../../../../components/Buttons";
import api from "../../../../../services/api";

type NewFolderComponent = {
  setNewFolder:React.Dispatch<React.SetStateAction<boolean>>;
}
export const NewFolder:React.FC<NewFolderComponent> = (props) => {
  const [ name, setName ] = useState("")
  const [ description, setDescription ] = useState("")

  const createNewFolder = async (e:FormEvent) =>{
    e.preventDefault()
    try{
      const data = {
          name:name,
          description:description}
      await api.post('newFolder',data)
      props.setNewFolder(false)
    }catch(err){
      console.log(err)
    }
  }
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal
          icon='faFolderPlus'
          title='Nova Pasta'
          subtitle='Crie uma nova pasta de imagens para galeria'
          close={()=>props.setNewFolder(false)}/>
        
        <form className="flex flex-col flex-1" onSubmit={(e)=>createNewFolder(e)}>
          <div className="flex flex-col w-full py-4">
            <div className="flex flex-col w-full ">
              <InputForm label="Nome" placeholder='Nome da Pasta' required value={name} onChange={setName}/>
            </div>
            <div className="flex w-full">
              <TextAreaForm label="Descrição" placeholder='Nome da Pasta' value={description} onChange={setDescription}/>
            </div>
            <div className="flex border-t mt-4 py-2 justify-end items-center">
              <Button name="Cancelar" btn="muted" type='notline' onClick={()=>props.setNewFolder(false)} />
              <Button name="Prosseguir" btn="info" submit />
            </div>  
          </div> 
        </form>
      </div>}/>
  )
}