import { useEffect, useState } from "react"
import { ILessonsAccessRule, ILessonsModule, IModuleCourse } from "../../Dtos/courses.dto"
import { LoadingBars } from "../../../../../components/Loading"
import { Card } from "../../../../../components/Cards"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../../../../components/Buttons";
import DOMPurify from 'dompurify';
import api from "../../../../../services/api";
import { InputForm, InputNumberForm, SelectForm } from "../../../../../components/Inputs";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { TextEditor } from "../../../../../components/TextEditor";
import moment from 'moment';
import { QuizQuestionsSetup } from "./QuizQuestionsSetup";

type QuizSetupComponent = {
  setLessonSetup:React.Dispatch<React.SetStateAction<number|null>>,
  infoModule:IModuleCourse|null,
  lessonId:number,
  course:string
}
export const QuizSetup:React.FC<QuizSetupComponent> = (props) => {
  const [ infoQuiz, setInfoQuiz ] = useState<ILessonsModule|null>(null)
  const [ nameQuiz, setNameQuiz ] = useState("")

  const [ editDescription, setEditDescription ] = useState(false)
  const [ editAccessRule, setEditAccessRule ] = useState(false)
  const [ editVisibility, setEditVisibility ] = useState(false)
  const [ removeQuiz, setRemoveQuiz ] = useState(false)
  //Info
  const getInfo = async () => {
    try{
      const i = await api.get(`infoLesson/${props.lessonId}`)
      setInfoQuiz(i.data.response)
      setNameQuiz(i.data.response.name)
      
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{ getInfo() },[editDescription,editVisibility,removeQuiz]) 
  //Save Name Quiz
  const [ saveNameMessage, setSaveNameMessage ] = useState("")
  const saveNameQuiz = async () => {
    try{
      const r = await api.patch(`editLessonModule/${props.lessonId}`,{name:nameQuiz})
      console.log(r)
      setSaveNameMessage("Título do questionáeio alterado com sucesso!")
      setTimeout(()=>{setSaveNameMessage("")},3000)      
    }catch(e){console.log(e)}
  }

  const sanitizedHtml = (text:string) =>{
    return DOMPurify.sanitize(text);
  }

  //Rules
  const [ accessRule, setAccessRule ] = useState<ILessonsAccessRule|null>(null)
  const lessonAccessRules = async () => {
    try{
      const i = await api.get(`lessonAccessRule/${props.lessonId}`)
      console.log('lessonAccessRule',i.data)
      setAccessRule(i.data.response)      
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{lessonAccessRules()},[editAccessRule]) 

  return(
    <>
      { infoQuiz === null ? <LoadingBars/>
      : <div className="flex flex-col">
        {/*Info Course lesson*/}
        <Card component={
          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <p className="text-neutral-100">
                <FontAwesomeIcon className="text-teal-500/50" icon={Fas.faCube}/> Informações do Curso
              </p>
              <Button icon="faReply" btn="muted" name="Voltar" onClick={()=>props.setLessonSetup(null)}/>
            </div>
            <div className="flex w-full">           
              <div className="flex flex-col w-full justify-center px-4">
                <p className="text-white font-light"><b>Curso: </b>{props.course}</p>
                <p className="text-white font-light"><b>Módulo: </b>{props.infoModule ? props.infoModule.module : ""}</p>
                <p className="text-white font-light"><b>Código da Aula: </b>{props.lessonId}</p>
              </div>     
            </div>
          </div>}/>

        {/*Title Quiz*/}
        <Card component={
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col flex-1">
              <p className="text-teal-500 text-sm text-center">{saveNameMessage}</p>
                <InputForm label="Título do Questionário" value={nameQuiz} onChange={setNameQuiz}/>
              </div>          
              <div  className="mt-3 ml-2">
                <Button  btn="success" type="notline" icon="faFloppyDisk" name="Salvar Título" onClick={()=>saveNameQuiz()}/>
              </div>
            </div>}/>
        
        {/*Setup Quiz*/}  
        <div className="flex w-full">
          <div className="flex flex-col w-3/4">
            {/*Questions*/}
            <Card component={<QuizQuestionsSetup quizId={infoQuiz.id}/>}/>

            {/*Description lesson*/}
            <Card component={
              <div className="flex flex-col w-full justify-center items-center">
                <p className="text-white w-full">Descrição do Questionário</p>
                <div className="bg-neutral-950 mt-2 p-2 rounded flex  w-full">
                  <div className="my-2 font-extralight text-white" dangerouslySetInnerHTML={{ __html: sanitizedHtml(infoQuiz.description) }} />
                </div>
                <Button icon="faEdit" name="Editar Descrição" btn="muted" size="sm" onClick={()=>setEditDescription(true)}/>
              </div>}/>
            { editDescription && 
              <EditDescription 
                description={infoQuiz.description} 
                quizId={infoQuiz.id} 
                close={setEditDescription}/>}            
          </div>
       

          <div className="flex flex-col flex-1">
            {/*Access Rules*/}
            <Card component={
              <div className="flex flex-col w-full">
                <p className="text-white">
                  <FontAwesomeIcon className="text-teal-500" icon={Fas.faCalendarCheck}/> Regra de Liberação
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
                    quizId={infoQuiz.id} 
                    close={setEditAccessRule}/>}
              </div>}/>

            {/*Attachments*/}

            {/*Visible*/}
            <Card component={
              <div className="flex flex-col w-full">
                <p className="text-white">
                  <FontAwesomeIcon 
                    className="text-teal-500" 
                    icon={Fas.faBullhorn}/> Visibilidade do Questionário
                </p>
                {infoQuiz.visibility == 1
                ? <p className="text-teal-500 text-lg text-center w-full p-4"><FontAwesomeIcon className="opacity-50" icon={Fas.faEye}/> Público</p>  
                : <p className="text-red-500 text-lg text-center w-full p-4"><FontAwesomeIcon className="opacity-50" icon={Fas.faEyeSlash}/> Privado</p> }
                <Button btn="muted" icon="faPowerOff" name="Alterar Visibilidade" block size="sm" onClick={()=>setEditVisibility(true)} />
              </div>}/>
            {editVisibility && <ChangeStatus 
                                close={setEditVisibility} 
                                quizId={infoQuiz.id} 
                                visibility={infoQuiz.visibility == 1 ? 0 : 1}/>}              
            <Button 
              btn="error" 
              icon="faTrash" 
              type="notline" 
              name="Excluir Questionário" 
              onClick={()=>setRemoveQuiz(true)}/>
            { removeQuiz && <RemoveQuiz 
                              close={setRemoveQuiz} 
                              quizId={infoQuiz.id}/>}
          </div>
        </div>
      </div>          
    }
  </>)
}

type EditDescriptionComponent = {
  quizId:number,
  description:string,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const EditDescription: React.FC<EditDescriptionComponent> = (props) => {
  const [ description, setDescription ] = useState(props.description)
  const updateDescription = async () => {
    try{
      const data = {description:description}
      const r = await api.patch(`editLessonModule/${props.quizId}`,data)   
      console.log(r)  
      props.close(false)
    }catch(e){console.log(e)}
  }

  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal icon="faEdit" title="Editar descrição do Questionário" close={()=>props.close(false)}/>
        <div className="flex flex-col">
        <div className="flex flex-col justify-center my-4">
          <label className="font-semibold italic text-sm text-neutral-300 py-1">Edição de Texto</label>
          <TextEditor text={description} setText={setDescription}/>          
        </div>
          <div className="flex justify-end border-t border-slate-600 pt-4">
            <Button btn="muted" name="Cancelar" type="notline" onClick={()=>props.close(false)}/>
            <Button icon="faFloppyDisk" btn="success" name="Salvar Nova Descrição" onClick={()=>updateDescription()}/>
          </div>    
        </div>
      </div>
    }/>
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
        <TitleModal icon="faBullhorn" title="Alterar visibilidade do questionário" close={()=>props.close(false)}/>
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

type RemoveQuizComponent = {
  quizId:number,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const RemoveQuiz: React.FC<RemoveQuizComponent> = (props) => {
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