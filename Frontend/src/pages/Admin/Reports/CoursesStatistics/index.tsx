import { Card } from "../../../../components/Cards"
import { TitlePage } from "../../../../components/Template/TitlePage"

export const CoursesStatistics = () => {
  return(
    <div className="flex flex-col p-2">
      <TitlePage 
        icon="faChartSimple" 
        title="Estatísticas por Curso" 
        description="Acompanhe a avaliação das aulas e as evolução dos alunos"/>      
      <Card component={
        <>Estatisticas por Curso</>}/>
    </div>
  )
}