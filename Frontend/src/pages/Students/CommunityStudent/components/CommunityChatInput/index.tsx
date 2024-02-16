import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Student } from "../../../../../contexts/Dtos/auth.dto";
import api from "../../../../../services/api";
import { LoadingBars } from "../../../../../components/Loading";
import WaveSurfer from 'wavesurfer.js';
//import RecorderPlugin from 'wavesurfer.js/dist/plugins/record';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'

type PropsType = {
  userdata:Student,
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>
}
export const CommunityChatInput = (props:PropsType) => {
  const [message, setMessage] = useState('');
  const [ error, setError ] = useState<string|null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [ recordAudio, setRecordAudio ] = useState(false)

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
    if(message != ""){
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
    }
  };


  return(
    props.userdata ? 
      recordAudio === true ? (
        <RecordAudio userdata={props.userdata} setRecordAudio={setRecordAudio} setError={setError}/>
      ) : (
        <div className="flex justify-center items-center">        
          <form onSubmit={(e)=>handleSubmit(e)} className="flex w-full">
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
            <button 
              className="mx-1 text-black/80 hover:text-black bg-white h-12 w-12 rounded-md"
              onClick={()=>setRecordAudio(true)}>
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
    : (<LoadingBars/>)
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
  const [isRecording, setIsRecording] = useState(false);

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