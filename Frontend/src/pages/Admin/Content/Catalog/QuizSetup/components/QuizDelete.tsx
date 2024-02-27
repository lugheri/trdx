import { Button } from "../../../../../../components/Buttons"
import { Modal, TitleModal } from "../../../../../../components/Modal"
import api from "../../../../../../services/api"

type Props = {
  quizId:number,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
export const QuizDelete = (props:Props) => {
  const removerQuiz = async () => {
    try{
      const data = {status:0}
      const r = await api.patch(`editLessonModule/${props.quizId}`,data)   
      console.log(r)  
      props.close(false)
    }catch(e){console.log(e)}
  }
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon="faTrash" title="Remover Anexo" close={()=>props.close(false)}/>
        <div className="flex flex-col my-4">
          <p className="p-2 mb-4 text-white font-light">
            Confirmar remoção deste questionário?
          </p>
          <div className="flex justify-end border-t border-slate-600 pt-4">
            <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
            <Button btn="error" icon="faTrash" name="Sim, Remover" onClick={()=>removerQuiz()} />
          </div>  
        </div>
      </div>}/>
  )
}