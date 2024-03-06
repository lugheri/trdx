import { useEffect, useState } from "react"
import { User } from "../../../../../contexts/Dtos/auth.dto"
import api from "../../../../../services/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsisH, faExclamationTriangle, faUser } from "@fortawesome/free-solid-svg-icons"
import { urlBase } from "../../../../../utils/baseUrl"

type Props = {
  userData:User
}
export const ProfileAdmCommunity = (props:Props) => {
    //Get Data Photo by students access
  return(
    <div className="px-1 py-2 flex justify-between items-center">
      <RenderPhotoUser 
        class="w-[40px] h-[40px] my-1 mx-2 group-hover:hidden"
        mail={props.userData.mail}/> 
      <div className="flex flex-col justify-center items-start flex-1">
        <p className="text-sm text-white font-light">{props.userData.name}</p>
        <p className="text-xs text-white/80 font-light">{props.userData.mail}</p>
      </div>
      <div>
        <FontAwesomeIcon className="text-white/50 cursor-pointer mx-2 hover:text-white" icon={faEllipsisH}/>
      </div>      
    </div>
  )
}

type RenderProps = {
  mail:string,
  class?:string
}
const RenderPhotoUser = (props:RenderProps) => {
  const [ urlPhoto, setUrlPhoto ] = useState<string|null>(null)
  const [ error, setError ] = useState<string|null>(null)
  const getInfoPhoto = async () => {
    try{
      const info = await api.get(`getPhotoProfile/${props.mail}`)
      if(info.data.error){
        setError('Ocorreu um erro ao recuperar a imagem!')
        console.log(info.data.message)
        return
      }
      const photoId = info.data.response
      const photo = await api.get(`photoProfile/${photoId}`)     
      photo.data.response == false ? setUrlPhoto('') :
      setUrlPhoto(`${photo.data.response.file}`)
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro ao recuperar a foto!')
    }
  }
  useEffect(()=>{getInfoPhoto()},[])
  return(
    <div className={`${props.class} rounded-full p-[1px] bg-gradient-to-r from-[#24ff0055] to-[#2eff2a]`}>
      { error !== null ? (
        <div className="w-full h-full rounded-full flex justify-center items-center bg-gray-800 text-gray-600">
          <FontAwesomeIcon className="text-red-500 text-lg" title={error} icon={faExclamationTriangle}/>
        </div>
      ) : urlPhoto ? (
        <div className="w-full h-full rounded-full flex justify-center items-center bg-gray-300 text-gray-600 overflow-hidden">
          <img src={`${urlBase}/gallery/${urlPhoto}`} alt="Foto do Aluno" style={{ maxWidth: '100%' }} />
        </div> 
      ) : ( 
        <div className="w-full h-full rounded-full flex justify-center items-center bg-gray-300 text-gray-600">
          <FontAwesomeIcon icon={faUser}/>
        </div>
      )}
    </div>
  )
}