import { useEffect, useState } from "react"
import { Button } from "../../../../../../components/Buttons"
import { Card } from "../../../../../../components/Cards"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import api from "../../../../../../services/api"
import { ISettingsQuiz } from "../../../Dtos/quiz.dto"
import { InputNumberForm, SelectForm } from "../../../../../../components/Inputs"
import { LoadingBars } from "../../../../../../components/Loading"
import { Modal, TitleModal } from "../../../../../../components/Modal"

type Props = {
  quizId:number
}
export const QuizSettings = (props:Props) => {
  const [ error, setError ] = useState<string|null>(null)
  const [ messageError, setMessageError ] = useState('')

  const [settings, setSettings ] = useState<ISettingsQuiz |null>(null)

  const [ showModules, setShowModules] = useState(0)
  const [ passingThreshold, setPassingThreshold] = useState(0)
  const [ timeRetry, setTimeRetry] = useState(0)

  //Editing
  const [ editQuizScreen, setEditQuizScreen ] = useState<"home"|"appr"|"repr"|null>(null)

  const getSettingsQuiz = async () => {
    try{
      const info = await api.get(`infoSettingsQuestion/${props.quizId}`)
      if(info.data.error){
        setError('Ocorreu um erro ao recuperar os dados!')
        setMessageError(info.data.message)
      }else{
        const infoSettings : ISettingsQuiz = info.data.response
        setSettings(infoSettings) 
        console.log('infoSettings',infoSettings)

        setShowModules(infoSettings.show_modules)
        setPassingThreshold(infoSettings.passing_threshold)
        setTimeRetry(infoSettings.hours_retry_on_fail)
      }
    }catch(err){
      setError('Ocorreu um erro ao recuperar os dados!')
      setMessageError(err)
    }
  }

  const optionsShowModule = [
    { "name":"Sim","value":1},
    { "name":"Não","value":0}
  ]

  useEffect(()=>{getSettingsQuiz()},[])

  return(
    error !== null ? (
      <div className="flex flex-col justify-center items-center py-8">
        <FontAwesomeIcon className="text-red-500/50 text-4xl" icon={faExclamationTriangle}/> 
        <p className="text-red-500/50">{error}</p>
        <p className="text-white/50 text-xs font-light">{messageError}</p>
      </div>
    ) : settings === null ? (
      <LoadingBars/>
    ) : (
    <>
      <div className="flex">
        <Card className="flex-1" component={
          <div className="flex flex-col w-full">
            <div className="flex flex-col h-36 justify-center items-center">
              <p className="text-white text-lg font-black">{settings.home_title_1}</p>
              <p className="text-green-500 text-lg font-black">{settings.home_title_2}</p>
              <p className="text-white/70 text-sm font-light text-center">{settings.home_text}</p>
            </div>
            <Button 
              name="Editar Tela Inicial" 
              btn="muted" 
              block
              onClick={()=>setEditQuizScreen("home")}/>           
          </div>          
        }/>

        <Card className="flex-1" component={
          <div className="flex flex-col w-full">
            <div className="flex flex-col h-36 justify-center items-center">
              <p className="text-white text-lg font-black">{settings.reproved_title_1}</p>
              <p className="text-green-500 text-lg font-black">{settings.reproved_title_2}</p>
              <p className="text-white/70 text-sm font-light text-center">{settings.reproved_text}</p>
            </div>
            <Button 
              name="Editar Tela de Reprovação" 
              btn="muted" 
              block
              onClick={()=>setEditQuizScreen("repr")}/>           
          </div>          
        }/>

        <Card className="flex-1" component={
          <div className="flex flex-col w-full">
            <div className="flex flex-col h-36 justify-center items-center">
              <p className="text-white text-lg font-black">{settings.approved_title_1}</p>
              <p className="text-green-500 text-lg font-black">{settings.approved_title_2}</p>
              <p className="text-white/70 text-sm font-light text-center">{settings.approved_text}</p>
            </div>
            <Button 
              name="Editar Tela de Aprovação" 
              btn="muted" 
              block
              onClick={()=>setEditQuizScreen("appr")}/>             
          </div>          
        }/>
        { editQuizScreen && 
          <EditQuizScreen 
            screen={editQuizScreen} 
            quizId={props.quizId} 
            settings={settings}
            close={setEditQuizScreen} />}
      </div>

      <div className="flex flex-col">
        <Card component={
          <div className="flex flex-col w-full justify-center items-center">
            <p className="text-white w-full">Comportamento do Questionário</p>
            <div className="flex w-full">
              <SelectForm 
                options={optionsShowModule}
                lableKey="name"
                valueKey="value"
                value={showModules}
                onChange={setShowModules}
                label="Exibir Módulos do Curso"/>
            </div>  
            <div className="flex w-full">
              <InputNumberForm
                value={passingThreshold}
                min={0}
                max={100}
                step={5} 
                label="Aproveitamento Mínimo para Aprovação (%)"
                onChange={setPassingThreshold}/>
            </div>  
            <div className="flex w-full">
              <InputNumberForm
                value={timeRetry}
                min={0}
                step={1} 
                label="Tempo Mínimo para Retentativa (Em Horas)"
                onChange={setTimeRetry}/>
            </div>  
          </div>}/>          
      </div>
    </>   
    )
  )
}




//Editing Screens
type EditQuizScreenProps = {
  screen:"home"|"appr"|"repr",
  quizId:number,
  settings:ISettingsQuiz,
  close:React.Dispatch<React.SetStateAction<"home"|"appr"|"repr"|null>>
}
const EditQuizScreen = (props:EditQuizScreenProps) => {
  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal 
          icon="faEdit"
          title={`Editar Tela ${props.screen == "home" ? 
                                "Inicial" 
                              : props.screen == "appr" ? 
                                "de Aprovação" 
                              : "de Reprovação" } do Questionário`} 
          close={()=>props.close(null)}/>
        
        { props.screen == "home" ? (
          <div className="flex flex-col my-4">
            <p>Tela Inicial</p>
          </div>    
        ) : props.screen == "appr" ? (
          <div className="flex flex-col my-4">
            <p>Tela de Aprovação</p>
          </div> 
        ) : (
          <div className="flex flex-col my-4">
            <p>Tela de Reprovação</p>
          </div>
        )}
        <div className="flex justify-end border-t border-slate-600 pt-4">
          <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(null)}/>
        </div>  
      </div>}/>
  )
}