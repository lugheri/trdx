import { useEffect, useRef, useState } from "react"
import { Student } from "../../../../../contexts/Dtos/auth.dto"
import { ICommunityMessage } from "../../Dto/community.dto"
import api from "../../../../../services/api"
import { LoadingBars } from "../../../../../components/Loading"
import { CommunityMessageBox } from "../CommunityMessageBox"
import moment from "moment"

type PropsType = {
  page:number,
  userdata:Student,
  update:boolean,
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>
}
export const CommunityConversationBody = (props:PropsType) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setTimeout(() => {
      const container = messagesContainerRef.current;
      //if (!container) return;
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }, 1500); 
  }, []);


  return(
    <div className="flex-1 overflow-auto pb-4 scrollBarCommunity"  ref={messagesContainerRef}>   
      <PageMessage 
        page={1}        
        setUpdate={props.setUpdate} 
        update={props.update} 
        userdata={props.userdata}
        messagesContainerRef={messagesContainerRef}/>
      <div ref={messagesEndRef}/> 
    </div>
  )
}

type PropsTypeMessage = {
  page:number,
  userdata:Student,
  update:boolean,
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>,
  messagesContainerRef:React.MutableRefObject<HTMLDivElement>
}
const PageMessage = (props:PropsTypeMessage) => {
  const [ error, setError ] = useState<string|null>(null)
  const [ lastMessages, setLastMessages ] = useState<null|ICommunityMessage[]>(null)  
  const [ nextPage, setNextPage ] = useState<number|null>(null)
  const container = props.messagesContainerRef.current;

  useEffect(() => {
      if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop <= 0) {
        console.log('O usuário rolou para o topo do componente!');     
        //setNextPage(props.page+1)
      }     
    };
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (container) {       
        const bottomPosition = container.scrollHeight - container.scrollTop - container.clientHeight;
        if (bottomPosition < 100) {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
      }
    }, 1500); // Roda a cada 5 segundos

    return () => clearInterval(interval);
  }, []); //








  const getMessages = async () => {
    try{
      const messages = await api.get(`listMessagesCommunity/${props.page}`)
      if(messages.data.error){
        setError(messages.data.message)
      }else{
        setError(null)
        setLastMessages(messages.data.response)
      }
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro ao exibir as mensagens')
    }
  }
  useEffect(() => {
    getMessages()
    if (container) {       
      const bottomPosition = container.scrollHeight - container.scrollTop - container.clientHeight;
      if (bottomPosition < 100) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [props.update]); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      getMessages()
    }, 5000);
    return () => clearInterval(intervalId);
  }, []); 

  return(
    error ? (
      <p className="text-red-500">{error}</p>
    ) : lastMessages === null ? (
      <LoadingBars/>
    ) : lastMessages.length === 0 ? 
      props.page == 1 && (<p> Nenhuma mensagem recebida</p>) 
    : (
      <>
        { nextPage && <PageMessage
                        page={nextPage}
                        setUpdate={props.setUpdate}
                        update={props.update} 
                        userdata={props.userdata}
                        messagesContainerRef={props.messagesContainerRef}/>}
        <div className="flex flex-col w-full"> 
          { nextPage === null && lastMessages[0].id >= 10 && (            
            <div className="flex justify-center items-center">
              <button 
                className="bg-blue-300 py-1 px-2 opacity-80 hover:opacity-100 text-dark text-sm font-light rounded mb-4 shadow-md"
                onClick={()=>setNextPage(props.page+1)}>Carregar mensagens mais antigas</button>
            </div>
          )}   
          { lastMessages.map((message,key)=>(
            <> 
              <DateMessage index={key} lastMessages={lastMessages} message={message}/>
              <CommunityMessageBox 
                key={key}
                userdata={props.userdata}
                message={message}/> 
            </>
          ))}
        </div> 
      </>
    ) 
  )
}


type DateMessageProps = {
  message:ICommunityMessage,
  lastMessages:ICommunityMessage[],
  index:number
}
const DateMessage = (props:DateMessageProps) => {
  moment.locale('pt-br')
  const weekPortugueseDays =  [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ];
  const previousMessageDate = props.index > 0 ? new Date(props.lastMessages[props.index - 1].date_created) : null;
  const lastDataMessage = moment(previousMessageDate).format('DD/MM/YYYY')
  const currentMessageData = moment(props.message.date_created)
  const label = currentMessageData.isSame(moment(), 'day') ?  "Hoje" 
                : currentMessageData.isSame(moment().subtract(1, 'day'), 'day') ?  "Ontem" 
                : currentMessageData.isSame(moment().subtract(2, 'day'), 'day') ?  weekPortugueseDays[currentMessageData.day()] 
                : currentMessageData.isSame(moment().subtract(3, 'day'), 'day') ?  weekPortugueseDays[currentMessageData.day()]
                : currentMessageData.isSame(moment().subtract(4, 'day'), 'day') ?  weekPortugueseDays[currentMessageData.day()]
                : currentMessageData.isSame(moment().subtract(5, 'day'), 'day') ?  weekPortugueseDays[currentMessageData.day()]
                : currentMessageData.isSame(moment().subtract(6, 'day'), 'day') ?  weekPortugueseDays[currentMessageData.day()]
                : currentMessageData.format("DD/MM/YYYY")

  
  return (
    lastDataMessage != currentMessageData.format('DD/MM/YYYY') && (
      <div className="flex justify-center items-center mb-1 mt-4">
        <div className="border-b border-neutral-800 flex-1 mx-4 h-[1px]"></div>
        <p 
        className="text-white text-xs font-light bg-slate-800 px-2 py-1 rounded shadow"
        title={`${currentMessageData.format("DD/MM/YYYY")}`}>
          {label} 
        </p>
        <div className="border-b border-neutral-800 flex-1 mx-4 h-[1px]"></div>
      </div>
    )
  );
}