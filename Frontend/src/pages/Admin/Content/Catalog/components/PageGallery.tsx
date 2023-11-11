import React, { useState, useEffect  } from 'react';
import { urlBase } from '../../../../../utils/baseUrl';

import { IFileGallery } from '../../../../Students/Dtos/gallery.dto';

import { Button } from "../../../../../components/Buttons"
import api from '../../../../../services/api';
import { Loading } from '../../../../../components/Loading';

export const PageGallery: React.FC<{page:number;setImage:React.Dispatch<React.SetStateAction<number>>}> = (props) => {
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
  },[])

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap">
        {
          itemsGallery === null ? <Loading/> 
          : itemsGallery.map((file,key)=>(
            <div key={key} className="p-4">
              <p className="text-slate-400 font-bold text-sm text-center">{ file.name}</p>
              <div className="w-[150px] relative h-auto flex justify-center items-center">
                <img src={`${urlBase}/gallery/${file.file}`} className='w-[150px]'/>
                <div 
                  className="bg-slate-900 text-center cursor-pointer absolute w-full h-full flex justify-center items-center text-white opacity-10 hover:opacity-70"
                  onClick={()=>props.setImage(file.id)}>
                  Selecionar Imagem
                </div>
              </div>           
            </div>
          ))
        }       
      </div>  
      {nextPage > 0 ?  <PageGallery page={nextPage} setImage={props.setImage}/> : false}
      { itemsGallery ? itemsGallery.length > 0 ? nextPage == 0 ?
        <Button btn="muted" type="outline" size="sm" name="Carregar Mais" onClick={()=>setNextPage(props.page+1)}/>
      : false : false : false }
    </div>
  )
}