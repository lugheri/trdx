import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Student } from "../../../../../contexts/Dtos/auth.dto";
import api from "../../../../../services/api";
import { LoadingBars } from "../../../../../components/Loading";

type PropsType = {
  userdata:Student,
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>
}
export const CommunityChatInput = (props:PropsType) => {
  const [message, setMessage] = useState('');
  const [ error, setError ] = useState<string|null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;    
    }
  }, [message]);

  const handleSubmit = async (event:FormEvent) => {
    setError(null)
    event.preventDefault();   
    try{
      const data = {
        is_student: 1,
        user_id: props.userdata.id,
        user_photo: props.userdata.photo === null ? 0 : props.userdata.photo,
        user_name:props.userdata.name,
        message:message,
        media: 0
      }
      console.log('Data',data)
      const r = await api.post('newMessage',data)
      if(r.data.error){setError(r.data.message)
        return
      }
      props.setUpdate(true)
    }catch(err){
      setError('Ocorreu um erro ao disparar a mensagem')
      console.log(err)
    }
    if (message.trim() !== '') {setMessage('');}
  };


  return(
    props.userdata ? (
      <div className="flex justify-center items-center">
        
        <form onSubmit={(e)=>handleSubmit(e)} className="flex w-full lg:w-3/4">
          <div className="bg-neutral-700 rounded-md flex flex-1 p-1 min-h-12">
            <button className="mx-1 text-white/50 hover:text-white">
              <FontAwesomeIcon icon={Far.faSmile}/>
            </button> 
            <textarea
              className="mx-1 flex-1 bg-transparent border-none focus:ring-0 text-white font-light text-sm"
              ref={textAreaRef}
              placeholder="Digite uma Mensagem"
              value={message}
              onChange={handleChange}
              rows={1}
              style={{ resize: 'none', overflowY: 'hidden' }}
            />
            <button className="mx-1 text-white/50 hover:text-white">
              <FontAwesomeIcon icon={Far.faFile}/>
            </button> 
          </div>
          { error !== null && <p className="text-red-500">{error}</p>}
          <button className="mx-1 text-black/80 hover:text-black bg-white h-12 w-12 rounded-md">
            <FontAwesomeIcon icon={Fas.faMicrophoneLines}/>
          </button>  
          <button
            type="submit" 
            className="mx-1 text-black/80 hover:text-black bg-green-500 h-12 w-12 rounded-md">
            <FontAwesomeIcon icon={Fas.faPaperPlane}/>
          </button>  
        </form>
      </div>
    ) : (<LoadingBars/>)
  )
}