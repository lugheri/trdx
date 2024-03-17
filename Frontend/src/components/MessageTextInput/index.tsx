import { faSmile } from "@fortawesome/free-regular-svg-icons"
import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react"
import { useRef, useState } from "react"

type Props = {
  setMessage:React.Dispatch<React.SetStateAction<string>>,
  message:string
  sizeEmoji?:null|'12px'|'14px'|'18px'|'24px'|'32px',
  placeholder?:string,
  classStyle?:string
}
export const MessageTextInput = (props:Props) => {
  const [showPicker, setShowPicker] = useState(false);
  const editableDivText = useRef<HTMLDivElement>(null);
  const div = editableDivText.current;

  const handleMessage = () => {
    if (div) { props.setMessage(div.innerHTML);}
  }

  const handleEmojiSelect = (emoji: EmojiClickData) => {   
    const size = '24px'
    const emojiLink = `<img src='${emoji.imageUrl}' style='display: inline;width:${size}'/>`     
    if (div) { 
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);      
      if(range.startOffset == 0){
        props.setMessage(div.innerHTML+emojiLink);
      }else{
        const newNode = document.createTextNode(emoji.emoji);
        range.insertNode(newNode);     
        props.setMessage(div.innerHTML.replace(emoji.emoji,emojiLink));
      }
    }  
  }; 

  return(
    <div className="flex flex-1 relative" onBlur={handleMessage}>
      <button 
        type="button"
        className="mx-1 text-white/50 hover:text-white"
        onClick={()=>setShowPicker(!showPicker)}>
          { showPicker ? <FontAwesomeIcon className="text-white/80 mx-1" icon={faX}/> : <FontAwesomeIcon icon={faSmile}/>}       
      </button>

      { showPicker && (
        <div className={`absolute rounded-lg shadow ${props.classStyle ? props.classStyle : false}`}>
          <EmojiPicker theme={Theme.DARK}
            emojiStyle={EmojiStyle.APPLE}
            reactionsDefaultOpen={true}
            searchPlaceholder="Pesquisar emoji..."
            onEmojiClick={handleEmojiSelect}/>
        </div>)
      } 
      
      
      { props.placeholder && (
        <p className="absolute left-8 text-white/50 font-light italic">
          { editableDivText.current.innerHTML == "" && "Digite o seu comentário..."}
        </p>)}
      <div 
        ref={editableDivText}
        contentEditable={true} 
        className="mx-1 p-1 z-10 flex-1 border-b border-white/50 text-white font-light text-sm focus-visible:outline-none"
        dangerouslySetInnerHTML={{ __html: props.message}}/>
    </div>
  )
}