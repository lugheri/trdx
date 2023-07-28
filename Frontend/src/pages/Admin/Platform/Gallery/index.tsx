import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"

export const Gallery = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faTableCells" 
        title="Galeria de Mídia" 
        description="Gerencie as imagens da plataforma aqui na galeria de mídia"/>
    </div>
  )
}