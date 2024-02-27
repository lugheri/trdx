import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Card } from "../../../../../../components/Cards"
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons"
import { ILessonsAccessRule, ILessonsModule } from "../../../Dtos/courses.dto"
import api from "../../../../../../services/api"
import { Button } from "../../../../../../components/Buttons"
import { Modal, TitleModal } from "../../../../../../components/Modal"
import { InputForm, InputNumberForm, SelectForm } from "../../../../../../components/Inputs"
import moment from "moment"

type Props = {
  lessonId:number,
  infoQuiz:ILessonsModule
}
export const QuizAccessRule = (props:Props) => {
  //Rules
  const [ accessRule, setAccessRule ] = useState<ILessonsAccessRule|null>(null)
  const [ editAccessRule, setEditAccessRule ] = useState(false)

  const lessonAccessRules = async () => {
    try{
      const i = await api.get(`lessonAccessRule/${props.lessonId}`)
      console.log('lessonAccessRule',i.data)
      setAccessRule(i.data.response)      
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{lessonAccessRules()},[editAccessRule]) 
  
  return(
    <Card component={
      <div className="flex flex-col w-full">
        <p className="text-white">
          <FontAwesomeIcon className="text-teal-500" icon={faCalendarCheck}/> Regra de Liberação
        </p>
        {accessRule ? 
          accessRule.rule_access == 'L' 
          ? <div className="flex flex-col bg-teal-500 py-4 px-2 rounded text-white justify-center items-center">
              <p>{accessRule.rule_access} - Liberação Imediata</p>
              <p className="mt-2 text-xs text-center font-light">O Questionário estará disponível para o aluno assim que ele acessa-la</p>
            </div> 
          : accessRule.rule_access == 'D'
          ? <div className="flex flex-col bg-orange-500 p-2 rounded text-white justify-center items-center">
              <p>{accessRule.rule_access} - {accessRule.days_to_access} Dias após a compra</p>
              <p className="mt-2 text-xs text-center font-light">O Questionário será liberada {accessRule.days_to_access} dia(s) após a data de compra</p>
            </div> 
          : accessRule.rule_access == 'F'
          ? <div className="flex flex-col bg-red-500 p-2 rounded text-white justify-center items-center">
              <p>{accessRule.rule_access} - Data fixada</p>
              <p className="mt-2 text-xs text-center font-light">O Questionário estará disponível apenas após {moment(accessRule.date_of_access).format('DD/MM/YYYY')}</p>
            </div>
          : <p className="text-red-500 font-light text-sm">Ocorreu um erro para identificar a regra <strong>{accessRule.rule_access}</strong></p>
        : <div className="flex flex-col bg-teal-500 p-2 rounded text-white justify-center items-center">
            <p>Liberação Imediata</p>
            <p className="mt-2 text-xs text-center font-light">O Questionário estará disponível para o aluno assim que ele acessa-la</p>
          </div> }
        <Button btn="muted" icon="faCalendarWeek" name="Alterar Regra de Liberação" size="sm" onClick={()=>setEditAccessRule(true)}/>
        { editAccessRule && 
          <EditAccessRule 
            ruleLesson={accessRule} 
            quizId={props.infoQuiz.id} 
            close={setEditAccessRule}/>}
      </div>}/>
  )
}


type EditAccessRuleComponent = {
  quizId:number,
  ruleLesson:ILessonsAccessRule|null,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const EditAccessRule: React.FC<EditAccessRuleComponent> = (props) => {
  const [rule, setRule ] = useState(props.ruleLesson ? props.ruleLesson.rule_access : "L")
  const [days, setDays ] = useState(props.ruleLesson ? props.ruleLesson.days_to_access : 0)
  const [date, setDate ] = useState(props.ruleLesson ? props.ruleLesson.date_of_access : "")
  const updateAccessRule = async () => {
    try{  
      const data = {
        rule_access:rule,
        days_to_access:days,
        date_of_access:date
      }
      const r = await api.patch(`editLessonAccessRule/${props.quizId}`,data)
      console.log(r) 
      props.close(false) 
    }catch(e){console.log(e)}
  }

  const accessRules = [
    {rule:'L',name:'L - Liberação Imediata'},
    {rule:'D',name:'D - Quanditade de dias após a compra'},
    {rule:'F',name:'F - Data Fixa'},
  ]
  return(
    <Modal className="w-1/3" component={
      <div className="flex flex-col">
        <TitleModal icon="faCalendarCheck" title="Editar Regra de Liberação do Questionário" close={()=>props.close(false)}/>
        <div className="flex flex-col">
          <div className="flex flex-col justify-center my-4">
            <SelectForm value={rule} onChange={setRule}
              label="Selecione uma regra de liberação" 
              options={accessRules} lableKey="name" valueKey="rule"/>   

            { rule == 'D' 
              ? 
                <div className="p-4 rounded text-center bg-orange-600/50 border border-orange-500 text-white font-light">
                  <strong>D - Dias após a compra</strong>
                  <InputNumberForm step={1} value={days} onChange={setDays} />
                  <p className="text-xs">O Questionário estará após a quantidade de dias informados a contar pela data de compra</p>
                </div>
              : rule == 'F'
              ?
                <div className="p-4 rounded text-center bg-red-600/50 border border-red-500 text-white font-light">
                  <strong>F - Data Fixa</strong>
                  <InputForm inputType="date" value={date} onChange={setDate} />
                  <p className="text-xs">O Questionário estará disponível apenas após a data informada!</p>
                </div>
              :
                <div className="p-4 rounded text-center bg-teal-500 text-white font-light">
                  <strong>L - Liberação Imediata</strong>
                  <p className="text-xs">O Questionário estará disponível para o aluno assim que ele acessa-la</p>
                </div>}
          </div>
          <div className="flex justify-end border-t border-slate-600 pt-4">
            <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
            <Button icon="faFloppyDisk" btn="success" name="Salvar Nova Regra" onClick={()=>updateAccessRule()}/>
          </div>    
        </div>
      </div>
    }/>
  )
}