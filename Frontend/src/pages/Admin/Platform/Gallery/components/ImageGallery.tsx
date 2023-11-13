import { useState, useEffect } from 'react';
import { IFileGallery, IFolderGallery } from '../gallery.dto';
import api from '../../../../../services/api';
import { Loading } from '../../../../../components/Loading';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { Button } from '../../../../../components/Buttons';
import { urlBase } from '../../../../../utils/baseUrl';

type PageImageGalleryComponent = {
  page:number;
  uploadImage:boolean;
  setUploadImage:React.Dispatch<React.SetStateAction<boolean>>;
  infoFolder:IFolderGallery
}
export const ImageGallery: React.FC<PageImageGalleryComponent> = (props) => {
  const [ itemsGallery, setItemsGallery ] = useState<IFileGallery[]|null>(null)
  
  const listItemsGallery = async () => {
    try{
      const filters = {
        "status":1,
        "page":props.page
      }
      const list = await api.post('filterFiles',filters)
      setItemsGallery(list.data.response)
    }catch(e){console.log(e)}      
  }
  useEffect(()=>{listItemsGallery()},[props.uploadImage])

  return(
    <div className="flex flex-col w-full">
      { itemsGallery === null ? <Loading/>
      : itemsGallery.length === 0 ? 
        <div className="flex flex-col w-full justify-center items-center p-8">
          <FontAwesomeIcon className="text-neutral-300/50 text-6xl" icon={Fas.faCamera}/>
          <p className="text-neutral-50 py-2">Nenhuma Imagem encontrada!</p>
          <p className="text-neutral-300 font-light text-sm text-center py-2">
            Parece que vocâ ainda não importou nenhuma imagem para a pasta {props.infoFolder.name},<br/>
            clique no botão abaixo para importar a primeira!</p>
          <Button name="Importar Imagem" icon="faUpload" btn="success" type='outline' 
            onClick={()=>props.setUploadImage(true)}/>
        </div>
      : 
        <div className="flex flex-wrap bg-neutral-800 mt-2 rounded p-2">  
          <PageImage firstPageImages={itemsGallery} page={1}/> 
        </div>}
    </div>
  )
}

type PageImageComponent = {
  firstPageImages:IFileGallery[]|null;
  page:number
}
const PageImage : React.FC<PageImageComponent>  = (props) => {
  const [ images, setImages ] = useState<IFileGallery[]|null>(null)
  const [ nextPage, setNextPage ] = useState(0)
  const getPageImages = async () => {
    try{
      const filters = {
        "status":1,
        "page":props.page
      }
      const imgs = await api.post('filterFiles',filters)
      setImages(imgs.data.response)
    } catch(err){console.log(err)}
  }
  useEffect(()=>{props.page == 1 ? setImages(props.firstPageImages) : getPageImages()},[])
  return(
    <>
      { images === null ? <Loading/> : images.map((item,key)=><Image key={key} image={item}/>) }
      {nextPage == 0 ?
        <div className="flex w-full mt-6 justify-center">
          <Button btn="muted" type="outline" size="sm" name="Carregar Mais Imagens" 
              onClick={()=>setNextPage(props.page+1)}/>
        </div>
      : <PageImage firstPageImages={images} page={nextPage}/> }
    </>
  )
}

type ImageComponent = {
  image:IFileGallery
}
const Image: React.FC<ImageComponent> = (props) => {
  return(
    <div className="block float-left justify-start items-start w-[32%] overflow-auto p-2 bg-neutral-900 m-[.5%] rounded">
      <div className="flex flex-col">
        <div className="h-[200px] flex justify-center items-center">
          <img className="max-h-full" src={`${urlBase}/gallery/${props.image.file}`} />
        </div>
        <div className="flex justify-between p-2">
          <p className="text-neutral-200">
            <FontAwesomeIcon className="text-sky-600/40" icon={Fas.faCamera}/> {props.image.name}
          </p>
          <p>Itens</p>
        </div>
      </div>
     
    </div>
    )

}