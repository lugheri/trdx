import { useState, useEffect } from 'react';
import api from '../../../../../services/api';
import { Loading } from '../../../../../components/Loading';
import { IFolderGallery } from '../gallery.dto';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";
import { Button } from '../../../../../components/Buttons';
import { NewFolder } from './NewFolder';
import { useNavigate } from 'react-router-dom';

type PageFolderGalleryComponent = {
  newFolder:boolean;
  setNewFolder:React.Dispatch<React.SetStateAction<boolean>>;
}
export const PageFolderGallery: React.FC<PageFolderGalleryComponent> = (props) => {
  
  const [ folderGallery, setFolderGallery ] = useState<IFolderGallery[]|null>(null)
  const listFoldersGallery = async () => {
    try{     
      const list = await api.get('listFolders/1')
      setFolderGallery(list.data.response)
    }catch(e){console.log(e)}      
  }
  useEffect(()=>{listFoldersGallery()},[props.newFolder])

  return(
    <div className="flex flex-col w-full">
      { folderGallery === null ? <Loading/>
      : folderGallery.length === 0 ? 
        <div className="flex flex-col justify-center items-center p-8">
          <FontAwesomeIcon className="text-neutral-300/50 text-6xl" icon={Far.faFolder}/>
          <p className="text-neutral-50 py-2">Nenhuma pasta encontrada!</p>
          <p className="text-neutral-300 font-light text-sm text-center py-2">Parece que vocâ ainda não criou nenhuma pasta na galeria de imagens,<br/> clique no botão abaixo para criar a primeira!</p>
          <Button name="Criar Nova Pasta" icon="faFolderPlus" btn="success" type='outline' onClick={()=>props.setNewFolder(true)}/>
        </div>
      : 
        <div className="flex flex-wrap">          
          { folderGallery.map((item,key)=><Folder key={key} folder={item}/>)}
        </div> }

      {/*Actions Folder*/}
      { props.newFolder && <NewFolder setNewFolder={props.setNewFolder}/> }

    </div>
  )
}

type FolderComponent = {
  folder:IFolderGallery
}
const Folder : React.FC<FolderComponent> = (props) => {
  const navigate = useNavigate();  
  const openFolder = () => {
    const hash_lessonId: string = btoa(`[{"folderId":"${props.folder.id}"}]`);
    navigate(`folder/${hash_lessonId}`)
  }

  return(
    <div
      className="flex flex-col justify-center items-center w-[19%] m-[.5%] bg-neutral-500 px-4 h-[190px] rounded cursor-pointer hover:bg-neutral-400"
      onClick={()=>openFolder()}>
      <FontAwesomeIcon className="text-slate-300/50 text-6xl" icon={Fas.faFolder}/>
      <p className="text-neutral-50 py-2">{props.folder.name}</p>
      <p className="text-neutral-200 font-light text-xs">{props.folder.description}</p>
    </div>
  )
}