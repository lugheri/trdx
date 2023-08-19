
import { Button } from "../../../components/Buttons"
import { TitlePage } from "../../../components/Template/TitlePage"

export const Dashboard = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faGauge" 
        title="Dashboard" 
        description=""
        rightComponent={<Button btn="success" border='circle' icon="faPlus" name="Novo Nível" /> }/>
    </div>
  )
}