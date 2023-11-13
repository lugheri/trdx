import { useState } from 'react';
import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"

import { Card } from '../../../../components/Cards';
import { PageFolderGallery } from './components/PageFolders';

export const Gallery = () => {  
  const [ newFolder, setNewFolder ] = useState(false)
  return(
    <div className="flex flex-col p2">
      <TitlePage
        icon="faTableCells" 
        title="Galeria de Mídia" 
        description="Gerencie as imagens da plataforma aqui na galeria de mídia"
        rightComponent={
          <Button icon="faFolderPlus" btn="info" name="Criar Nova Pasta" onClick={()=>setNewFolder(true)}/>
        }/>

      <Card component={
       <PageFolderGallery newFolder={newFolder} setNewFolder={setNewFolder}/>
      }/>  

    </div>
  )
}