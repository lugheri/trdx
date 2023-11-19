import { Button } from "../../../../../components/Buttons";
import { Card } from "../../../../../components/Cards";
import { TitlePage } from "../../../../../components/Template/TitlePage";
import { IIntegrationPlatform } from "../../Dtos/integrations.dto";
import { ProductsIntegrations } from "./ProductsIntegrations";

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SetupPlatformIntegrationComponent = {
  platform:IIntegrationPlatform;
  setOpenPlatform:React.Dispatch<React.SetStateAction<IIntegrationPlatform|null>>;
}
export const SetupPlatformIntegration : React.FC<SetupPlatformIntegrationComponent> = (props) => {
  return(
    <div className="flex flex-col p-2">
      <TitlePage
        icon="faWrench" 
        title={`Integração ${props.platform.name}`}
        description={`Configure os produtos da integração ${props.platform.name}!`}
        rightComponent={
          <Button submit btn="muted" icon="faReply" name='Voltar'  onClick={()=>props.setOpenPlatform(null)} />
        }/> 

      <Card component={
        <div className="flex w-full justify-between items-start">
          <div className="flex flex-col">
            <p className="text-neutral-100">
              <FontAwesomeIcon className="text-teal-500/50" icon={Fas.faPlug}/> Dados da Integração:
            </p>
            <p className="text-neutral-50 font-light text-sm my-1"><b>Plataforma:</b> {props.platform.name}</p>
            <p className="text-neutral-50 font-light text-sm my-1"><b>Descrição:</b> {props.platform.description}</p>
            <p className="text-neutral-50 font-light text-sm my-1"><b>Link de Integração:</b> {props.platform.url}</p>
            {props.platform.ready === 1
              ? <p className="text-teal-500 text-sm my-1"><b className="text-neutral-50">Status:</b> Disponível</p>
              : <p className="text-red-500 text-sm my-1"><b className="text-neutral-50">Status:</b> Pendente</p>}
          </div>
          <Button btn="info" icon="faEdit" name="Editar Informações"/>         
        </div>
      }/>
      <Card component={<ProductsIntegrations integration={props.platform.name}/>}/>
    </div>)
}


