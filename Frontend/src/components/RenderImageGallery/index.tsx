import { useEffect, useState } from "react"
import api from "../../services/api"
import { Loading } from "../Loading"
import { urlBase } from "../../utils/baseUrl"

export const RenderImageGallery : React.FC<{className?:string,imageId:number}> = (props) => {
  const [ fileImage, setFileImage ] = useState(null)
  const getInfoImage = async () => {
    try{
      const i = await api.get(`infoFile/${props.imageId}`)
      setFileImage(i.data.response.file)
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{getInfoImage()},[props.imageId])

  return(
    <>
      { fileImage === null ? <Loading/> : 
        props.imageId === 0 ? false
        : <div 
            className={props.className} 
            style={{backgroundImage:`url(${urlBase}/gallery/${fileImage})`,
                    backgroundSize:'cover',
                    backgroundPosition:'center'}}/>}
    </>
  )
}

