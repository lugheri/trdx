import { useState, useEffect } from 'react'
import { Button } from "../../../../components/Buttons"
import { InputForm, SelectForm } from "../../../../components/Inputs"
import { TitlePage } from "../../../../components/Template/TitlePage"
import api from '../../../../services/api'


import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink } from 'react-router-dom'
import { StudentProfilePhoto } from '../../../../components/StudentProfilePhoto'

export const InactiveStudents = () => {  
  const [ paramsStudents, setParamsStudents ] = useState("")
  const [ valueStudents, setValueStudents ] = useState("")
  const [ orderStudents, setOrderStudents ] = useState("")
  const select_params = [{"alias":"Nome","field":"name"},
                         {"alias":"Comunidade","field":"comunity"},
                         {"alias":"E-mail","field":"mail"},
                         {"alias":"Telefone","field":"phone"},
                         {"alias":"Gênero","field":"gender"}]
  //const order_filter = [{"alias":"Crescente","order":"asc"},{"alias":"Decrescente","order":"desc"}]

  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faUserXmark" 
        title="Alunos Inativos" 
        description="Lista de alunos com acesso inativado"/>

      <div className="flex item-end justify-end">
        <div className="flex w-[30%] p-2 justify-end mb-4">
          <p className="text-white">Busca de Aluno</p>
        </div>
       
        <div className="flex mx-1 min-w-[5%]">
          <SelectForm className="text-xs" empty='Filtro' options={select_params} lableKey='alias' valueKey='field' value={paramsStudents} onChange={setParamsStudents}/>
        </div>
        { paramsStudents == "comunity" ? 
          <div className="flex mx-1 min-w-[5%]"> 
            <SelectForm empty='Tipo de Acesso' className="text-xs" options={[{"alias":"Comunidade","field":1},{"alias":"Acesso Padrão","field":0}]} lableKey='alias' valueKey='field' value={valueStudents} onChange={setValueStudents}/>
          </div>
         : paramsStudents == "name" ? 
          <div className="flex mx-1 min-w-[20%]">
            <InputForm className="text-xs" placeholder="Busca por nome do Aluno" value={valueStudents} onChange={setValueStudents} />
          </div>
        : paramsStudents == "mail" ? 
          <div className="flex mx-1 min-w-[20%]">
            <InputForm className="text-xs" placeholder="E-Mail do Aluno" value={valueStudents} onChange={setValueStudents} />
          </div>
        : paramsStudents == "phone" ? 
          <div className="flex mx-1 min-w-[15%]">
            <InputForm className="text-xs" placeholder="Telefone do Aluno" value={valueStudents} onChange={setValueStudents} />
          </div>
        : paramsStudents == "gender" && 
          <div className="flex mx-1 min-w-[15%]"> 
            <SelectForm empty='Selecione o Gênero' className="text-xs" options={[{"alias":"Masculino","field":"M"},{"alias":"Feminino","field":"F"}]} lableKey='alias' valueKey='field' value={valueStudents} onChange={setValueStudents}/>
          </div>
        }
        { valueStudents && <button className="px-2 text-xs text-white mb-6" onClick={()=>{setValueStudents(""),setParamsStudents("")}}>Limpar Busca</button> }
       
      </div>

      <PageStudents page={1} params={paramsStudents} value={valueStudents} order={orderStudents} setOrderStudents={setOrderStudents}/>
    </div>
  )
}

type IPageStudents = {
  page: number;
  params: string;
  value: string;
  order: string;  
  setOrderStudents: React.Dispatch<React.SetStateAction<string>>
};

const PageStudents : React.FC<IPageStudents>  = (props) => {
  type Students = {
    id:number;
    since:string;
    comunity:number;
    type:string;
    photo:number;
    name:string;
    mail:string;
    born:string;
    phone:string;
    gender:string;
    city:string;
    state:string;
    password:string;
    logged:number;
    reset:number;
    status:number;
  }
  

  const [ listStudents, setListStudents ] = useState<Students[] | null>(null)
  const [ nextPage, setNextPage ] = useState<number | null>(null)
  useEffect(()=>{
    const getStudents = async () => {
      try{
        const students = props.value ? 
          await api.post('searchStudents',{ "params":props.params,
                                            "value":props.value,
                                            "orderedBy":props.params,
                                            "order":props.order ? props.order : 'ASC',
                                            "page":props.page,
                                            "status":0}) 
        : await api.post('listStudents',{status:0,page:props.page})
        
        setListStudents(students.data.response)
      }catch(err){
        console.log(err)
      }
    }   
    getStudents()   
  },[props.value])

  return(
    <>
      <div className="flex flex-col">
        {listStudents === null ? <p>Carregando</p> :
        listStudents.length == 0 ? <p>Nenhum aluno cadastrado</p>
        : listStudents.map((student,key)=>
        <div key={key} className="bg-neutral-800 p-3 rounded mb-2 flex justify-between items-center text-neutral-400">
        <StudentProfilePhoto photo_id={student.photo} class="w-[35px] h-[35px]"/>
        <div className="flex flex-col flex-1 justify-center items-start">
          <p className="font-black">{student.name}</p>
          <p className="text-xs">{student.mail}</p>
        </div>
        <div className="flex flex-1 text-red-500">
          <p><FontAwesomeIcon icon={Fas.faBan}/> Acesso Inativo</p>
        </div>       
       
        <div className="flex">
          <NavLink 
            className="flex justify-center m-1 items-center text-center cursor-pointer font-semibold bg-gray-500 text-white hover:bg-gray-600 p-2 text-sm rounded-md"
            to={`/admin/students/actives/info/${student.id}`}
            title="Abrir Ficha do Aluno">
            <FontAwesomeIcon icon={Fas.faFolderOpen}/>
          </NavLink>

        </div>
      </div>
        )
        }
      </div>
      { nextPage === null ? 
        <Button name="Carregar Mais Alunos" btn='muted' type="notline" onClick={()=>setNextPage(props.page+1)}/> 
      : <PageStudents page={nextPage} params={props.params} value={props.value} order={props.order} setOrderStudents={props.setOrderStudents}/> }  
    </>
  )
}