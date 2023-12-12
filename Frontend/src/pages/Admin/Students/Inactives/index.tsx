import { useEffect, useState } from "react"
import { TitlePage } from "../../../../components/Template/TitlePage"
import api from "../../../../services/api"
import { SearchInputForm } from "../../../../components/Inputs"
import { SearchStudents } from "../components/SearchStudents"
import { PageStudents } from "../components/PageStudents"
import { Card } from "../../../../components/Cards"
export const InactiveStudents = () => {
  const [ totalStudents, setTotalStudents ] = useState(0)
  const getTotalStudents = async () => {
    try{
      const res = await api.get('totalStudents/0')
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
        icon="faUsersSlash" 
        title="Alunos Inativos" 
        description="Alunos inativos na plataforma"/>
      
      <Card component={
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center p-2">
            <p className="text-neutral-400">Total de Alunos InAtivos: <b className="text-[#f00]">{totalStudents}</b></p>
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
            <SearchStudents status={0} page={1} params={searchParams}/>
          : 
            <div className="flex flex-wrap w-full">
              <PageStudents status={0} page={1}/>
            </div>}
        </div>}/>      
    </div>)
}
