import { FormEvent, useEffect, useState } from "react"
import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"
import api from "../../../../services/api"
import { InputForm, SearchInputForm } from "../../../../components/Inputs"
import { SearchStudents } from "../components/SearchStudents"
import { PageStudents } from "../components/PageStudents"
import { Card } from "../../../../components/Cards"
import { Modal, TitleModal } from "../../../../components/Modal"
import { useNavigate } from 'react-router-dom'

export const ActiveStudents = () => {
  const [ totalStudents, setTotalStudents ] = useState(0)
  const [newStudent, setNewStudent] = useState<boolean>(false)
  const getTotalStudents = async () => {
    try{
      const res = await api.get('totalStudents/1')
      setTotalStudents(res.data.response)
    }catch(err){console.log(err)}
  }

  const [ searchParams, setSearchParams ] = useState("")

  /*
  const [ order, setOrder ] = useState("")
  const [ orderBy, setOrderBy ] = useState("")
  const [ filterType, setFilterType ] = useState("all")
  const options_orderBy = [
    { field:'id',alias:'Cód'},
    { field:'since',alias:'Data de Entrada'},
    { field:'name',alias:'Nome'},
    { field:'mail',alias:'E-mail'}]

  const options_order = [
      { order:'ASC',alias:'Crescente'},
      { order:'DESC',alias:'Decrescente'}]

  const options_filterType = [
        { type:'all',alias:'Todos Alunos'},
        { type:'1',alias:'Comunidade'},
        { type:'0',alias:'Acesso Padrão'}]*/

  useEffect(()=>{getTotalStudents()},[])




  return(
    <div className="flex flex-col p-2">
      <TitlePage 
        icon="faUsers" 
        title="Alunos Ativos" 
        description="Alunos ativos na plataforma"
        rightComponent={<Button btn="success" icon="faUserPlus" name="Novo Aluno" onClick={()=>setNewStudent(true)} />} />
      
      <Card component={
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center p-2">
            <p className="text-neutral-400">Total de Alunos Ativos: <b className="text-[#0f0]">{totalStudents}</b></p>
          </div>
          <div className="flex justify-end items-center p-2">
            <div className="flex w-1/3">
              <SearchInputForm  className="mt-5"
                placeholder="Busque Alunos por Nome ou Email"  
                icon="faSearch" 
                value={searchParams} 
                onChange={setSearchParams}/>
            </div>
            {/*}
            <div className="flex w-[180px] overflow-hidden px-1">
              <SelectForm 
                label="Filtrar Por Tipo"
                empty="Filtrar Por:" 
                options={options_filterType} 
                lableKey="alias" 
                valueKey="type" 
                value={filterType}
                onChange={setFilterType}/>
            </div>
            <div className="flex w-[180px] overflow-hidden  pr-1">
              <SelectForm 
                label="Ordenar Por"
                empty="Ordenar Por:" 
                options={options_orderBy} 
                lableKey="alias" 
                valueKey="order" 
                value={orderBy}
                onChange={setOrderBy}/>
            </div>
            <div className="flex w-[180px] overflow-hidden  pr-1">
              <SelectForm 
                label="Ordem"
                empty="Ordem:" 
                options={options_order} 
                lableKey="alias" 
                valueKey="type" 
                value={order}
                onChange={setOrder}/>
            </div>     
            {*/}
          </div>

          {searchParams !== "" ? 
            <SearchStudents status={1} page={1} params={searchParams}/>
          : 
            <div className="flex flex-wrap w-full">
              <PageStudents status={1} page={1}/>
            </div>}
        </div>}/>
      { newStudent && <NewStudent setNewStudent={setNewStudent}/> }
    </div>)
}

type NewStudentComponent = {
  setNewStudent:React.Dispatch<React.SetStateAction<boolean>>
}
const NewStudent : React.FC<NewStudentComponent> = (props) => {
  const navigate = useNavigate()
  {/*New User*/}
  const [studentName, setStudentName] = useState("")
  const [studentMail, setStudentMail] = useState("")
  const createNewStudent = async (e:FormEvent) => {
    e.preventDefault();
    try{
      const dataStudent = {
        name:studentName,
        mail:studentMail,
        password:studentMail
      }
      const newStudent = await api.post("/newStudent",dataStudent)
      if(newStudent.data.error){alert(newStudent.data.error)}else{
        navigate(`/admin/students/actives/info/${newStudent.data.response.id}`)
        props.setNewStudent(false)
      }
    }catch(err){
      console.log(err)
    }
  }

  return(<Modal component={<div>
    <TitleModal icon="faUserPlus" close={()=>props.setNewStudent(false)}
               title="Novo Aluno"
                subtitle="Cadastre um novo aluno na plataforma"/>

    <form onSubmit={(e)=>createNewStudent(e)}>
      <div className="py-4">
        <InputForm label="Nome do Aluno" placeholder='Insira o Nome do Usuário' required value={studentName} onChange={setStudentName}/>
        <InputForm label="E mail do Aluno" placeholder='Email' required value={studentMail} onChange={setStudentMail}/>
      </div>
      <div className="border-t border-slate-600 flex justify-end items-center pt-3">
        <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.setNewStudent(false)}/>
        <Button submit name="Criar Usuário" icon="faUserPlus" btn="success"/>
      </div>
    </form>     
    </div>}/>)
}