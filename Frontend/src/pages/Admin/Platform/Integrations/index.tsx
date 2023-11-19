import { useState, useEffect } from 'react';
import { TitlePage } from "../../../../components/Template/TitlePage"
import { IIntegrationPlatform } from '../Dtos/integrations.dto';
import api from '../../../../services/api';
import { Button } from '../../../../components/Buttons';
import { Loading } from '../../../../components/Loading';
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SetupPlatformIntegration } from './components/SetupPlatformIntegration';

export const Integrations = () => {
  const [ integrationsPlatforms, setIntegrationPlatformss ] = useState<null | IIntegrationPlatform[]>(null)
  const [ error, setError ] = useState<null | string>(null)

  const [newPlatform, setNewPlatform ] = useState(false)
  const [openPlatform, setOpenPlatform ] = useState<IIntegrationPlatform|null>(null)

  const getPlatforms = async () => {
    try{
      const response = await api.get(`listPlatformIntegration/1`)
      if (response && response.data && response.data.success) {
        setIntegrationPlatformss(response.data.response);
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }
  }
  useEffect(() => {getPlatforms();}, [newPlatform,openPlatform]); 
  

  return (
      <>
        { openPlatform 
          ? <SetupPlatformIntegration platform={openPlatform} setOpenPlatform={setOpenPlatform}/>
          : <div className="flex p-2 flex-col">
              {/*TITLE */}
              <TitlePage
                icon="faPlug" 
                title="Integrações" 
                description="Crie e gerencie as integrações da plataforma com os mais diversos serviços!"
                rightComponent={
                  <Button submit btn="info" icon="faPlus" name='Nova Plataforma' onClick={()=>setNewPlatform(true)} />
                }/>
              { error !== null ? <p className="text-red-500">{error}</p>
              : integrationsPlatforms === null ? <Loading/>
              : integrationsPlatforms.length === 0 
                ? <p className="text-red-500 ">Nenhuma Plataforma Cadastrada!</p> 
                : <div className="flex flex-wrap">
                    {integrationsPlatforms.map((platform,key)=>
                      <PlatformIntegration key={key} platform={platform} setOpenPlatform={setOpenPlatform}/>)}
                  </div>}
            </div>}
      </>
  )
}

type PlatformIntegrationComponent = {
  platform:IIntegrationPlatform;
  setOpenPlatform:React.Dispatch<React.SetStateAction<IIntegrationPlatform|null>>;
}
const PlatformIntegration: React.FC<PlatformIntegrationComponent> = (props) => {
  return(
    <div className="w-[49%] m-1 bg-teal-500 h-[200px] rounded flex flex-col justify-center items-center text-white">
      <FontAwesomeIcon className="text-4xl opacity-60" icon={Fas.faPlug}/>
      <p className="text-xl">{props.platform.name}</p>
      <p className="text-sm font-light">{props.platform.description}</p>
      <p className="text-sm text-teal-100 font-light my-2">{props.platform.url}</p>
      <Button btn="error" icon="faWrench" name="Gerenciar Integração" onClick={()=>props.setOpenPlatform(props.platform)}/>
    </div>
  )
}