import { faSmile } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"

type Props = {
  setMessage:React.Dispatch<React.SetStateAction<string>>,
  message:string
  sizeEmoji?:null|'12px'|'14px'|'18px'|'24px'|'32px',
  placeholder?:string,
  classStyle?:string
}
export const MessageTextInput = (props:Props) => {
  const [showPicker, setShowPicker] = useState(false);
  const editableDivText = useRef<HTMLDivElement>(null)

  const handleMessage = () => {
    const div = editableDivText.current;
    if (div) {     
      props.setMessage(div.innerHTML);     
    }
    setShowPicker(false);
  }

  const handleEmojiSelect = (emoji: EmojiClickData) => {
    const size = props.sizeEmoji ? props.sizeEmoji  :  '24px'
    const emojiLink = `<img src='${emoji.imageUrl}' style='display: inline;width:${size}'/>`
    props.setMessage(props.message+emojiLink)
  }

  useEffect(()=>{
    if(editableDivText.current){
      //Focus on editable div
      editableDivText.current.focus();
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(editableDivText.current)
        range.collapse(false); //move cursor to end
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  },[props.message]) 

  return(
    <div className="flex flex-1 relative">
      <button 
        type="button"
        className="mx-1 text-white/50 hover:text-white"
        onClick={()=>setShowPicker(!showPicker)}>
        <FontAwesomeIcon icon={faSmile}/>
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
          { props.message === '' && "Digite o seu comentário..."}
        </p>)}
      <div 
        ref={editableDivText}
        contentEditable={true} 
        className="mx-1 p-1 z-10 flex-1 border-b border-white/50 text-white font-light text-sm focus-visible:outline-none"
        dangerouslySetInnerHTML={{ __html: props.message}}
        onInput={handleMessage}/>
    </div>
  )
}