import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Card } from "../../../../../../components/Cards"
import { faBullhorn, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../../../components/Buttons"
import { ILessonsModule } from "../../../Dtos/courses.dto"
import api from "../../../../../../services/api"
import { Modal, TitleModal } from "../../../../../../components/Modal"

type Props = {
  infoQuiz:ILessonsModule,
  editVisibility:boolean,
  setEditVisibility:React.Dispatch<React.SetStateAction<boolean>>
}
export const QuizVisibility = (props:Props) => {
  return(
    <Card component={
      <div className="flex flex-col w-full">
        <p className="text-white">
          <FontAwesomeIcon 
            className="text-teal-500" 
            icon={faBullhorn}/> Visibilidade do Questionário
        </p>
        { props.infoQuiz.visibility == 1 ? (
          <p className="text-teal-500 text-lg text-center w-full p-4">
            <FontAwesomeIcon className="opacity-50" icon={faEye}/> Público
          </p>
        ) : (
          <p className="text-red-500 text-lg text-center w-full p-4">
            <FontAwesomeIcon className="opacity-50" icon={faEyeSlash}/> Privado
          </p>
        )}
        <Button 
          btn="muted" 
          icon="faPowerOff" 
          name="Alterar Visibilidade" 
          block 
          size="sm" 
          onClick={()=>props.setEditVisibility(true)} />
        
        {props.editVisibility && 
          <ChangeStatus
            close={props.setEditVisibility} 
            quizId={props.infoQuiz.id}
            visibility={props.infoQuiz.visibility == 1 ? 0 : 1}/>}
      </div>}/>
    
  )
}


type ChangeStatusComponent = {
  quizId:number,
  visibility:number,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const ChangeStatus: React.FC<ChangeStatusComponent> = (props) => {
  const changeVisibility = async () => {
    try{
      const data = {visibility:props.visibility}
      const r = await api.patch(`editLessonModule/${props.quizId}`,data)   
      console.log(r)  
      props.close(false)
    }catch(e){console.log(e)}
  }
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal
          icon="faBullhorn" title="Alterar visibilidade do questionário" 
          close={()=>props.close(false)}/>
        <div className="flex flex-col my-4">
          <p className="p-2 mb-4 text-white font-light">
            {props.visibility == 1 
            ? "Confirmar Públicação do questionário?" 
            : "Deseja Ocultar a visibilidade deste questionário?"}
          </p>
          <div className="flex justify-end border-t border-slate-600 pt-4">
            <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
            <Button btn={props.visibility == 1 ? "success" : "error" } icon="faPowerOff" name={props.visibility == 1 ? "Publicar" : "Ocultar" } onClick={()=>changeVisibility()} />
          </div>  
        </div>
      </div>}/>
  )
}
