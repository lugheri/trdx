import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"

export const InactiveStudents = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faUserXmark" 
        title="Alunos Inativos" 
        description=""/>
    </div>
  )
}