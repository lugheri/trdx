import { FormEvent, useEffect, useState } from "react"
import { Button } from "../../../../../../components/Buttons"
import { Card } from "../../../../../../components/Cards"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import api from "../../../../../../services/api"
import { ISettingsQuiz } from "../../../Dtos/quiz.dto"
import { InputForm, InputNumberForm, SelectForm, TextAreaForm } from "../../../../../../components/Inputs"
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

  useEffect(()=>{getSettingsQuiz()},[editQuizScreen])


  const handleShowModules = async (value:string) => {

    console.log('handleShowModules',value)
    setShowModules(parseInt(value))
    await saveSettings( { show_modules:parseInt(value) })
  }
  const handlePassingThreshold = async (value:number) => {
    setPassingThreshold(value)
    await saveSettings( { passing_threshold:value })
  }
  const handleTimeRetry = async (value:number) => {
    setTimeRetry(value)
    const data = { hours_retry_on_fail:value }
    await saveSettings(data)
  }

  const saveSettings = async (data:any) => {
    try{
      const r = await api.patch(`editSettingsQuestion/${props.quizId}`,data)
      if(r.data.success){
        return
      }
      setError('Ocorreu um erro ao salvar os dados!')
      setMessageError(r.data.message)
    }catch(err){
      setError('Ocorreu um erro ao salvar os dados!')
      setMessageError(err)
    }
  }  




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
                onChange={handleShowModules}
                label="Exibir Módulos do Curso"/>
            </div>  
            <div className="flex w-full">
              <InputNumberForm
                value={passingThreshold}
                min={0}
                max={100}
                step={5} 
                label="Aproveitamento Mínimo para Aprovação (%)"
                onChange={handlePassingThreshold}/>
            </div>  
            <div className="flex w-full">
              <InputNumberForm
                value={timeRetry}
                min={0}
                step={1} 
                label="Tempo Mínimo para Retentativa (Em Horas)"
                onChange={handleTimeRetry}/>
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
  const [ error, setError ] = useState<string|null>(null)
  const [ errorMessage, setErrorMessage ] = useState<string|null>(null)
  const [ title1, setTitle1 ] = useState(props.screen == "home" ? props.settings.home_title_1 : props.screen == "appr" ? props.settings.approved_title_1 : props.settings.reproved_title_1)
  const [ title2, setTitle2 ] = useState(props.screen == "home" ? props.settings.home_title_2 : props.screen == "appr" ? props.settings.approved_title_2 : props.settings.reproved_title_2)
  const [ text, setText ] = useState(props.screen == "home" ? props.settings.home_text : props.screen == "appr" ? props.settings.approved_text : props.settings.reproved_text)

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = props.screen == "home" ? {
                    home_title_1:title1,
                    home_title_2:title2,
                    home_text:text
                  } : props.screen == "appr" ? {
                    approved_title_1:title1,
                    approved_title_2:title2,
                    approved_text:text
                  } : {
                    reproved_title_1:title1,
                    reproved_title_2:title2,
                    reproved_text:text
                  }
      const r = await api.patch(`editSettingsQuestion/${props.quizId}`,data)
      if(r.data.success){
        props.close(null)
        return
      }
      setError('Ocorreu um erro ao salvar os dados!')
      setErrorMessage(r.data.message)
    }catch(err){
      setError('Ocorreu um erro ao salvar os dados!')
      setErrorMessage(err)
    }
  }
  return(
    <Modal className="w-full" component={
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <TitleModal 
          icon="faEdit"
          title={`Editar Tela ${props.screen == "home" ? 
                                "Inicial" 
                              : props.screen == "appr" ? 
                                "de Aprovação" 
                              : "de Reprovação" } do Questionário`} 
          close={()=>props.close(null)}/>
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center w-1/3 h-full bg-neutral-900 px-2 py-10 mx-2 rounded-md">
            <p className="text-white font-bold text-lg">{title1}</p>
            <p className="text-green-500 font-bold text-lg mb-1">{title2}</p>
            <p className="text-white/80 font-light text-xs text-center">{text}</p>          
          </div>
          <div className="flex flex-col my-4 w-2/3">
            <InputForm 
              label="Titulo 1"
              value={title1}
              onChange={setTitle1}/>  
            <InputForm 
              label="Titulo 1"
              value={title2}
              onChange={setTitle2}/>
            <TextAreaForm
              label="Texto"
              value={text}
              onChange={setText}/>
          </div>
        </div>  
      
        <div className="flex justify-end border-t border-slate-600 pt-4">
          { error && <p className="text-red-500" title={errorMessage}>{error}</p>}
          <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(null)}/>
          <Button btn="success" icon="faFloppyDisk" name="Salvar" submit/>
        </div>  
      </form>}/>
  )
}