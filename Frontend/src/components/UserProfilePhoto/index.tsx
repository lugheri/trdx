
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import api from "../../services/api";
import { useEffect, useState } from "react";
import { urlBase } from "../../utils/baseUrl";

type Props = {
  user_id:number,
  photo_id:number,
  class:string,
  autoUpdate:boolean
}
export const UserProfilePhoto = (props:Props)=> {
  const [ urlPhoto, setUrlPhoto ] = useState<string|null>(null)
  const [ reload, setReload ] = useState(0)  

  useEffect(()=>{
    const getPhoto = async () => {
      try{  
        let photoUser = props.photo_id
        if(photoUser==0){ 
          const info = await api.get(`getUser/${props.user_id}`)
          console.log('Info',info)
          photoUser = info.data.response.photo
        }
        console.log('photoUser',photoUser)  
        const photo = await api.get(`userPhotoProfile/${photoUser}`)   
        console.log('photo',photo.data.response)  
        photo.data.response == false ? setUrlPhoto(null) :
        setUrlPhoto(`${photo.data.response.file}`)
      }catch(e){console.log(e)}
    }
    getPhoto()   
    props.autoUpdate && setTimeout(()=>{
      const time = reload+1
      setReload(time)
    },15000) 
  },[reload])

  return(
    urlPhoto ? 
      <div>
        <div className={`${props.class} rounded-full p-[1px] bg-gradient-to-r from-[#24ff0055] to-[#2eff2a]`}>
          <div className="w-full h-full rounded-full flex justify-center items-center bg-gray-300 text-gray-600 overflow-hidden">
            <img src={`${urlBase}/gallery/${urlPhoto}`} alt="Foto do Aluno" style={{ maxWidth: '100%' }} />
          </div>          
        </div>
      </div>
    : 
      <div>
        <div className={`${props.class} rounded-full p-[1px] bg-gradient-to-r from-[#24ff0055] to-[#2eff2a]`}>
          <div className="w-full h-full rounded-full flex justify-center items-center bg-gray-300 text-gray-600">
            <FontAwesomeIcon icon={Fas.faUser}/>
          </div>
        </div>
      </div>
  )
}