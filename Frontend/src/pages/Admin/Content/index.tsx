import { Button } from "../../../components/Buttons"
import { TitlePage } from "../../../components/Template/TitlePage"

export const Content = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faLaptopFile" 
        title="Conteúdo" 
        description="Crie e gerencie todo o conteúdo da plataforma nesta área"/>
    </div>
  )
}