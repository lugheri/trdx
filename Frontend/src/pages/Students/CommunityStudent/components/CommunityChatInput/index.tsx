import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

export const CommunityChatInput = () => {
  const [message, setMessage] = useState('');
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

  const handleSubmit = (event:FormEvent) => {
    event.preventDefault();
    if (message.trim() !== '') {
      setMessage('');
    }
  };


  return(
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit} className="flex w-full lg:w-3/4">
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
        <button className="mx-1 text-black/50 hover:text-black bg-white h-12 w-12 rounded-md">
          <FontAwesomeIcon icon={Fas.faMicrophoneLines}/>
        </button>  
        <button
          type="submit" 
          className="mx-1 text-black/80 hover:text-black bg-green-500 h-12 w-12 rounded-md">
          <FontAwesomeIcon icon={Fas.faPaperPlane}/>
        </button>  
      </form>
    </div>
  )
}