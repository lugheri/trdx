import { useEffect, useState } from "react"
import api from "../../services/api"
import { Loading } from "../Loading"
import { urlBase } from "../../utils/baseUrl"

export const RenderImageGallery : React.FC<{className?:string,imageId:number,imgTag?:boolean}> = (props) => {
  const [ fileImage, setFileImage ] = useState<string|null>(null)
  const getInfoImage = async () => {
     try{
      if(props.imageId){
        const info = await api.get(`infoFile/${props.imageId}`)
        setFileImage(info.data.response.file)
      }else{
        setFileImage("")
      }
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{getInfoImage()},[props.imageId])

  return(
    <>
      { fileImage === null ? <Loading/> : 
        props.imageId === 0 ? false
        : props.imgTag ? <img className={props.className} src={`${urlBase}/gallery/${fileImage}`}/>
          : <div className={props.className} 
                 style={{backgroundImage:`url(${urlBase}/gallery/${fileImage})`,
                         backgroundSize:'cover',
                         backgroundPosition:'center'}}/>}
    </>
  )
}

