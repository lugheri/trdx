
import { TitlePage } from "../../../components/Template/TitlePage"

export const Students = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faGraduationCap" 
        title="Alunos" 
        description="Gerenciamento de alunos da plataforma e comunidade!"/>
    </div>
  )
}