import { FormEvent, useState } from "react"
import { Button } from "../../../../../components/Buttons"
import { Card } from "../../../../../components/Cards"
import { StudentProfilePhoto } from "../../../../../components/StudentProfilePhoto"
import { IStudent } from "../../Dtos/student.dto"
import { Modal, TitleModal } from "../../../../../components/Modal"
import { LoadingBars } from "../../../../../components/Loading"
import api from "../../../../../services/api"
import { InputForm } from "../../../../../components/Inputs"

type CourseStudentComponent = {
  infoStudent:IStudent,
  setUpdateStudent:React.Dispatch<React.SetStateAction<number>>
}
export const SideStudent: React.FC<CourseStudentComponent> = (props) => {
  /*Modal Triggers*/
  const [editStudentInfo, setEditStudentInfo] = useState<number|null>(null)
  const [sendAccess, setSendAccess] = useState<number|null>(null)
  const [editcommunityAccess, setEditcommunityAccess] = useState<number|null>(null)
  const [editStatusAccess, setEditStatusAccess] = useState<number|null>(null)
  return(
    <div className="flex flex-col w-1/4">
      <Card className="h-full overflow-auto" component={
        <div className="flex flex-col w-full justify-between items-center">
          <div className="w-full flex flex-col justify-center items-center py-8 border-b border-b-neutral-800">
            <StudentProfilePhoto  class="w-[125px] h-[125px] mt-2"
              autoUpdate={false} 
              student_id={props.infoStudent.id} 
              photo_id={props.infoStudent.photo}/>
            <p className="mt-2 text-xs font-bold text-neutral-500">Código: {props.infoStudent.id}</p> 
            <p className="text-white font-bold">{props.infoStudent.name}</p>
            <p className="mb-2 text-xs text-neutral-300">{props.infoStudent.mail}</p>             
          </div>
          <div className="w-full flex-1 flex flex-col justify-start items-center py-8 ">             
            <Button name="Alterar Dados" icon="faUserEdit" btn="info" type="outline" size="sm" block onClick={()=>setEditStudentInfo(props.infoStudent.id)}/>
            <Button name="Resetar Acesso" icon="faKey" btn="info" type="outline" size="sm" block onClick={()=>setSendAccess(props.infoStudent.id)}/>
            
            { props.infoStudent.community === 0 
              ? <Button name="Inserir na Comunidade" icon="faUsers" btn="success" type="outline" size="sm" block onClick={()=>setEditcommunityAccess(props.infoStudent.id)}/>
              : <Button name="Remover da Comunidade" icon="faUsersSlash" btn="error" type="outline" size="sm" block onClick={()=>setEditcommunityAccess(props.infoStudent.id)}/>}
            
            { props.infoStudent.status === 0 
              ? <Button name="Reativar Acesso" icon="faUserCheck" btn="success" type="outline" size="sm" block onClick={()=>setEditStatusAccess(props.infoStudent.id)}/>
              : <Button name="Inativar Acesso" icon="faUserSlash" btn="error" type="outline" size="sm" block onClick={()=>setEditStatusAccess(props.infoStudent.id)}/>}
          </div>
          <div className="w-full bg-slate-500 rounded flex flex-col justify-center items-center py-8">
            <div>Avaliacao</div>
          </div>
        </div>
      }/>  

      { editStudentInfo && <EditStudentInfo infoStudent={props.infoStudent} close={setEditStudentInfo} setUpdateStudent={props.setUpdateStudent}/>}

      { sendAccess && <SendAccess infoStudent={props.infoStudent} close={setSendAccess} setUpdateStudent={props.setUpdateStudent}/>} 
      
      { editcommunityAccess && <EditCommunityAccess infoStudent={props.infoStudent} close={setEditcommunityAccess}  setUpdateStudent={props.setUpdateStudent}/>}

      { editStatusAccess && <EditStatusAccess infoStudent={props.infoStudent} close={setEditStatusAccess} setUpdateStudent={props.setUpdateStudent}/>}
          
    </div>
  )
}

type EditStudentInfoComponent={
  infoStudent:IStudent,
  close:React.Dispatch<React.SetStateAction<number|null>>,
  setUpdateStudent:React.Dispatch<React.SetStateAction<number>>
}
const EditStudentInfo : React.FC<EditStudentInfoComponent> = (props) => {
  const [studentName, setStudentName] = useState(props.infoStudent.name)
  const [studentMail, setStudentMail] = useState(props.infoStudent.mail)

  const updateInfoStudent = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = { name:studentName,mail:studentMail}
      const resp = await api.patch(`EditStudent/${props.infoStudent.id}`,data)
      props.setUpdateStudent(props.infoStudent.id)
      console.log(resp.data)
      props.close(null)
    }catch(err){
      console.log(err)
    }
  }
  return(
    <Modal component={
      <div className="flex flex-col p-2">
        <TitleModal icon='faUserEdit' close={()=>props.close(null)} 
          title='Visualizar/Editar informações do Aluno'
          subtitle={`Edite ou apenas visualize as informações do aluno ${props.infoStudent.name}`}/>
        <form onSubmit={(e)=>updateInfoStudent(e)}>
          <div className="py-4">
            <InputForm label="Nome do Aluno" placeholder='Insira o Nome do Usuário' required value={studentName} onChange={setStudentName}/>
            <InputForm inputType="email" label="E mail do Aluno" placeholder='Email' required value={studentMail} onChange={setStudentMail}/>
          </div>
          <div className="border-t border-slate-600 flex justify-end items-center pt-3">
            <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.close(null)}/>
            <Button submit name="Salvar Alterações" icon="faUserPlus" btn="success"/>
          </div>
        </form>   
      </div>}/>
  )
}



type SendAccessComponent={
  infoStudent:IStudent,
  close:React.Dispatch<React.SetStateAction<number|null>>,
  setUpdateStudent:React.Dispatch<React.SetStateAction<number>>
}
const SendAccess : React.FC<SendAccessComponent> = (props) => {
  //Reset
  const [ resetPass, setResetPass ] = useState(false)
  const [ newPass, setNewPass ] = useState<string|null>(null)
  const initResetPass = async () => {
    setResetPass(true)
    try{
      const reset = await api.get(`resetPass/${props.infoStudent.id}`)
      setNewPass(reset.data.response)
    }catch(err){
      console.log(err)
    }
  }
  return(
    <Modal component={<div>
      <TitleModal icon='faPaperPlane' close={()=>props.close(null)} 
                  title='Resetar Senha de acesso'
                  subtitle={`Resete os dados de acesso do aluno ${props.infoStudent.name}`}/>
        <div className="flex flex-col">
        { resetPass 
          ? newPass === null 
            ? <LoadingBars/> 
            :<div className="flex flex-col justify-center items-center">
              <p className="text-slate-300 my-4">Nova senha resetada com sucesso!</p>
              <div className="flex flex-col justify-start">
                <p className="text-slate-200 font-light mt-2">Link: <span className="text-teal-300">https://app.otraderquemultiplica.com.br</span></p>
                <p className="text-slate-200 font-light">Usuário: <span className="text-teal-300">{props.infoStudent.mail}</span></p>
                <p className="text-slate-200 font-light mb-2">Senha: <span className="text-teal-300 font-bold">{newPass}</span></p>
              </div>
              <div className="flex justify-end mt-2 pt-1 border-t w-full border-slate-600">
                <Button name="Concluir" btn="success" onClick={()=>props.close(null)}/>
              </div>
            </div>
          :
          <>
            <p className="text-slate-300 my-4">Confirmar Reset de Senha do Aluno?</p>
            <div className="flex justify-end mt-2 pt-1 border-t border-slate-600">
              <Button name="Cancelar" btn="muted" onClick={()=>props.close(null)}/>
              <Button name="Sim, Resetar" btn="warning" icon="faKey" onClick={()=>initResetPass()}/>
            </div>
          </>}
        </div>
      </div>}/>
  )
}



type EditCommunityAccessComponent={
  infoStudent:IStudent,
  close:React.Dispatch<React.SetStateAction<number|null>>,
  setUpdateStudent:React.Dispatch<React.SetStateAction<number>>
}
const EditCommunityAccess : React.FC<EditCommunityAccessComponent> = (props) => {
  const updateCommunityAccessStudent = async () => {
    try{
      const data = { community:props.infoStudent.community == 0 ? 1 : 0}
      const resp = await api.patch(`EditStudent/${props.infoStudent.id}`,data)
      props.setUpdateStudent(props.infoStudent.id)
      console.log(resp.data)
      props.close(null)
    }catch(err){
      console.log(err)
    }
  }
  return(
    <Modal component={
      <div className="flex flex-col p-2">
        <TitleModal 
          icon={`${props.infoStudent.community == 0 ? 'faUsers' : 'faUsersSlash'}`} close={()=>props.close(null)} 
          title={`${props.infoStudent.community == 0 ? 'Inserir' : 'Remover'} Acesso à Comunidade`}
          subtitle={`${props.infoStudent.community == 0 ? 'Insira' : 'Remova'} o acesso do aluno ${props.infoStudent.name} a comunidade`}/>
        <p className="text-white font-xl mt-8 mx-4 mb-4">
            Confirme se deseja {props.infoStudent.community == 0 
            ? <b className="text-teal-500">Inserir</b>
            : <b className="text-red-500">Remover</b>} o acesso à Comunidade para o aluno <br/> <b className="text-xl my-2">{props.infoStudent.name}</b>
        </p>
        <div className="flex border-t mt-4 p-2 justify-end items-center">
          <Button name="Cancelar" btn="muted"  type='outline' onClick={()=>props.close(null)} />
          {props.infoStudent.community == 1 
           ? 
            <Button name="Sim, Remover" icon="faUsersSlash" btn="error" onClick={()=>updateCommunityAccessStudent()} />
           :
            <Button name="Sim, Inserir" icon="faUsers" btn="success" onClick={()=>updateCommunityAccessStudent()} />} 
        </div> 

      </div>}/>
  )
}



type EditStatusAccessComponent={
  infoStudent:IStudent,
  close:React.Dispatch<React.SetStateAction<number|null>>,
  setUpdateStudent:React.Dispatch<React.SetStateAction<number>>
}
const EditStatusAccess : React.FC<EditStatusAccessComponent> = (props) => {
  const updateStatusStudent = async () => {
    try{
      const data = { status:props.infoStudent.status == 0 ? 1 : 0}
      const resp = await api.patch(`EditStudent/${props.infoStudent.id}`,data)
      props.setUpdateStudent(props.infoStudent.id)
      console.log(resp.data)
      props.close(null)
    }catch(err){
      console.log(err)
    }
  }
  return(
    <Modal component={
      <div className="flex flex-col p-2">
        <TitleModal
          icon={`${props.infoStudent.status == 0 ? 'faUserCheck' : 'faUserSlash'}`} close={()=>props.close(null)} 
          title={`${props.infoStudent.status == 0 ? 'Reativar' : 'Inativar'} Acesso`}
          subtitle={`${props.infoStudent.status == 0 ? 'Reative' : 'Inative'} o acesso do aluno ${props.infoStudent.name}`}/>
        
          <p className="text-white font-xl mt-8 mx-4 mb-4">
            Confirmar a {props.infoStudent.status == 0 
            ? <b className="text-teal-500">Reativação</b>
            : <b className="text-red-500">Inativação</b>} do acesso para aluno <br/> <b className="text-xl my-2">{props.infoStudent.name}</b>
        </p>
        <div className="flex border-t mt-4 p-2 justify-end items-center">
          <Button name="Cancelar" btn="muted"  type='outline' onClick={()=>props.close(null)} />
          {props.infoStudent.status == 1 
           ? 
            <Button name="Sim, Inativar" icon="faUserSlash" btn="error" onClick={()=>updateStatusStudent()} />
           :
            <Button name="Sim, Reativar" icon="faUserCheck" btn="success" onClick={()=>updateStatusStudent()} />} 
        </div> 

      </div>}/>
  )
}


