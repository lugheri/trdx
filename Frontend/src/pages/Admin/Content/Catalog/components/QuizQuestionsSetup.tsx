import { FormEvent, useEffect, useState } from "react"
import { IQuestionQuiz } from "../../Dtos/quiz.dto"
import api from "../../../../../services/api"
import { LoadingBars } from "../../../../../components/Loading"
import * as Far from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../../../../components/Buttons";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { InputNumberForm, SelectForm, TextAreaForm } from "../../../../../components/Inputs";
import { faAlignJustify, faSquareCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { OptionsQuestionQuiz } from "./QuizOptionsQuestionSetup";



interface IQuizQuestionsSetupProps{
  quizId:number
}
export const QuizQuestionsSetup : React.FC<IQuizQuestionsSetupProps> = ({quizId}) => {
  const [ addQuestion, setAddQuestion ] = useState<null|number>(null)
  const [ editQuestion, setEditQuestion ] = useState<null|IQuestionQuiz>(null)
  const [ deleteQuestion, setDeleteQuestion ] = useState<null|IQuestionQuiz>(null)
  const [ editOptions, setOptions ] = useState<null|IQuestionQuiz>(null)

  const [ questions, setQuestions ] = useState<null|IQuestionQuiz[]>(null)
  const [ error, setError ] = useState<null|string>(null)

  const getQuestions = async () => {
    try{
      const q = await api.get(`listQuestions/${quizId}`)
      if(q.data.error){
        setError(q.data.message)
      }else{
        console.log('Questions',q.data)
        setQuestions(q.data.response)
      }
    }catch(err){console.log(err)}
  }
  useEffect(()=>{getQuestions()},[quizId,addQuestion,editQuestion,deleteQuestion])

  return(
    <>
      { error !== null ? (
        <p className="text-red-500">{error}</p>
      ) : questions === null ? (  
        <LoadingBars/>
      ) : questions.length === 0 ? (  
        <EmptyQuestions quizId={quizId} setAddQuestion={setAddQuestion}/>
      ) : ( 
        <ListQuestions questions={questions} quizId={quizId} setAddQuestion={setAddQuestion} setEditQuestion={setEditQuestion} setOptions={setOptions}/> 
      )}
      { addQuestion && <AddQuestion quizId={quizId} close={setAddQuestion}/> }
      { editQuestion && <EditQuestion question={editQuestion} setOptions={setOptions} setDeleteQuestion={setDeleteQuestion} close={setEditQuestion}/>}
      { deleteQuestion && <DeleteQuestion question={deleteQuestion} close={setDeleteQuestion} closeEdit={setEditQuestion}/>}
      { editOptions && <OptionsQuestionQuiz question={editOptions} close={setOptions}/>}
    </>
  )
}

interface IEmptyQuestionsProps{
  quizId:number;
  setAddQuestion:React.Dispatch<React.SetStateAction<null|number>>
}
const EmptyQuestions : React.FC<IEmptyQuestionsProps> = (props) => {
  return(
    <div className="flex flex-col w-full">
      <p className="text-slate-100 text-sm">Configure as perguntas do Questionário</p>
      <div 
        className="bg-slate-800/40 w-full my-2 flex flex-col justify-center items-center px-2 py-8 rounded border border-teal-400">
        <FontAwesomeIcon className="text-white/50 text-6xl my-2" icon={Far.faQuestionCircle}/>
        <p className="text-white py-4">Este questionário ainda não possui nenhuma Questão!</p>
        <Button
          icon="faPlus" 
          name="Criar Primeira Questão" 
          btn="success" 
          onClick={()=>props.setAddQuestion(props.quizId)}/>
      </div>  
    </div>
  )
}

interface IListQuestionsProps{
  quizId:number;
  setAddQuestion:React.Dispatch<React.SetStateAction<null|number>>;
  setEditQuestion:React.Dispatch<React.SetStateAction<null|IQuestionQuiz>>;
  setOptions:React.Dispatch<React.SetStateAction<null|IQuestionQuiz>>;
  questions:IQuestionQuiz[]
}
const ListQuestions : React.FC<IListQuestionsProps> = (props) => {
  return(
    <div className="flex flex-col w-full">
      <div className="flex w-full justify-between items-center"> 
        <p className="text-slate-100 text-sm">Configure as perguntas do Questionário</p>
        <Button
          icon="faPlus" 
          name="Adicionar Questão" 
          type="outline"
          size="sm"
          btn="success" 
          onClick={()=>props.setAddQuestion(props.quizId)}/>
      </div>
      { props.questions.map((question,key)=><Question key={key} question={question} setEditQuestion={props.setEditQuestion} setOptions={props.setOptions}/>)}
    </div>
  )
}

interface IQuestionProps{
  question:IQuestionQuiz
  setEditQuestion:React.Dispatch<React.SetStateAction<null|IQuestionQuiz>>;
  setOptions:React.Dispatch<React.SetStateAction<null|IQuestionQuiz>>
}
const Question : React.FC<IQuestionProps> = (props) => {
  return(
    <div className="flex flex-col bg-slate-600/30 mt-1 p-2 rounded">
      <div className="flex justify-between items-center">
        <div className="flex flex-col flex-1">
          <div className="flex">
            <p className="text-teal-300 text-sm flex-1">{props.question.order}º Questão</p>
            <p className="text-teal-300 text-sm flex-1">
              { props.question.type_question === "D" ? (
                <><FontAwesomeIcon className="opacity-40" icon={faAlignJustify}/> Dissertativa</>
              ) : (
                <><FontAwesomeIcon className="opacity-40" icon={faSquareCheck}/> Objetiva</>
              )}
            </p>
          </div>
          <p className="text-white font-light">{props.question.question}</p>
        </div>
        <div className="flex ">
          {props.question.type_question === 'O' &&
            <Button
              icon="faListCheck"
              btn="light"
              type="notline"
              title="Configurar Respostas"
              onClick={()=>props.setOptions(props.question)}/>}
          <Button
            icon="faEdit"
            btn="info"
            type="notline"
            title="Editar Pergunta"
            onClick={()=>props.setEditQuestion(props.question)}
          />          
        </div>
      </div>
    </div>
  )
}


interface IAddQuestionProps{
  quizId:number;
  close:React.Dispatch<React.SetStateAction<null|number>>
}
const AddQuestion : React.FC<IAddQuestionProps> = (props) => {
  const [ error, setError ] = useState<null|string>(null)
  const [ addNewQuestion, setAddNewQuestion ] = useState(false)
  const [ questionText, setQuestionText] = useState("")
  const [ questionType, setQuestionType] = useState("D")
  const [ order, setOrder] = useState<null|number>(null)
  const [ published, setPublished] = useState(1)

  const setupOrderQuestion = async () => {
    try{
      const lastOrder = await api.get(`getLastOrderQuestion/${props.quizId}`)
      console.log('lastOrder',lastOrder.data)
      if(lastOrder.data.error){
        setError(lastOrder.data.message)
      }else{
        setOrder(parseInt(lastOrder.data.response)+1)
      }
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro interno!')
    }
  } 
  useEffect(()=>{ setupOrderQuestion() },[])

  const addQuestion = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const dataQuestion = {
        quiz_id:props.quizId,
        type_question:questionType,
        question:questionText,
        order:order,
        public:published
      }
      const r = await api.post('newQuestion',dataQuestion)
      console.log('Response',r.data)
      if(r.data.error){
        setError(r.data.message)
      }else{
        setAddNewQuestion(true)
      }
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro interno!')
    }
  }

  const newQuestion = () => {
    setError(null)
    setAddNewQuestion(false)
    const newOrder = order === null ? 1 : order+1
    setOrder(newOrder)
    setQuestionText("")
    setQuestionType("D")
    setPublished(1)
  }

  return(
    <Modal component={
      <form onSubmit={(e)=>addQuestion(e)} className="flex flex-col">
        <TitleModal icon="faPlus" title="Adicionar Questão" close={()=>props.close(null)}/>
        { addNewQuestion ? (
          <div className="p-4 flex flex-col w-[400px] justify-center items-center">
            <p className="text-white">Questão cadastrada com sucesso!</p>
            <p className="text-slate-300 font-light">Deseja cadastrar uma nova?</p>
            <div className="flex mt-2 border-t border-slate-600 w-full justify-center mt-4 pt-4">
            <Button
                btn="success" 
                icon="faPlus"
                name="Sim"
                onClick={()=>newQuestion()}/>
            <Button 
                btn="error" 
                name="Nao"
                type="notline"
                onClick={()=>props.close(null)}/>              
            </div>
          </div>
        ) : (   
          <div className="flex flex-col w-[950px]">       
            <div className="p-4">        
              <TextAreaForm 
                label="Pergunta:" 
                required 
                value={questionText} 
                onChange={setQuestionText} />
            
              <div className="flex">
                <div className="flex mr-2">
                  { order === null ? (
                    <LoadingBars/>
                  ) : (
                  <InputNumberForm 
                    label="Ordem"
                    min={0}
                    step={1}
                    value={order}
                    onChange={setOrder}
                    />) }
                </div>
                <div className="flex flex-1 mx-2">
                  <SelectForm 
                    label="Tipo de Pergunta"
                    options={[{'name':'Resposta Dissertativa','value':'D'},{'name':'Resposta Objetiva','value':'O'}]}
                    lableKey="name"
                    valueKey="value"
                    value={questionType}
                    onChange={setQuestionType}
                    />
                </div>
                <div className="flex flex-1 ml-2">
                  <SelectForm 
                    label="Visibilidade de Pergunta"
                    options={[{'name':'Pública','value':1},{'name':'Privada','value':0}]}
                    lableKey="name"
                    valueKey="value"
                    value={published}
                    onChange={setPublished}
                    />
                </div>
              </div>
            </div> 
            { error !== null && <p className="w-full text-center text-red-500 p-2"><FontAwesomeIcon icon={faTriangleExclamation}/> {error}</p> }
            <div className="flex justify-end items-center border-t border-slate-600">
              <Button 
                btn="muted" 
                name="Cancelar"
                type="notline"
                onClick={()=>props.close(null)}/>
              <Button
                btn="success" 
                icon="faPlus"
                name="Adicionar Pergunta"
                submit/>
            </div>
          </div>
        ) }
      </form>}/>
  )
}

interface IEditQuestionProps{
  question:IQuestionQuiz;
  setDeleteQuestion:React.Dispatch<React.SetStateAction<null|IQuestionQuiz>>;
  setOptions:React.Dispatch<React.SetStateAction<null|IQuestionQuiz>>;
  close:React.Dispatch<React.SetStateAction<null|IQuestionQuiz>>
}
const EditQuestion : React.FC<IEditQuestionProps> = (props) => {
  const [ error, setError ] = useState<null|string>(null)
  const [ questionText, setQuestionText] = useState(props.question.question)
  const [ questionType, setQuestionType] = useState(props.question.type_question)
  const [ order, setOrder] = useState<number>(props.question.order)
  const [ published, setPublished] = useState(props.question.public)

  const editQuestion = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const dataQuestion = {
        quiz_id:props.question.quiz_id,
        type_question:questionType,
        question:questionText,
        order:order,
        public:published
      }
      const r = await api.patch(`editQuestion/${props.question.id}`,dataQuestion)
      console.log('Response',r.data)
      if(r.data.error){
        setError(r.data.message)
      }else{
        props.close(null)
      }
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro interno!')
    }
  }
  return(
    <Modal className="w-[950px]" component={
      <form onSubmit={(e)=>editQuestion(e)} className="flex flex-col">
        <TitleModal icon="faFloppyDisk" title="Editar Questão" close={()=>props.close(null)}/>
        <div className="p-4">        
          <TextAreaForm 
            label="Pergunta:" 
            required 
            value={questionText} 
            onChange={setQuestionText} />
          
          <div className="flex">
            <div className="flex mr-2">
              <InputNumberForm 
                label="Ordem"
                min={0}
                step={1}
                value={order}
                onChange={setOrder}
                />
            </div>
            <div className="flex flex-1 mx-2">
              <SelectForm 
                label="Tipo de Pergunta"
                options={[{'name':'Resposta Dissertativa','value':'D'},{'name':'Resposta Objetiva','value':'O'}]}
                lableKey="name"
                valueKey="value"
                value={questionType}
                onChange={setQuestionType}
                />
            </div>
            <div className="flex flex-1 ml-2">
              <SelectForm 
                label="Visibilidade de Pergunta"
                options={[{'name':'Pública','value':1},{'name':'Privada','value':0}]}
                lableKey="name"
                valueKey="value"
                value={published}
                onChange={setPublished}
                />
            </div>
          </div>
        </div> 
        { error !== null && <p className="w-full text-center text-red-500 p-2"><FontAwesomeIcon icon={faTriangleExclamation}/> {error}</p> }
        <div className="flex justify-end items-center border-t border-slate-600">
          <Button 
            btn="muted" 
            name="Fechar"
            type="notline"
            onClick={()=>props.close(null)}/>
          <Button
            btn="error" 
            icon="faTrash"
            type="notline"
            name="Remover Questão"
            onClick={()=>props.setDeleteQuestion(props.question)}/>
          { questionType === "O" &&  
            <Button
            btn="info" 
            icon="faListCheck"
            name="Configurar Respostas"
            onClick={()=>props.setOptions(props.question)}/>}
          <Button
            btn="success" 
            icon="faFloppyDisk"
            name="Salvar Alterações"
            submit/>
        </div>
      </form>}/>
  )
}

interface IDeleteQuestionProps{
  question:IQuestionQuiz;
  close:React.Dispatch<React.SetStateAction<null|IQuestionQuiz>>;
  closeEdit:React.Dispatch<React.SetStateAction<null|IQuestionQuiz>>
}
const DeleteQuestion : React.FC<IDeleteQuestionProps> =(props) => {
  const [ error, setError ] = useState<null|string>(null)
  const deleteQuestion = async () => {
    try{
      const dataQuestion = {
        quiz_id:props.question.quiz_id,
        status:0
      }
      const r = await api.patch(`editQuestion/${props.question.id}`,dataQuestion)
      console.log('Response',r.data)
      if(r.data.error){
        setError(r.data.message)
      }else{
        props.close(null)
        props.closeEdit(null)
      }
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro interno!')
    }
  }
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon="faTrash" title="Remover Questão" close={()=>props.close(null)}/>
        <div className="p-4">        
          <p className="text-white">
            Confirmar remoção da <strong  className="text-red-500">{props.question.order}º Questão</strong>?
          </p>
        </div> 
        { error !== null && <p className="w-full text-center text-red-500 p-2"><FontAwesomeIcon icon={faTriangleExclamation}/> {error}</p> }
        <div className="flex justify-end items-center border-t border-slate-600">
          <Button 
            btn="muted" 
            name="Cancelar"
            type="notline"
            onClick={()=>props.close(null)}/>
          <Button
            btn="error" 
            icon="faTrash"
            name="Sim, Remover Questão"
            onClick={()=>deleteQuestion()}/>
        </div>
      </div>}/>
  )
}