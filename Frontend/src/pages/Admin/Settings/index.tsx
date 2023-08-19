
import { TitlePage } from "../../../components/Template/TitlePage"

export const Settings = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faCog" 
        title="Configurações" 
        description="Configurações internas da plataforma"/>
    </div>
  )
}