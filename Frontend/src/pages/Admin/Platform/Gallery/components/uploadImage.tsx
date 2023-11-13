import React, { FormEvent, useEffect, useState } from "react"
import { Modal, TitleModal } from "../../../../../components/Modal"
import { InputForm, SelectForm, TextAreaForm } from "../../../../../components/Inputs";
import { Button } from "../../../../../components/Buttons";
import api from "../../../../../services/api";
import { IFolderGallery } from "../gallery.dto";
import { Loading } from "../../../../../components/Loading";

type NewFolderComponent = {
  folder:number;
  setUploadImage:React.Dispatch<React.SetStateAction<boolean>>;
}
export const UploadImageFolder:React.FC<NewFolderComponent> = (props) => {
  const [ selectedFile, setSelectedFile ] = useState<File|null>(null);
  const [ loading, setLoading ] = useState(false)
  const [ name, setName ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ folder, setFolder ] = useState(0)

  const [ listsFolders, setListsFolder ] = useState<IFolderGallery|null>(null)

  const getFolders = async () => {
    try{
      const folders = await api.get(`listFolders/1`)
      setListsFolder(folders.data.response)
    }catch(err){console.log(err)}
  }
  useEffect(()=>{getFolders()},[])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if(file){ setSelectedFile(file)}
  }

  const uploadNewImage = async (e:FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const data={
      "name":name,
      "description":description,
      "file":selectedFile,
      "folder":folder
    }
    try{
      await api.post(`uploadFile`,data, { headers: { 'Content-Type': 'multipart/form-data',}})
      setTimeout(()=>{ props.setUploadImage(false) }, 1000) 
      setLoading(false)
    }catch(e){console.log(e)}
  }

  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal
          icon='faUpload'
          title='Nova Imagem'
          subtitle='Importar Imagem'
          close={()=>props.setUploadImage(false)}/>
        {loading ? <Loading/> :
          <form  className="flex flex-col" onSubmit={(e)=>uploadNewImage(e)}>
            <div className="flex flex-col">  
              <label className="font-semibold italic text-sm text-neutral-300 py-1 mt-2">
                Selecionar Imagem
              </label>      
              <input 
                type="file" accept="image/*" onChange={handleFileChange}
                className={`font-light shadow text-white border rounded-md p-2 placeholder:italic placeholder:font-light placeholder:text-neutral-400 mb-4 bg-neutral-500/20 border-neutral-700 focus:border-b-4 focus:border-x-0 focus:border-t-0 focus:ring-0 focus:border-teal-600 `} 
                />
            </div>
            <div className="flex">   
              <div className="mr-1">
                <InputForm label='Nome' required value={name} onChange={setName}/>
              </div> 
              <div className="ml-1">
                {listsFolders === null ? <Loading/> 
                : <SelectForm label='Pasta' options={listsFolders} lableKey="name" empty="Selecione uma Pasta" valueKey="id" value={folder}  onChange={setFolder} />}
              </div> 
            </div>
            <div className="flex">        
              <TextAreaForm label='Descrição' value={description} onChange={setDescription}/>
            </div>     
            <div className="flex justify-end">
              <Button name='Cancelar' btn="muted" type="outline" onClick={()=>props.setUploadImage(false)} />
              <Button icon="faUpload" name="Importar Imagem" btn="info" submit/>
            </div>
          </form>
        }
      </div>}/>
  )
}