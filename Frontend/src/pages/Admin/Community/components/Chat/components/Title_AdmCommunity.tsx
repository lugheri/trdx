import { useEffect, useState } from "react"
import api from "../../../../../../services/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"


export const Title_AdmCommunity = () => {
  const [ member, setMember ] = useState(0)
  const [ onLine, setOnline ] = useState(0)
  
  const getInfoMembers = async () => {
    try{
      const data = await api.get('getInfoMembers')
      setMember(data.data.members)
      setOnline(data.data.onLine)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    const interval = setInterval(() => { getInfoMembers() }, 1500);
    return () => clearInterval(interval);
  },[])
  return(
    <div className="flex justify-between items-center p-2 mb-1 border-b border-b-white/20 mx-4">
      <div className="flex-1 flex flex-col justify-center items-center">
        <p className="text-white text-sm">Comunidade TraderX</p>
        <p className="text-xs text-white/50 font-light">{member} Members, {onLine} Online</p>
      </div>
      <div className="flex justify-end items-center">
        <button className="text text-white/50 hover:text-white mx-2">
          <FontAwesomeIcon icon={faSearch}/>
        </button>        
      </div>
    </div>  
  )
}