import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"

export const Wellcome = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faHome" 
        title="Bem Vindo" 
        description=""/>
    </div>
  )
}