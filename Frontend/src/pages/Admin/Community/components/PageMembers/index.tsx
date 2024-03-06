import { useEffect, useState } from "react"
import { IStudent } from "../../../Students/Dtos/student.dto"
import api from "../../../../../services/api"
import { LoadingBars } from "../../../../../components/Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserSlash } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../../components/Buttons"
import { StudentProfilePhoto } from "../../../../../components/StudentProfilePhoto"

type Props = {
  page:number,
  status:number,
  setInfoMember:React.Dispatch<React.SetStateAction<IStudent|null>>
}
export const PageMembers = (props:Props) => {
  const [ error, setError ] = useState<string|null>(null)
  const [ students, setStudents ] = useState<IStudent[]|null>(null)
  const [ nextPage, setNextPage ] = useState(0)
  const filter = '1'
  const orderBy = 'id'
  const order = 'DESC'
  const getStudents = async () => {
    try{
      const res = await api.get(`/listStudents/${props.status}/${props.page}/${filter}/${orderBy}/${order}`)
      if(res.data.error){     
        console.log(res.data.error)   
        setError(res.data.error)
        return
      }
      setStudents(res.data.response)
    }catch(err){
      console.log(err)
      setError(err)
    }
  }
  useEffect(()=>{getStudents()},[])

  return(
    <>
      { error !== null ? (
        <p className="text-red-500 text-center" title={error}>Ocorreu um erro ao recuperar os dados</p>
      ) : students === null ? (
        <LoadingBars/>
      ) : students.length == 0 ? props.page === 1 && (
        <div className="flex flex-col w-full justify-center items-center p-8 text-white h-full">
          <FontAwesomeIcon className="my-4 text-4xl text-neutral-500/50" icon={faUserSlash}/>
          <p className="text-center">Nenhum Membro encontrado</p>
        </div>
      ) : (
        <>
          { students.map((student,key)=>(<Member key={key} student={student} setInfoMember={props.setInfoMember}/>))}
          { nextPage === 0 ? students.length >= 15 && (
            <Button block btn="muted" type="notline" name="Carregar Mais Alunos" onClick={()=>setNextPage(props.page+1)}/>
          ) : (
            <PageMembers status={props.status} page={nextPage} setInfoMember={props.setInfoMember}/>
          )}
        </>
      )} 
    </>)
}

type PropsMember = {
  student:IStudent,
  setInfoMember:React.Dispatch<React.SetStateAction<IStudent|null>>
}
export const Member  = (props:PropsMember) => {   
  return(
    <div 
      className={`flex justify-between items-center w-full p-2 cursor-pointer hover:bg-gray-900`}
      onClick={()=>props.setInfoMember(props.student)}
      >      
      <StudentProfilePhoto 
        student_id={props.student.id} 
        photo_id={props.student.photo} 
        autoUpdate={true} 
        class="w-10 h-10 my-1 mx-1 group-hover:hidden"/>
      <div className="flex flex-col justify-center flex-1 py-2 px-1">
        <p className="text-white font-light text-sm">{props.student.name}</p>
        <p className="text-white/50 font-light text-xs">{props.student.mail}</p>
      </div>
    </div>
  )
} 
