import { useState, useEffect,FormEvent } from 'react';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from '../../components/Buttons';
import { Card } from '../../components/Cards';
import { TitlePage } from '../../components/Template/TitlePage';
import api from '../../services/api';
import { User } from '../../contexts/Dtos/auth.dto';
import { Modal, TitleModal } from '../../components/Modal';
import { InputForm, SelectForm } from '../../components/Inputs';
import { CredentialType } from '../Dtos/credential.dto';

export const Users = () => {

  const [ newUser, setNewUser] = useState<number|boolean>(false)
  const [ editUser, setEditUser] = useState<number|boolean>(false)
  const [ update, setUpdate] = useState<boolean>(false)

  useEffect(()=>{
    update ? setUpdate(false) : false
  },[update])

  return (
    <div className="flex p-2 flex-col">
      
      {/*TITLE */}
      <TitlePage 
        icon="faUsers" 
        title="Usuários" 
        description="Gerencie os usuários administrativos"
        rightComponent={<Button btn="success" border='circle' icon="faUserPlus" name="Novo Usuário" onClick={()=>setNewUser(true)} /> }/>
      
      {/*BODY */}
      <div className="flex flex-col">        
        <Card component={<UserList setEditUser={setEditUser} update={update}/>}/>
        <Card component={<InactiveUsers setEditUser={setEditUser} update={update}/>}/>
      </div>
      { newUser ? (<Modal className="w-[80%] md:w-1/2 lg:w-1/3" component={<NewUser setUpdate={setUpdate} open={setNewUser}/>}/>) : false}   
      { editUser ? (<Modal className="w-[80%] md:w-1/2 lg:w-1/3" component={<EditUser userId={editUser} setUpdate={setUpdate} open={setEditUser}/>}/>) : false}  
     
    </div>
  )
}


const UserList : React.FC<{setEditUser: React.Dispatch<React.SetStateAction<number| boolean>>;update:boolean;}> = (props) => {
  const [users, setUsers] = useState<User[]>([])
  const getUsers = async () => {
    try{
      const users = await api.post('listUsers',{"status":1})
      setUsers(users.data.response)
    }catch(err){
      console.log(err)
    }
  }

  const [ credentials, setCredentials] = useState<CredentialType[]>([])
  const getCredentials = async () => {
    try{
      const crds = await api.get('listCredentials/1')
      setCredentials(crds.data.response)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    getUsers()
    getCredentials()
  },[props.update])

  const getNameCredential = (credentialId:number):string => {
    if(credentials){
      const credential = credentials.find((cred)=> cred.id === credentialId)        
      return credential ? credential.name : ' - ';
    }
    return '--';
  }
  return(
    <div className="h-[300px] overflow-auto flex-1 flex flex-col">
      <p className="text-slate-500 dark:text-slate-300 font-semibold">
        {users.length>0 ? (<>{users.length} Usuário(s) localizado(s)!</>) : (<>Nenhum usuário localizado</>) }
      </p>
      <table>
        <thead className="text-sm text-gray-500 ">
          <tr>
            <th className="py-2">Id</th>
            <th className="py-2">Nome</th>
            <th className="py-2">Email</th>
            <th className="py-2">Cargo</th>
            <th className="py-2">Logado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.length==0 ? (<tr><td colSpan={5} className="text-center p-5 text-slate-500">Nenhum usuário localizado</td></tr>) 
          : users.map((user,key)=>(
            <tr key={key} className="odd:bg-gray-200 odd:dark:bg-gray-900 dark:text-slate-100 text-center">
              <td className="p-2 font-bold">{user.id}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.mail}</td>
              <td className="p-2">{getNameCredential(user.credential)}</td>
              <td className="p-2">{user.logged == 1 ? 'Logado' : 'Deslogado'}</td>
              <td className="p-2 text-right">
                <Button icon="faUserEdit" size='sm' btn='info' type='notline' title="Editar Usuário"  name="Editar"
                         onClick={()=>props.setEditUser(user.id)}/>
              </td>
            </tr>
          )) }

        </tbody>
      </table>       
    </div>
  )
}


const InactiveUsers : React.FC<{setEditUser: React.Dispatch<React.SetStateAction<number| boolean>>;update:boolean;}> = (props) => {
  const [users, setUsers] = useState<User[]>([])
  const getUsers = async () => {
    try{
      const users = await api.post('listUsers',{"status":0})
      setUsers(users.data.response)
    }catch(err){
      console.log(err)
    }
  }
  const [ credentials, setCredentials] = useState<CredentialType[]>([])
  const getCredentials = async () => {
    try{
      const crds = await api.get('listCredentials/1')
      setCredentials(crds.data.response)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    getUsers()
    getCredentials()
  },[props.update])

  const getNameCredential = (credentialId:number):string => {
    if(credentials){
      const credential = credentials.find((cred)=> cred.id === credentialId)        
      return credential ? credential.name : ' - ';
    }
    return '--';
  }

  return(
    <div className="h-[300px] overflow-auto flex-1 flex flex-col">
      <p className="text-slate-500 dark:text-slate-300 font-semibold">
        {users.length>0 ? (<>{users.length} Usuário(s) Inativos localizado(s)!</>) : (<>Nenhum usuário inativo localizado</>) }
      </p>
      <table>
        <thead className="text-sm text-gray-500 ">
          <tr>
            <th className="py-2">Id</th>
            <th className="py-2">Nome</th>
            <th className="py-2">Email</th>
            <th className="py-2">Cargo</th>
            <th className="py-2">Logado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.length==0 ? (<tr><td colSpan={5} className="text-center p-5 text-slate-500">Nenhum usuário localizado</td></tr>) 
          : users.map((user,key)=>(
            <tr key={key} className="odd:bg-red-200 even:bg-red-300 odd:dark:bg-red-900 even:dark:bg-red-800 dark:text-slate-100 text-center">
              <td className="p-2 font-bold">{user.id}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.mail}</td>
              <td className="p-2">{getNameCredential(user.credential)}</td>
              <td className="p-2">{user.logged == 1 ? 'Logado' : 'Deslogado'}</td>
              <td className="p-2 text-right">
                <Button icon="faUserEdit" size='sm' btn='muted' type='notline' title="Editar Usuário"
                         onClick={()=>props.setEditUser(user.id)} name="Editar"/>
              </td>
            </tr>
          )) }

        </tbody>
      </table>
    </div>
  )
}


{/*MODAIS*/}

const NewUser : React.FC<{open: React.Dispatch<React.SetStateAction<number| boolean>>; setUpdate:React.Dispatch<React.SetStateAction<boolean>>;}> = (props) => {
  const [ name, setName ] = useState("")
  const [ mail, setMail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ credentialId, setCredentialId] = useState("")
  const [ credentials, setCredentials ] = useState<CredentialType|[]>([])
  const newUser = async (e:FormEvent) => {
    e.preventDefault();
    try{
      const data = {
        "name":name,
        "mail":mail,
        "credential":parseInt(credentialId),
        "password":password	
      }
      const response = await api.post(`newUser`, data)
      console.log(response.data)
      props.setUpdate(true)
    }catch(e){
      console.log(e)
    }
    props.open(false)
  }
  
  const getCredentials = async() => {
    try{
      const crd = await api.get('listCredentials/1')
      setCredentials(crd.data.response)
    }catch(e){
      console.log(e)
    }    
  }
  useEffect(()=>{
    getCredentials()
  },[])

  return(
    <div className="flex flex-col">
      <TitleModal icon='faUserPlus' title='Criar Usuário' subtitle='Preencha os dados e crie um novo Usuário' close={()=>props.open(false)}/>
      <form onSubmit={(e)=>newUser(e)}>
        <div className="py-4">
          <InputForm label="Nome do Usuário" placeholder='Insira o Nome do Usuário' required value={name} onChange={setName}/>
          <InputForm label="E mail do Usuário" placeholder='Username' required value={mail} onChange={setMail}/>
          <InputForm inputType='password' label="Senha de Acesso" placeholder='Insira o Nome do Usuário' required value={password} onChange={setPassword}/>
          <SelectForm label="Cargo" value={credentialId} empty="Selecione um cargo" options={credentials} required valueKey="id" lableKey="name" onChange={setCredentialId}/>          
        </div>     
        <div className="border-t dark:border-slate-600 flex justify-end items-center pt-3">
          <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.open(false)}/>
          <Button submit name="Criar Usuário" icon="faUserPlus" size="sm" btn="info"/>
        </div>  
      </form>     
    </div>
  )
}


const EditUser : React.FC<{userId:number| boolean; open: React.Dispatch<React.SetStateAction<number| boolean>>; setUpdate:React.Dispatch<React.SetStateAction<boolean>>;}> = (props) => {
  
  const [ name, setName ] = useState("")
  const [ mail, setMail ] = useState("")
  const [ credentialId, setCredentialId] = useState("")
  const [ userStatus, setUserStatus] = useState(0)
  const [ credentials, setCredentials ] = useState<CredentialType|[]>([])
  const editUser = async (e:FormEvent) => {
    e.preventDefault();
    try{
      const data = {
        "name":name,
        "mail":mail,
        "credential":parseInt(credentialId),
      }
      const response = await api.patch(`EditUser/${props.userId}`, data)
      console.log(response.data)
      props.setUpdate(true)
    }catch(e){
      console.log(e)
    }
    props.open(false)
  }

  const infoUser = async ()=>{
    try{
      const infoUser = await api.get(`getUser/${props.userId}`)      
      setName(infoUser.data.response.name)
      setMail(infoUser.data.response.mail)
      setCredentialId(infoUser.data.response.credential)
      setUserStatus(infoUser.data.response.status)
    }catch(e){
      console.log(e)
    }    
  }
  
  const getCredentials = async() => {
    try{
      const crd = await api.get('listCredentials/1')
      setCredentials(crd.data.response)
    }catch(e){
      console.log(e)
    }    
  }

  const [ resetPass, setResetPass ] = useState<number|boolean>(false)
  const [ changeStatus, setChangeStatus ] = useState<number|boolean>(false)

  useEffect(()=>{
    infoUser()
    getCredentials()    
  },[])
  
  return(
    <div className="flex flex-col">
      <TitleModal icon='faUserEdit' title='Editar Nível' subtitle='Verifique os dados antes de salvar as alterações!' close={()=>props.open(false)}/>
      <form onSubmit={(e)=>editUser(e)}>
        <div className="py-4">
          <InputForm label="Nome do Usuário" placeholder='Insira o Nome do Usuário' required value={name} onChange={setName}/>
          <InputForm label="E mail do Usuário" placeholder='Username' required value={mail} onChange={setMail}/>
          <SelectForm label="Cargo" value={credentialId} empty="Selecione um cargo" options={credentials} required valueKey="id" lableKey="name" onChange={setCredentialId}/>          
        </div>     
        <div className="border-t dark:border-slate-600 flex justify-end items-center pt-3">
          <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.open(false)}/>
          <Button name="Resetar Senha" size="sm" btn="warning"  icon="faSync" type="outline" onClick={()=>setResetPass(true)}/>
          { userStatus == 1 ? (
            <Button name="Desativar" size="sm" btn="error"  icon="faPowerOff" type="outline" onClick={()=>setChangeStatus(0)}/>           
          ) : (
            <Button name="Reativar" size="sm"  btn="info" icon="faPowerOff" type="outline" onClick={()=>setChangeStatus(1)}/>
          )}
    
          <Button submit name="Salvar Alterações" icon="faSave" size="sm" btn="success"/>
        </div>  
      </form>     
      { resetPass ? (<Modal className="w-[80%] md:w-1/2 lg:w-1/3" component={<ResetPass userId={props.userId} openParent={props.open} open={setResetPass} setUpdate={props.setUpdate} />}/>) : false}   
      { changeStatus !== false ? (<Modal className="w-[80%] md:w-1/2 lg:w-1/3" component={<ChangeStatus userId={props.userId} newStatus={changeStatus}  openParent={props.open} open={setChangeStatus} setUpdate={props.setUpdate}/>}/>) : false}   
      
      
    </div>
  )
}

const ResetPass : React.FC<{userId:number| boolean; openParent: React.Dispatch<React.SetStateAction<number| boolean>>; open: React.Dispatch<React.SetStateAction<number| boolean>>; setUpdate:React.Dispatch<React.SetStateAction<boolean>>;}> = (props) => {
  const resetPassword = async () => {
    try{
      const data = {
        "reset":1
      }
      const response = await api.patch(`EditUser/${props.userId}`, data)
      console.log(response.data)
      props.setUpdate(true)
    }catch(e){
      console.log(e)
    }
    props.openParent(false)
    props.open(false)
  }
  return(
    <div className="flex flex-col">
      <TitleModal icon='faSync' title='Reset de Senha' subtitle='Confirme o reset de senha do usuário' close={()=>props.open(false)}/>
      <div className="p-4">
        <p className="text-xl dark:text-slate-300">Confirmar reset de senha do usuário?</p>
      </div>
      <div className="border-t dark:border-slate-600 flex justify-end items-center pt-3">
        <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.open(false)}/>
        <Button name="Sim, Resetar" size="sm" btn="warning"  icon="faSync" onClick={()=>resetPassword()}/>
      </div>  
    </div>
  )
}
const ChangeStatus : React.FC<{userId:number| boolean; newStatus:number|boolean; openParent: React.Dispatch<React.SetStateAction<number| boolean>>; open: React.Dispatch<React.SetStateAction<number| boolean>>; setUpdate:React.Dispatch<React.SetStateAction<boolean>>;}> = (props) => {
  const changeStatusUser = async () => {
    try{
      const data = {
        "status":props.newStatus == 1 ? 1 : 0
      }
      const response = await api.patch(`EditUser/${props.userId}`, data)
      console.log(response.data)
      props.setUpdate(true)
    }catch(e){
      console.log(e)
    }
    props.openParent(false)
    props.open(false)
  }
  return(
    <div className="flex flex-col">
      <TitleModal icon='faPowerOff' title='Reativar/Inativar usuário' subtitle='Desabilite/Habilite o acesso do usuário!' close={()=>props.open(false)}/>
      <div className="p-4">
        <p className="text-xl dark:text-slate-300">
          {props.newStatus == 1 ? (<>Confirmar <b className="text-green-700">Reativação</b> do acesso do usuário?</>
          ) : (<>Confirmar <b className="text-red-700">Inativação</b> do acesso do usuário?</>)}
          
        </p>
      </div>
      <div className="border-t dark:border-slate-600 flex justify-end items-center pt-3">
        <Button name="Cancelar"  size="sm" btn="muted" type="notline" onClick={()=>props.open(false)}/>
        {props.newStatus == 1 ? (
        <Button name="Sim, Reativar" size="sm" btn="info"  icon="faPowerOff"  onClick={()=>changeStatusUser()}/>
        ) : (<Button name="Sim, Inativar" size="sm" btn="error"  icon="faPowerOff"  onClick={()=>changeStatusUser()}/>)}
      </div>  
    </div>
   
  )
}