import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Student } from "../../../../../contexts/Dtos/auth.dto";
import api from "../../../../../services/api";
import { LoadingBars } from "../../../../../components/Loading";
import WaveSurfer from 'wavesurfer.js';
//import RecorderPlugin from 'wavesurfer.js/dist/plugins/record';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
import { Button } from "../../../../../components/Buttons";
import { Modal } from "../../../../../components/Modal";
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import DOMPurify from 'dompurify';


type PropsType = {
  userdata:Student,
  update:boolean,
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>,
  disableAudio?:boolean,
  disableMedia?:boolean
}
export const CommunityChatInput = (props:PropsType) => {
  const [ error, setError ] = useState<string|null>(null)
  
  //SUBMIT TEXT MESSAGE
  const [showPicker, setShowPicker] = useState(false);
  const [ message, setMessage ]= useState('');

  const handleSubmit = async (event:FormEvent) => {
    setShowPicker(false);
    setError(null)
    event.preventDefault();  
    let messageFormatted:string
    if(message != ""){
      const http = message.split(' https://')
      console.log('http',http)
      if(http.length == 1){
        messageFormatted=message
      }else{
        const link = http[1].split(' ')
        let endMessage=''
        for (let i = 1; i < link.length; i++) {
          endMessage=endMessage+' '+link[i]
        }
        messageFormatted = `${http[0]} <a href="https://${link[0]}" style="color:#48dbfb" target="_blank">https://${link[0]}</a> ${endMessage}`
      }   

      try{
        const data = {
          is_student: 1,
          user_id: props.userdata.id,
          user_photo: props.userdata.photo === null ? 0 : props.userdata.photo,
          user_name:props.userdata.name,
          message:DOMPurify.sanitize(messageFormatted, { ALLOWED_TAGS: ['img','br','a'] }),
          media: 0
        }
        console.log('Data',data)
        props.setUpdate(!props.update)
        console.log('Updated')
        const r = await api.post('newMessage',data)
        if(r.data.error){setError(r.data.message)
          return
        }
      
      }catch(err){
        setError('Ocorreu um erro ao disparar a mensagem')
        console.log(err)
      }
      if (message.trim() !== '') {setMessage('');}
    }
  };
  
  //AUDIO MESSAGE
  const [ recordAudio, setRecordAudio ] = useState(false)  

  //FILE MESSAGE
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [changeTypeFile, setChangeTypeFile] = useState(false)
  const [files, setFiles] = useState<File[]>([]);
  
  const changeFile = (type:'img'|'doc') => {
    setChangeTypeFile(false)
    fileInputRef.current.setAttribute('accept', `${type == 'img' ? 'image/*' : '.pdf,.doc,.docx'}`);
    fileInputRef.current.click();
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputFiles = event.target.files
    if(!inputFiles) return;   

    const filesArray: File[] = [];
    for(let i = 0; i<inputFiles.length;i++){
      const file = inputFiles[i];
      filesArray.push(file);
    }
    setFiles((prevFiles) => [...prevFiles, ...filesArray])
  }
  
  return(
    props.userdata ? 
      recordAudio === true ? 
        <RecordAudio userdata={props.userdata} setRecordAudio={setRecordAudio} setError={setError}/>
      : files.length > 0 ? 
        <ListFiles userdata={props.userdata} files={files} setFiles={setFiles} setError={setError}/> 
      : (
        <div className="flex justify-center items-center">
          <input type="file"  ref={fileInputRef} onChange={handleFileChange} className="hidden"/>                
          <form onSubmit={(e)=>handleSubmit(e)} className="flex w-full">
            <div className="bg-neutral-700 rounded-md flex flex-1 p-1 min-h-12 relative">
              <TextInput 
                message={message} setMessage={setMessage} 
                showPicker={showPicker} setShowPicker={setShowPicker}/>             
              { changeTypeFile && (
                <div className="flex flex-col rounded shadow bg-neutral-600 p-2 absolute right-2 bottom-10 z-10">
                  <button className="text-white/80 font-light text-left hover:text-white p-1" onClick={()=>changeFile('doc')}>
                    <FontAwesomeIcon className="text-indigo-400" icon={Fas.faFileLines}/> Documentos
                  </button>
                  <button className="text-white/80 font-light text-left hover:text-white p-1" onClick={()=>changeFile('img')}>
                    <FontAwesomeIcon className="text-blue-400" icon={Fas.faImages}/> Imagens
                  </button>
                </div>
              )}
              { !props.disableMedia &&
                <button className="mx-1 text-white/50 hover:text-white" onClick={()=>setChangeTypeFile(!changeTypeFile)} >
                  <FontAwesomeIcon icon={Far.faFile}/>
                </button> 
              }
            </div>
            { error !== null && <p className="text-red-500">{error}</p>}
            { !props.disableAudio &&
              <button 
                className="mx-1 text-black/80 hover:text-black bg-white h-12 w-12 rounded-md"
                onClick={()=>setRecordAudio(true)}>
                <FontAwesomeIcon icon={Fas.faMicrophoneLines}/>
                </button>
            }  
            <button
              type="submit" 
              className="mx-1 text-black/80 hover:text-black bg-green-500 h-12 w-12 rounded-md">
              <FontAwesomeIcon icon={Fas.faPaperPlane}/>
            </button>  
          </form>
        </div>
      )
    : (<LoadingBars/>)
  )
}



//TextInput
type TextInputProps = {
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>,
  showPicker:boolean,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  message:string
}
const TextInput = (props:TextInputProps) => {
  //EMOJI
  const editableDivText = useRef<HTMLDivElement>(null);//Div de Edicao de Texto  
  const div = editableDivText.current;

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

  const handleMessageHTMLChange= () => {    
    if (div) { props.setMessage(div.innerHTML);}   
  };
  return(
    <div className="flex flex-1" onBlur={handleMessageHTMLChange}>
      <button 
        type="button"
        className="mx-1 text-white/50 hover:text-white"
        onClick={() => props.setShowPicker(!props.showPicker)}>
        { props.showPicker ? <FontAwesomeIcon className="text-white/80 mx-1" icon={Fas.faX}/> : <FontAwesomeIcon icon={Far.faSmile}/>}
      </button>
      { props.showPicker && (
        <div className="absolute bottom-14  rounded-lg shadow">
          <EmojiPicker theme={Theme.DARK}
            emojiStyle={EmojiStyle.APPLE}
            reactionsDefaultOpen={true}
            searchPlaceholder="Pesquisar emoji..."
            onEmojiClick={handleEmojiSelect}/>
        </div>)
      } 

      <div 
        ref={editableDivText}
        contentEditable={true} 
        className="mx-1 p-1 flex-1 border-none text-white font-light text-sm focus-visible:outline-none"
        dangerouslySetInnerHTML={{ __html: props.message }}
        />        
    </div>
  )
}




//File Input
type PropsListFiles = {
  userdata:Student,
  setError:React.Dispatch<React.SetStateAction<string|null>>,
  files:File[],
  setFiles:React.Dispatch<React.SetStateAction<File[]>>
}
const ListFiles = (props:PropsListFiles) => {
  const [message, setMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);  

  const sendFile = async () => {
    console.log('FILES >> ',props.files)
    if(props.files.length > 0){
      try{
        const data = {
          is_student: 1,
          user_id: props.userdata.id,
          user_photo: props.userdata.photo === null ? 0 : props.userdata.photo,
          user_name:props.userdata.name,
          message:message,
          file: props.files[0],
        }
    
        const r = await api.post('newFileMessage',data,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        if(r.data.error){props.setError(r.data.message)
          props.setFiles([])
          return
        }
      }catch(err){
        props.setError('Ocorreu um erro ao disparar a mensagem')
        console.log(err)
      }
      props.setFiles([])
    }
  }

  props.files ? console.log('Files Data', props.files) : console.log('Files Data', 'empty')
  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col w-full">
        <div className="flex justify-center items-center flex-wrap max-h-[550px] p-4 overflow-auto">
          {props.files.map((file, key) => ( 
            <FileItem 
              key={key} 
              file={file} 
              size={`${props.files.length == 1 ? "w-1/2" : props.files.length > 4 ? "w-1/4" : "flex-1"}`}/> 
          ))}
        </div>
        <div className="flex justify-between items-center border-t border-slate-500 m-4 pt-4">
          <div className="bg-slate-700 rounded-md flex flex-1 p-1 min-h-12 relative">

            <TextInput 
                message={message} setMessage={setMessage} 
                showPicker={showPicker} setShowPicker={setShowPicker}/> 
          </div>
        
          <Button btn="muted" icon="faX" type="notline" onClick={()=>props.setFiles([])}/>
          <Button btn="success" icon="faPaperPlane" onClick={()=>sendFile()}/>
        </div>
      </div>
    }/>
  )
}
type PropsFileItem = { file:File, size:string }
const FileItem = (props:PropsFileItem) => {
  props.file ? console.log('File Data', props.file) : console.log('File Data', 'empty')
  return(
    props.file.type.startsWith('image/') ? (
      <div className={`flex flex-col justify-center items-center ${props.size} overflow-hidden bg-slate-500/10 p-1 mx-1 rounded shadow`}>
        <img 
          src={URL.createObjectURL(props.file)} 
          alt={`Image ${props.file.name}`} 
          style={{ width: '100%', height:'auto'}} />
          <p className="text-white font-light my-4" title={`${props.file.name}`}>{props.file.name}</p>
      </div>
    ) : (
      <div className={`flex flex-col justify-center py-4 items-center ${props.size} overflow-hidden bg-slate-500/50 p-1 mx-1 rounded shadow`}>
        <FontAwesomeIcon className="m-8 text-8xl text-white/50" icon={Fas.faFile}/>
        <p className="text-white font-light" title={`${props.file.name}`}>{props.file.name}</p>
      </div>
    )
  )
}

//Record Audio
type PropsRecord = {
  userdata:Student,
  setError:React.Dispatch<React.SetStateAction<string|null>>
  setRecordAudio:React.Dispatch<React.SetStateAction<boolean>>
}
const RecordAudio = (props:PropsRecord) => { 
  const [ recorderAudio, setRecorderAudio ] = useState(false)
  const [ isRecording, setIsRecording] = useState(false);

  const media_recorder = useRef<MediaRecorder>(null);
  const recorder_control = useRef<any>({});  
  const wave_form = useRef<HTMLDivElement>(null);
  const wave_surfer = useRef<WaveSurfer | null>(null);

  const show_timer = useRef<HTMLParagraphElement>(null);
  const recording_time = useRef<{ time: number; interval?: ReturnType<typeof setInterval> }>({ time: 0 });

  const convertTime = (milissegundos: number) => {
    let segundos = Math.floor(milissegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    segundos %= 60;
    return ('0' + minutos).slice(-2) + ':' + ('0' + segundos).slice(-2);
  }
  const openStreamWebtrc = async (device_id: string) => {
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: device_id,
        autoGainControl: false,
        echoCancellation: false,
        noiseSuppression: false,
        sampleSize: 16,
        sampleRate: 48000
      },
      video: false
    })
  }
  const audio_chunk_content = useRef([]);
  const newAudioMessage = async () => {
    setRecorderAudio(true)
    audio_chunk_content.current = [];   

    const device_input = await getConnectedDevices();
    if (!device_input.length) return alert('Conecte um dispositivo');
    setIsRecording(true);
    recorder_control.current.destroy();
    recording_time.current.time = 0;
    let was_disconnected = false;
    await recorder_control.current.startRecording();
    const stream = await openStreamWebtrc(device_input[0].deviceId);
    media_recorder.current = new MediaRecorder(stream);
    media_recorder.current.start();
    media_recorder.current.ondataavailable = (event) => {
      audio_chunk_content.current.push(event.data);
    }
    recording_time.current.interval = setInterval(() => {
    recording_time.current.time += 1000;
      show_timer.current.innerHTML = convertTime(recording_time.current.time)
    }, 1000);
    navigator.mediaDevices.addEventListener('devicechange', async () => {
      const get_current_device_list = await getConnectedDevices();
      if (get_current_device_list[0]?.deviceId !== device_input[0].deviceId && !was_disconnected) {
        was_disconnected = true;
        stopRecording();
        return alert('Dispositivo de áudio desconectado');
      }
    });
  }
  const stopRecording = () => {
    media_recorder.current.stop();
    recorder_control.current.stopRecording();
    show_timer.current.innerHTML = '00:00';
    window.clearInterval(recording_time.current.interval);
    recorder_control.current.destroy();
    setIsRecording(false);
    setRecorderAudio(false)
    props.setRecordAudio(false)
  }
  useEffect(() => {
    if(recorderAudio){ 
      wave_surfer.current = WaveSurfer.create({
        container: wave_form.current,
        waveColor: '#777',
        progressColor: 'white',
        height: 40,
        interact: false,
        cursorColor: '#777'
      });
      recorder_control.current = wave_surfer.current.registerPlugin(RecordPlugin.create());   
    }
  }, [recorderAudio]);

  const getConnectedDevices = async () => {
    const device = await navigator.mediaDevices.enumerateDevices();
    return device.filter(device_connected => device_connected.kind === 'audioinput');
  }

  const sendAudioMessage = () => {
    recorder_control.current.stopRecording();
    media_recorder.current.stop();
    window.clearInterval(recording_time.current.interval);
    media_recorder.current.onstop = () => {
      const audioBlob = new Blob(audio_chunk_content.current, { type: 'audio/mp4' });
      const file_reader = new FileReader();
      file_reader.readAsDataURL(audioBlob);
      file_reader.onloadend = async () => {
        const file_data = {
          base64_data: file_reader.result,
          audioSeconds: `${(recording_time.current.time / 1000).toFixed(0)}`,
          name: 'audio',
          size: audioBlob.size,
          type: audioBlob.type,
          file_id: 'audio'
        }
        setIsRecording(false);
        setRecorderAudio(false)
        props.setRecordAudio(false)

        const data = {
          is_student: 1,
          user_id: props.userdata.id,
          user_photo: props.userdata.photo === null ? 0 : props.userdata.photo,
          user_name:props.userdata.name,
          file: file_data,
        }
        console.log('Data',data)
        const r = await api.post('newAudioMessage',data)
        if(r.data.error){props.setError(r.data.message)
          return
        }
      }
    }
  }   
  useEffect(()=>{
    isRecording == false && newAudioMessage()
  },[isRecording])
  return(
    <div className="flex justify-center items-center">        
      <div className="flex w-full lg:w-3/4">
        <div className="bg-neutral-700 rounded-md flex flex-1 p-1 min-h-12 items-center">
          <button 
            className="mx-1 text-white/50 hover:text-red-500"
            onClick={()=>stopRecording()}>
            <FontAwesomeIcon icon={Fas.faTrash}/>
          </button>  
          <p className="text-white/50 font-light" ref={show_timer}>00:00</p>
          <div className="h-[95%] mt-0 px-1 flex-1" ref={wave_form}></div>
        </div>
        
        <button
          onClick={()=>sendAudioMessage()} 
          className="mx-1 text-black/80 hover:text-black bg-green-500 h-12 w-12 rounded-md">
          <FontAwesomeIcon icon={Fas.faPaperPlane}/>
        </button>  
      </div>
    </div>
  )
}