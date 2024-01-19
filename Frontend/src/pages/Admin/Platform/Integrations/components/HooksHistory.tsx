import { useEffect, useState } from "react"
import { IHookIntegration, IProducts } from "../../Dtos/integrations.dto"
import api from "../../../../../services/api"
import { LoadingBars } from "../../../../../components/Loading"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "../../../../../components/Buttons";
import moment from "moment";

type HooksHistoryComponent = {
  product:IProducts,
  close:React.Dispatch<React.SetStateAction<IProducts|null>>
}
export const HooksHistory : React.FC<HooksHistoryComponent> = (props) => {
  return(
    <div className="flex flex-col mt-4 py-4 border-t border-neutral-600">
      <p className="text-neutral-300 font-light">
        Histórico de Webhooks recebidos do(a) <span className="text-teal-500">{props.product.integration}</span> no produto: <strong className="text-white">{props.product.name}(<span className="text-teal-500">{props.product.product_id_platform}</span>)</strong>
      </p>

      <div className="flex flex-wrap w-full">
        <PageHooks page={1} product_id={props.product.product_id_platform} integration={props.product.integration}/>
      </div>
      
    </div>
  )
}

type PageHooksComponent = {
  page:number,
  product_id:string,
  integration:string
}
const PageHooks : React.FC<PageHooksComponent> = (props) => {
  const [ hooks, setHooks ] = useState<IHookIntegration[]|null>(null)
  const [ nextPage, setNextPage ] = useState(0)
  
  const getComments = async () => {
    try{      
      const response = await api.get(`listHooks/${props.page}/${props.integration}/${props.product_id}`)
      if (response && response.data && response.data.success) {
        setHooks(response.data.response)
      } 
    }catch(e){ console.log(e) }
  }  
  useEffect(()=>{ getComments() },[props.integration,props.product_id])

  return(
    <>
      {hooks === null ? <LoadingBars/> 
      : hooks.length == 0 ? props.page === 1 &&
        <div className="flex flex-col w-full justify-center items-center p-8 text-white">
          <FontAwesomeIcon className="my-4 text-4xl text-neutral-500/50" icon={Fas.faBan}/>
          <p>Nenhum hook encontrado</p>
        </div>
      : <>
          { hooks.map((hook,key)=><Hook key={key} hook={hook}/>)}
          { nextPage === 0 
            ? hooks.length >= 30 
              && <Button block btn="muted" type="notline" name="Carregar Mais" onClick={()=>setNextPage(props.page+1)}/>
            : <PageHooks page={nextPage} product_id={props.product_id} integration={props.integration}/>
          }    
        </>} 
    </>
  )
}


type HookComponent = {
  hook:IHookIntegration  
 }
 const Hook : React.FC<HookComponent> = (props) => { 
   return(
     <div className="flex bg-neutral-800 w-full my-1 h-14 justify-between items-center">     
        <p className="text-white mx-2 font-light">
          <FontAwesomeIcon className="text-sky-500/50" icon={Fas.faCalendar}/> {moment(props.hook.date).format('DD/MM/YYYY HH:mm:ss')} 
        </p>
        <div className="flex flex-col mx-1">
          <p className="text-white font-light">
            <FontAwesomeIcon className="text-sky-500/50" icon={Fas.faUser}/> {props.hook.student_name} 
          </p>
          <p className="text-white text-sm font-light">{props.hook.student_mail}</p>
        </div>
        
        <p className="text-white mx-2 font-light">
          <FontAwesomeIcon className="text-sky-500/50" icon={Fas.faTag}/> {props.hook.offer} 
        </p>        
        <p className="text-white mx-2 font-light">
          <FontAwesomeIcon className="text-sky-500/50" icon={Fas.faCreditCard}/> {props.hook.pay_status} 
        </p>
    </div>
   )
 }
 