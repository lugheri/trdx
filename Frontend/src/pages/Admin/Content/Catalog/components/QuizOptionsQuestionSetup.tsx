import { FormEvent, useEffect, useState } from "react"
import { IOptionQuestionQuiz, IQuestionQuiz } from "../../Dtos/quiz.dto"
import api from "../../../../../services/api"
import { LoadingBars } from "../../../../../components/Loading"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSquareCheck, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../../../../components/Buttons";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { InputNumberForm, SelectForm, TextAreaForm } from "../../../../../components/Inputs";

interface IOptionsQuestionQuizProps{
  question:IQuestionQuiz;
  close:React.Dispatch<React.SetStateAction<null|IQuestionQuiz>>
}
export const OptionsQuestionQuiz : React.FC<IOptionsQuestionQuizProps> = (props) => {
  const [ addOption, setAddOption ] = useState<null|number>(null)
  const [ editOption, setEditOption ]= useState<null|IOptionQuestionQuiz>(null)
  const [ deleteOption, setDeleteOption ]= useState<null|IOptionQuestionQuiz>(null)

  const [ error, setError ] = useState<null|string>(null)
  const [ options, setOptions ] = useState<null|IOptionQuestionQuiz[]>(null)

  const getOptions = async () => {
    try{
      const o = await api.get(`listOptionsQuestion/${props.question.id}`)
      if(o.data.error){
        setError(o.data.message)
      }else{
        setOptions(o.data.response)
      }
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro interno')
    }
  }

  useEffect(()=>{getOptions()},[addOption,editOption,deleteOption])
  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal icon="faListCheck" title="Configure as opçoes de resposta" close={()=>props.close(null)}/>
        <p className="text-teal-500 mt-2">Cadastre as opções de resposta da pergunta:</p>
        <p className="text-white font-light text-sm">
          {props.question.order}º - {props.question.question}
        </p>

        <div className="bg-slate-950/40 p-2 flex flex-col max-h-[300px] w-full rounded overflow-auto mt-2">
          {error !== null ? (
            <p className="text-red-500">{error}</p>
          ) : options === null ? (
            <LoadingBars/>
          ) : options.length === 0 ? (
            <EmptyOptions questionId={props.question.id} setAddOption={setAddOption} />
          ) : (
            <ListOptions options={options} questionId={props.question.id} setAddOption={setAddOption} setEditOption={setEditOption}/>
          )}
        </div>
        <div className="flex justify-end items-center border-t border-slate-600">
          <Button 
            btn="muted" 
            name="Fechar"
            type="notline"
            onClick={()=>props.close(null)}/>          
        </div>
        { addOption && <AddOption questionId={props.question.id} close={setAddOption}/> }
        { editOption && <EditOption option={editOption} setDeleteOption={setDeleteOption} close={setEditOption}/>}      
        { deleteOption && <DeleteOption option={deleteOption} close={setDeleteOption} closeEdit={setEditOption}/>}
      </div>}/>
  )
}

interface IEmptyOptionsProps{
  questionId:number;
  setAddOption:React.Dispatch<React.SetStateAction<null|number>>
}
const EmptyOptions : React.FC<IEmptyOptionsProps> = (props) => {
  return(
    <div className="flex flex-col w-full">
      <div 
        className="bg-slate-800/40 w-full my-2 flex flex-col justify-center items-center px-2 py-8 rounded border border-teal-400">
        <FontAwesomeIcon className="text-white/50 text-6xl my-2" icon={faSquareCheck}/>
        <p className="text-white py-4">Esta questão ainda não possui nenhuma Opção de Resposta!</p>
        <Button
          icon="faPlus" 
          name="Criar Primeira Opção" 
          btn="success" 
          onClick={()=>props.setAddOption(props.questionId)}/>
      </div>  
    </div>
  )
}

interface IListOptionsProps{
  questionId:number;
  setAddOption:React.Dispatch<React.SetStateAction<null|number>>
  setEditOption:React.Dispatch<React.SetStateAction<null|IOptionQuestionQuiz>>
  options:IOptionQuestionQuiz[]
}
const ListOptions : React.FC<IListOptionsProps> = (props) => {
  return(
    <div className="flex flex-col w-full">
      <div className="flex w-full justify-between items-center"> 
        <p className="text-slate-100 text-sm">Opções de Resposta</p>
        <Button
          icon="faPlus" 
          name="Nova Opção" 
          type="outline"
          size="sm"
          btn="success" 
          onClick={()=>props.setAddOption(props.questionId)}/>
      </div>
      { props.options.map((option,key)=><Option key={key} option={option} setEditOption={props.setEditOption}/>)}
    </div>
  )
}

interface IOptionProps{
  option:IOptionQuestionQuiz
  setEditOption:React.Dispatch<React.SetStateAction<null|IOptionQuestionQuiz>>
}
const Option : React.FC<IOptionProps> = (props) => {
  return(
    <div className="flex flex-col bg-slate-600/30 mt-1 p-2 rounded">
      <div className="flex justify-between items-center">
        <div className="flex flex-col flex-1">
          <div className="flex">
            <p className="text-white flex-1">
              <FontAwesomeIcon className="text-teal-500/50" icon={faSquareCheck}/> {props.option.answer}
            </p>                    
          </div>
          <div className="flex mt-2 items-center">
            <p className="text-teal-300 text-xs font-light flex-1">{props.option.order}º Opção</p>
            { props.option.correct_answer === 1 && 
                <div className="flex flex-1">
                  <div className="bg-teal-800 text-white rounded shadow px-2 text-sm">
                    <FontAwesomeIcon icon={faCheck}/> Alternativa Correta
                  </div>
                </div>}   
          </div>
        </div>
        <div className="flex flex-col">
          <Button
            icon="faEdit"
            btn="info"
            type="notline"
            title="Editar Opção"
            onClick={()=>props.setEditOption(props.option)}
          />          
        </div>
      </div>
    </div>
  )
}


interface IAddOptionProps{
  questionId:number;
  close:React.Dispatch<React.SetStateAction<null|number>>
}
const AddOption : React.FC<IAddOptionProps> = (props) => {
  const [ error, setError ] = useState<null|string>(null)  
  const [ addNewOption, setAddNewOption ] = useState(false)

  const [ answerText, setAnswerText] = useState("")  
  const [ correctAnswer, setCorrectAnswer] = useState("0") 

  const [ order, setOrder] = useState<null|number>(null)
  

  const setupOrderOption = async () => {
    try{
      const lastOrder = await api.get(`getLastOrderOption/${props.questionId}`)
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
  useEffect(()=>{ setupOrderOption() },[])

  const addOption = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const dataOption = {
        question_id:props.questionId,
        answer:answerText,
        correct_answer:parseInt(correctAnswer),
        order:order
      }
      console.log('dataOption',dataOption)
      const r = await api.post('newOptionQuestion',dataOption)
      if(r.data.error){
        setError(r.data.message)
      }else{
        setAddNewOption(true)
      }
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro interno!')
    }
  }

  const newOption = () => {
    setError(null)
    setAddNewOption(false)
    const newOrder = order == null ? 1 : order+1
    setOrder(newOrder)
    setAnswerText("")  
    setCorrectAnswer('0')
  }

  return(
    <Modal component={
      <form onSubmit={(e)=>addOption(e)} className="flex flex-col">
        <TitleModal icon="faPlus" title="Adicionar Opção" close={()=>props.close(null)}/>
        { addNewOption ? (
          <div className="p-4 flex flex-col w-[400px] justify-center items-center">
            <p className="text-white">Opção de resposta cadastrada com sucesso!</p>
            <p className="text-slate-300 font-light">Deseja cadastrar uma nova?</p>
            <div className="flex mt-2 border-t border-slate-600 w-full justify-center mt-4 pt-4">
            <Button
                btn="success" 
                icon="faPlus"
                name="Sim"
                onClick={()=>newOption()}/>
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
                  label="Resposta:" 
                  required 
                  value={answerText} 
                  onChange={setAnswerText} />  
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
                    label="Resposta Correta?"
                    options={[{'name':'Sim','value':'1'},{'name':'Não','value':'0'}]}
                    lableKey="name"
                    valueKey="value"
                    value={correctAnswer}
                    onChange={setCorrectAnswer}
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
                name="Adicionar Opção"
                submit/>
            </div>
          </div>
        ) }
      </form>}/>
  )
}

interface IEditOptionProps{
  option:IOptionQuestionQuiz;
  setDeleteOption:React.Dispatch<React.SetStateAction<null|IOptionQuestionQuiz>>
  close:React.Dispatch<React.SetStateAction<null|IOptionQuestionQuiz>>
}
const EditOption : React.FC<IEditOptionProps> = (props) => {
  const [ error, setError ] = useState<null|string>(null)

  const [ answerText, setAnswerText] = useState(props.option.answer)  
  const [ correctAnswer, setCorrectAnswer] = useState<string>(props.option.correct_answer == 1 ? '1':'0') 
  const [ order, setOrder] = useState<number>(props.option.order)
 

  const editOption = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const dataOption = {
        question_id:props.option.question_id,
        answer:answerText,
        correct_answer:parseInt(correctAnswer),
        order:order
      }
      const r = await api.patch(`editOptionQuestion/${props.option.id}`,dataOption)
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
      <form onSubmit={(e)=>editOption(e)} className="flex flex-col">
        <TitleModal icon="faFloppyDisk" title="Editar Opção" close={()=>props.close(null)}/>
        <div className="p-4">      
          <TextAreaForm 
            label="Resposta:" 
            required 
            value={answerText} 
            onChange={setAnswerText} />  
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
                label="Resposta Correta?"
                options={[{'name':'Sim','value':'1'},{'name':'Não','value':'0'}]}
                lableKey="name"
                valueKey="value"
                value={correctAnswer}
                onChange={setCorrectAnswer}
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
            name="Remover Questão"
            onClick={()=>props.setDeleteOption(props.option)}/>
          <Button
            btn="success" 
            icon="faFloppyDisk"
            name="Salvar Alterações"
            submit/>
        </div>
      </form>}/>
  )
}

interface IDeleteOptionProps{
  option:IOptionQuestionQuiz;
  close:React.Dispatch<React.SetStateAction<null|IOptionQuestionQuiz>>;
  closeEdit:React.Dispatch<React.SetStateAction<null|IOptionQuestionQuiz>>
}
const DeleteOption : React.FC<IDeleteOptionProps> =(props) => {
  const [ error, setError ] = useState<null|string>(null)
  const deleteOption = async () => {
    try{
      const dataOption = {
        status:0
      }
      const r = await api.patch(`editOptionQuestion/${props.option.id}`,dataOption)
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
        <TitleModal icon="faTrash" title="Remover Opção" close={()=>props.close(null)}/>
        <div className="p-4">        
          <p className="text-white">
            Confirmar remoção da <strong  className="text-red-500">{props.option.order}º Opção</strong>?
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
            onClick={()=>deleteOption()}/>
        </div>
      </div>}/>
  )
}
