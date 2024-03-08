import { useEffect, useState } from "react"
import { InputForm } from "../../../../../components/Inputs"
import { IStudent } from "../../../Students/Dtos/student.dto"
import api from "../../../../../services/api"
import { LoadingBars } from "../../../../../components/Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserSlash } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../../components/Buttons"
import { Member } from "../PageMembers"

type Props = {
  searchParams:string,
  setSearchParams:React.Dispatch<React.SetStateAction<string>>,
  totalMembers:number
}
export const SearchMembers = (props:Props) => {
  return(
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <p className="text-white text-sm ">Membros <span className="text-[#0f0]">({props.totalMembers})</span></p>
      </div>
      <InputForm value={props.searchParams} onChange={props.setSearchParams} placeholder="Buscar Membros" className="text-xs mt-1"/>
    </div>
  )
}


type SearchMemberProps = {
  page:number,
  params:string,
  status:number,  
  infoMember:IStudent|null,
  setInfoMember:React.Dispatch<React.SetStateAction<IStudent|null>>
}
export const SearchMemberResults : React.FC<SearchMemberProps> = (props) => {
  const [ students, setStudents ] = useState<IStudent[]|null>(null)
  const [ nextPage, setNextPage ] = useState(0)
  const filter = 1
  const orderBy = 'id'
  const order = 'DESC'
  const getStudents = async () => {
    try{
      const res = await api.get(`/searchParams/${props.status}/${props.params}/${props.page}/${filter}/${orderBy}/${order}`)
      setStudents(res.data.response)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{getStudents()},[props.params])

  return(
    <>
      { students === null ? <LoadingBars/> 
      : students.length == 0 ? props.page === 1 &&
        <div className="flex flex-col w-full justify-center items-center p-8 text-white">
          <FontAwesomeIcon className="my-4 text-4xl text-neutral-500/50" icon={faUserSlash}/>
          <p>Nenhum Aluno encontrado</p>
        </div>
      : <>
        { students.map((student,key)=><Member key={key} student={student} infoMember={props.infoMember} setInfoMember={props.setInfoMember}/>)}
        { nextPage === 0 
          ? students.length >= 15 
            && <Button block btn="muted" type="notline" name="Carregar Mais Alunos" onClick={()=>setNextPage(props.page+1)}/>
          : <SearchMemberResults status={props.status} page={nextPage} params={props.params} infoMember={props.infoMember} setInfoMember={props.setInfoMember}/>
        }    
      </>} 
  </>)
}
