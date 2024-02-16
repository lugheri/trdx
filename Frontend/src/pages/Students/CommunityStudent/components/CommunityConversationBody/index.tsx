import { useEffect, useRef, useState } from "react"
import { Student } from "../../../../../contexts/Dtos/auth.dto"
import { ICommunityMessage } from "../../Dto/community.dto"
import api from "../../../../../services/api"
import { LoadingBars } from "../../../../../components/Loading"
import { CommunityMessageBox } from "../CommunityMessageBox"

type PropsType = {
  page:number,
  userdata:Student,
  update:boolean,
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>
}
export const CommunityConversationBody = (props:PropsType) => {
  const [ error, setError ] = useState<string|null>(null)
  const [ nextPage, setNextPage ] = useState<number|null>(null)
  

   
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const container = messagesEndRef.current;
    if (!container) return;
   // container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop <= 0) {
        console.log('O usuário rolou para o topo do componente!');
        console.log('Page',props.page)
        console.log('Next Page',nextPage)
        setNextPage(nextPage === null ? 2 : nextPage+1)        
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  

  return(
    <div className="flex-1 overflow-auto pb-4"  ref={messagesContainerRef}>         
        { nextPage ? (
        <PageMessage 
          page={nextPage}  
          setUpdate={props.setUpdate} 
          update={props.update} 
          userdata={props.userdata}/>
      ) : (
        <div className="flex justify-center items-center">
          <button 
          className="bg-blue-300 py-1 px-2 opacity-80 hover:opacity-100 text-white/50 text-sm"
          onClick={()=>setNextPage(nextPage === null ? props.page+1 : nextPage+1)}>Carregar mensagens mais antigas - {props.page}</button>
        </div>
      )}
       
      <PageMessage 
        page={1}        
        setUpdate={props.setUpdate} 
        update={props.update} 
        userdata={props.userdata}/>

      <div ref={messagesEndRef}/> 
      
    </div>
  )
}

type PropsTypeMessage = {
  page:number,
  userdata:Student,
  update:boolean,
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>;
}
const PageMessage = (props:PropsTypeMessage) => {
  const [ error, setError ] = useState<string|null>(null)
  const [ lastMessages, setLastMessages ] = useState<null|ICommunityMessage[]>(null)
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
    props.update == true ? getMessages() : props.setUpdate(false)
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
    ) : lastMessages.length === 0 ? (
      <p>Vazio</p>
    ) : lastMessages.map((message,key)=>(
      <CommunityMessageBox 
        key={key}
        userdata={props.userdata}
        message={message}/> 
      ))   
  )
}