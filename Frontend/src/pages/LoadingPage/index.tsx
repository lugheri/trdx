import Logo from '/img/logo.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';

export const LoadingPage = () => {
  const [ loading, setLoading ] = useState(false)
  useEffect(()=>{
    setTimeout(()=>{setLoading(true)},500)
  },[])
  return(
    <div className="bg-black h-screen flex flex-col justify-center items-center">
      <img src={Logo} className="w-32 md:w-[10%]"/>
      <p className="text-green-600 font-light text-xs mt-2">
        <FontAwesomeIcon className="text-[.35rem] pr-1" icon={Fas.faCircle} beatFade/> 
        {loading && <FontAwesomeIcon className="text-[.35rem] pr-1" icon={Fas.faCircle} beat/> }
        <FontAwesomeIcon className="text-[.35rem] pr-1" icon={Fas.faCircle} beatFade/> 
      </p>
    </div>
  )
}