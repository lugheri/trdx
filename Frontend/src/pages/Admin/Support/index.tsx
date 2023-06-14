import { Button } from "../../../components/Buttons"
import { TitlePage } from "../../../components/Template/TitlePage"

export const Support = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faHeadset" 
        title="Atendimento" 
        description="Gerencie os canais de atendimento ao aluno e seus chamados!"/>
    </div>
  )
}