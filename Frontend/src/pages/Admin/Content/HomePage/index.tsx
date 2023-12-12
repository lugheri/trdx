import { TitlePage } from "../../../../components/Template/TitlePage"

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card } from '../../../../components/Cards';

import { TextsHome } from './TextsHome';
import { ButtonsHome } from './ButtonsHome';
import { SocialButtons } from "./SocialButtons";

export const HomePage = () => {
  
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faHome" 
        title="Home page" 
        description="Configure as informações da página inicial da plataforma"/>
      
      <Card component={
        <div className="flex flex-col w-full py-2 px-4">
          <div className="flex flex-col w-full mb-4 border-b border-neutral-600 pb-2">
            <p className="text-neutral-200 ">
              <FontAwesomeIcon className="text-green-500/80" icon={Fas.faUsers}/> Home Page da Comunidade
            </p>
            <p className="text-neutral-400 text-sm font-light">
              Configurações da home page dos alunos da comunidade
            </p>
          </div>
          <TextsHome typeStudent='community'/>
          <ButtonsHome typeStudent='community'/>               
        </div>}/>
      
      <Card component={
        <div className="flex flex-col w-full py-2 px-4">
          <div className="flex flex-col w-full mb-4 border-b border-neutral-600 pb-2">
            <p className="text-neutral-200 ">
              <FontAwesomeIcon className="text-green-500/80" icon={Fas.faUser}/> Home Page
            </p>
            <p className="text-neutral-400 text-sm font-light">
              Configurações da home page dos alunos de acesso padrão
            </p>
          </div>
          <TextsHome typeStudent='student'/> 
          <ButtonsHome typeStudent='student'/>                
        </div>
        }/>

      <Card component={<SocialButtons/>}/>
    </div>
  )
}

