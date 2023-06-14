import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"

export const ActiveStudents = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faUserGraduate" 
        title="Alunos Ativos" 
        description=""/>
    </div>
  )
}