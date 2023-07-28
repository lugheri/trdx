import { useState, useEffect } from 'react';
import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"
import { IFileGallery } from '../../../Dtos/gallery.dto';

import api from '../../../../services/api';
import { Loading } from '../../../../components/Loading';
import { urlBase } from '../../../../utils/baseUrl';

export const Gallery = () => {



  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faTableCells" 
        title="Galeria de Mídia" 
        description="Gerencie as imagens da plataforma aqui na galeria de mídia"/>

      {/*BODY */}
      <PageGallery page={1}/>
    </div>
  )
}



const PageGallery: React.FC<{page:number}> = (props) => {

  const [ itemsGallery, setItemsGallery ] = useState<IFileGallery[]|null>(null)

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
  },[])

  return (
    <div className="flex">
      {
        itemsGallery === null ? <Loading/> 
        : itemsGallery.map((file,key)=>(
          <div key={key} className="p-4">
            <p>{ file.name}</p>
            <img src={`${urlBase}/gallery/${file.file}`} className='w-[200px]'/>
          </div>
        ))
      }
    </div>
  )
}