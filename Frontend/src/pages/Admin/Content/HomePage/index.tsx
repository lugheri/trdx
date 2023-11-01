import { TitlePage } from "../../../../components/Template/TitlePage"
import { ButtonsHome } from './ButtonsHome';
import { TextHome } from './TextHome';
import { VideoHome } from './VideoHome';

export const HomePage = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faHome" 
        title="Home page" 
        description="Configure as informações da página inicial da plataforma"/>
      <VideoHome/> 
      <div className="flex">       
        <TextHome/>
        <ButtonsHome />
      </div> 
    </div>
  )
}

