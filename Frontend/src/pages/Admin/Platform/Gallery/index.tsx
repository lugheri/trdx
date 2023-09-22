import { useState, useEffect,FormEvent } from 'react';
import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"
import { IFileGallery } from '../../../Students/Dtos/gallery.dto';

import api from '../../../../services/api';
import { Loading } from '../../../../components/Loading';
import { urlBase } from '../../../../utils/baseUrl';
import { Card } from '../../../../components/Cards';
import { Modal, TitleModal } from '../../../../components/Modal';
import { InputForm, TextAreaForm } from '../../../../components/Inputs';

export const Gallery = () => {

  const [ uploadImage, setUploadImage ] = useState(false)
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faTableCells" 
        title="Galeria de Mídia" 
        description="Gerencie as imagens da plataforma aqui na galeria de mídia"
        rightComponent={
          <Button icon="faUpload" btn="info" name="Importar Imagem" onClick={()=>setUploadImage(true)}/>
        }
        />

      {/*BODY */}
      <Card component={
        <>
        <PageGallery page={1} uploadImage={uploadImage}/>        
        </>
        
      }/>

      { uploadImage ? 
        <Modal component={
                          <div>
                            <TitleModal
                              icon='faUpload'
                              title='Upload de Imagem'
                              subtitle='Selecione uma nova imagem para importar na galeria'
                              close={()=>setUploadImage(false)}
                              />
                              <UploadNewImage setUploadImage={setUploadImage}/>
                          </div>
                        }/> 
        : false}
    </div>
  )
}

const UploadNewImage : React.FC<{setUploadImage: React.Dispatch<React.SetStateAction<boolean>>}> = (props) => {
  const [ selectedFile, setSelectedFile ] = useState<File|null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if(file){ setSelectedFile(file)}
  }

  const [ name, setName ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ folder, setFolder ] = useState('')


  const uploadNewImage = async (e:FormEvent) => {
    e.preventDefault()
    const data={
      "name":name,
      "description":description,
      "file":selectedFile,
      "folder":folder
    }
    try{
      console.log('DATA',data)
      await api.post(`uploadFile`,data, { headers: { 'Content-Type': 'multipart/form-data',}})
      props.setUploadImage(false)
    }catch(e){
      console.log(e)
    }
  }

  return(
    <form  className="flex flex-col" onSubmit={(e)=>uploadNewImage(e)}>
      <div className="flex flex-col">  
        <label className="font-semibold italic text-sm text-slate-500 dark:text-slate-300">
          Selecionar Imagem
        </label>      
        <input type="file" accept="image/*" className={`shadow border border-slate-300 mb-4 rounded text-slate-700 p-2 placeholder:italic placeholder:text-slate-400
                    dark:bg-zinc-600 dark:border-slate-800 dark:text-white dark:placeholder:text-zinc-400 bg-slate-200
                    focus:border-b-4 focus:border-teal-600 focus:ring-0 dark:focus:border-zinc-300`}  onChange={handleFileChange}/>
      </div>
      <div className="flex">        
        <InputForm label='Nome' required value={name} onChange={setName}/>
      </div>
      <div className="flex">        
        <TextAreaForm label='Descrição' value={description} onChange={setDescription}/>
      </div>
       <div className="flex">        
        <InputForm label='Pasta' value={folder} onChange={setFolder}/>
      </div>      
      <div className="flex justify-end">
        <Button name='Cancelar' btn="muted" type="outline" onClick={()=>props.setUploadImage(false)} />
        <Button icon="faUpload" name="Importar Imagem" btn="info" submit/>
      </div>
    </form>
  )
}



const PageGallery: React.FC<{page:number;uploadImage:boolean}> = (props) => {

  const [ itemsGallery, setItemsGallery ] = useState<IFileGallery[]|null>(null)
  const [ nextPage, setNextPage ] = useState(0)

  useEffect(()=>{
    const listItemsGallery = async () => {
      try{
        const filters = {
          "status":1,
          "page":props.page
        }
        const list = await api.post('filterFiles',filters)
        setItemsGallery(list.data.response)
      }catch(e){
        console.log(e)
      }      
    }
    listItemsGallery()
  },[props.uploadImage])

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap">
        {
          itemsGallery === null ? <Loading/> 
          : itemsGallery.map((file,key)=>(
            <div key={key} className="m-1 w-[19%]">
              <p>{ file.name}</p>
              <img src={`${urlBase}/gallery/${file.file}`} />
            </div>
          ))
        }
      </div>
      { nextPage > 0 ?  <PageGallery page={nextPage} uploadImage={props.uploadImage}/> : false}
      { itemsGallery ? itemsGallery.length > 0 ? nextPage == 0 ?
        <Button btn="muted" type="outline" size="sm" name="Carregar Mais" onClick={()=>setNextPage(props.page+1)}/>
      : false : false : false }
     </div>
  )
}