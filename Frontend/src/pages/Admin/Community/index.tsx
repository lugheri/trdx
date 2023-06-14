import { Button } from "../../../components/Buttons"
import { TitlePage } from "../../../components/Template/TitlePage"

export const Community = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faUsers" 
        title="Comunidade" 
        description="Esta é a área de administração da comunidade!"/>
    </div>
  )
}