import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"

export const Gamification = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faGamepad" 
        title="Gamificação" 
        description=""/>
    </div>
  )
}