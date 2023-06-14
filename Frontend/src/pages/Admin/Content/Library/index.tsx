import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"

export const Library = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faLinesLeaning" 
        title="Biblioteca" 
        description=""/>
    </div>
  )
}