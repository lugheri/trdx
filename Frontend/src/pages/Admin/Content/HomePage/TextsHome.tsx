import { FormEvent, useState, useEffect } from 'react';
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputForm } from '../../../../components/Inputs';
import { Button } from '../../../../components/Buttons';
import api from '../../../../services/api';
import { TextEditor } from '../../../../components/TextEditor';
import DOMPurify from 'dompurify';

export const TextsHome: React.FC<{typeStudent:'community'|'student'}> = (props) => {
  const [title, setTitle ] = useState("")
  const [text, setText ] = useState("")
  const [additional, setAdditional ] = useState("")
  const [textSave, setTextSave ] = useState(false)

  const getText = async () => {
    try{
      const homeTexts =  props.typeStudent === 'community' 
      ? await api.get("getTextHomeCommunity") 
      : await api.get("getTextHome")

      setTitle(homeTexts.data.response.title_text)
      setText(homeTexts.data.response.text)
      setAdditional(homeTexts.data.response.additional_text)
    }catch(err){ console.log(err) }
  }
  useEffect(()=>{getText()},[])

  

  const setDataHome = async (e:FormEvent) => {
    e.preventDefault()
    setTextSave(true)
    try{
      const data = {
        title_text:title,
        text:text,
        additional_text:additional
      }
      console.log('data',data)
      const r =
      props.typeStudent === 'community' 
        ? await api.post("updateTextHomeCommunity",data) 
        : await api.post("updateTextHome",data)
      
        console.log('DATA',r.data)
    }catch(err){console.log(err)}
    setTimeout(()=>{setTextSave(false)},3000)
  }

  const sanitizedHtml = DOMPurify.sanitize(text);

  return(
    <>
      <p className="py-4 text-neutral-200">
        <FontAwesomeIcon className="text-green-500/80" icon={Fas.faFileText}/> Textos
      </p>
      
      <form className="my-2 px-8 mb-8 border-b border-neutral-600 pb-8" onSubmit={(e)=>setDataHome(e)}>
        <InputForm label="Título" value={title} onChange={setTitle}/>
        <div className="flex flex-col justify-center my-4">
          <label className="font-semibold italic text-sm text-neutral-300 py-1">Edição de Texto</label>
          <TextEditor text={text} setText={setText}/>

          
        </div>
        <label className="font-semibold italic text-sm text-neutral-300 py-1">Preview</label>
        <div className="w-full flex flex-col p-4 bg-[#090909] rounded-md text-white my-3">
          <p className="font-bold text-lg my-2">{title}</p>
          <div className="my-4 font-extralight text-white" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </div>

        <div className="flex">
          { textSave 
            ? <p className="text-teal-300"><FontAwesomeIcon className="text-green-500/80" icon={Fas.faCheck}/> Texto salvo com sucesso!</p>
            : <Button submit btn="success" icon="faFloppyDisk" name='Salvar Textos' type='outline' />}
        </div>
      </form>
    </>
  )
}