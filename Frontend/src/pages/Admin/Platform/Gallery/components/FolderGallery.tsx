import { NavLink, useLocation } from "react-router-dom";
import { TitlePage } from "../../../../../components/Template/TitlePage";
import { Button } from "../../../../../components/Buttons";
import { useEffect, useState } from "react";
import { Card } from "../../../../../components/Cards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { IFolderGallery } from "../gallery.dto";
import { Loading } from "../../../../../components/Loading";
import api from "../../../../../services/api";
import { ImageGallery } from "./ImageGallery";
import { UploadImageFolder } from "./uploadImage";

export const FolderGallery = () => {
  const [ uploadImage, setUploadImage ] = useState(false)
  const [ infoFolder, setInfoFolder ] = useState<null | IFolderGallery>(null)
  const location = useLocation();  
  const params = location.pathname.split('/')[5]
  console.log(params)
  interface FolderObject {
    folderId: string;
  }
  const base64Decoded: FolderObject[] = JSON.parse(atob(params));
  const folderId = parseInt(base64Decoded[0].folderId,10)

  const getInfoFolder = async () => {
    try{
      const info = await api.get(`infoFolder/${folderId}`)
      setInfoFolder(info.data.response)
    }catch(err){console.log(err) }
  }
  useEffect(()=>{getInfoFolder()},[])

  return (
    <div className="flex flex-col p2">
      <TitlePage
        icon="faTableCells" 
        title="Galeria de Mídia" 
        description="Gerencie as imagens da plataforma aqui na galeria de mídia"
        rightComponent={
          <Button icon="faUpload" btn="info" name="Importar Nova Imagem" onClick={()=>setUploadImage(true)}/>
        }/>
      {infoFolder === null ? <Loading/> :
        <>
          <Card component={
            <div className="flex flex-col w-full">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <p className="text-white">
                    <FontAwesomeIcon className="text-sky-400/50" icon={Fas.faFolderOpen}/> Pasta: {infoFolder.name}
                  </p>
                  <p className="text-white text-xs">{infoFolder.description}</p>
                </div>
                <NavLink to="/admin/platform/gallery" className="text-neutral-300/40 hover:text-neutral-300">
                  <FontAwesomeIcon icon={Fas.faX}/> Fechar Pasta    
                </NavLink>
              </div>              
              <ImageGallery page={1} infoFolder={infoFolder} setUploadImage={setUploadImage} uploadImage={uploadImage}/>
            </div>}/>
            {uploadImage && <UploadImageFolder folder={infoFolder.id} setUploadImage={setUploadImage}/>} 
        </>}       
    </div>
  )
}