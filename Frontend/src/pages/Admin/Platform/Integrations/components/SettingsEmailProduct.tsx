import { useState } from "react"
import { InputForm } from "../../../../../components/Inputs"
import { Modal, TitleModal } from "../../../../../components/Modal"
import { IProducts } from "../../Dtos/integrations.dto"

type SettingsEmailProductComponents = {
  product:IProducts,
  close:React.Dispatch<React.SetStateAction<null|IProducts>>
}
export const SettingsEmailProduct : React.FC<SettingsEmailProductComponents> = (props) => {
  const [ subject, setSubject ] = useState("")
  return(
    <Modal className="w-full" component={
      <div className="flex flex-col">
        <TitleModal icon="faEnvelope" title="Configure o E-mail deste produto" close={()=>props.close(null)}/>
        <div className="flex">
          Offer: {props.product.name}
        </div>
        <InputForm label="Assunto" value={subject} onChange={setSubject}/>
        
      </div>
    }/>
  )
}