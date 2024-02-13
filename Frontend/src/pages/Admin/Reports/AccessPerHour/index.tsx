import { Card } from "../../../../components/Cards"
import { TitlePage } from "../../../../components/Template/TitlePage"

export const AccessPerHour = () => {
  return(
    <div className="flex flex-col p-2">
      <TitlePage 
        icon="faStopwatch" 
        title="Acessos por hora" 
        description="Acompanhe os horários de maior atividade dos alunos"/>      
      <Card component={
        <>Acessos Por Hora</>}/>
    </div>
  )
}