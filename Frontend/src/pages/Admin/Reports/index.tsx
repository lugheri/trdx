import { Button } from "../../../components/Buttons"
import { TitlePage } from "../../../components/Template/TitlePage"

export const Reports = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faChartColumn" 
        title="Métricas" 
        description=""/>
    </div>
  )
}