
import React, { FormEvent, useEffect, useState } from "react"
import { Button } from "../../../../components/Buttons"
import { Card } from "../../../../components/Cards"
import { TitlePage } from "../../../../components/Template/TitlePage"
import { IMail } from "../Dtos/mail.dto"
import api from "../../../../services/api"
import { LoadingBars } from "../../../../components/Loading"


import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, TitleModal } from "../../../../components/Modal"
import { InputForm, InputNumberForm, TextAreaForm } from "../../../../components/Inputs"

export const Emails = () => {
  const [newAccount, setNewAccount ] = useState(false)
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faEnvelopesBulk" 
        title="E-mails" 
        description="Configure as contas de e-mail que serão utilizadas pela plataforma!"
        rightComponent={<Button icon="faPlus" name="Nova Conta de Email" btn="success" onClick={()=>setNewAccount(true)}/>}/>

      <Card component={<MailAccounts newAccount={newAccount} setNewAccount={setNewAccount} />}/>
      { newAccount && <NewAccount close={setNewAccount}/>}

    </div>
  )
}

type MailAccountComponent = {
  newAccount:boolean,
  setNewAccount:React.Dispatch<React.SetStateAction<boolean>>
}
const MailAccounts: React.FC<MailAccountComponent> = (props) => { 
  const [ accounts, setAccounts ] = useState<IMail[]|null>(null)
  const [ editAccount, setEditAccount ] = useState<IMail|null>(null)
  const getAccountsMail = async () => {
    try{
      const list = await api.get('listAccounts')
      console.log(list.data.response)
      setAccounts(list.data.response)
    }catch(e){console.log(e)}
  }
  useEffect(()=>{getAccountsMail()},[props.newAccount,editAccount])
  return(
    <div className="flex flex-col w-full">
      { accounts === null ? <LoadingBars/> 
      : accounts.length == 0 
      ? 
        <div className="flex flex-col py-8 justify-center items-center">
          <FontAwesomeIcon className="text-teal-500/50 text-6xl my-2" icon={Fas.faEnvelope}/>
          <p className="text-white text-lg font-light">Nenhuma conta de e-mail encontrada!</p>
          <Button btn="success" type="notline" icon="faPlus" name="Criar Nova Conta" onClick={()=>props.setNewAccount(true)}/>
        </div>
      : <div className="flex flex-wrap">
          {accounts.map((account,key)=><Account key={key} account={account} setEditAccount={setEditAccount}/>)}
        </div>
      }
      {editAccount && <EditAccount account={editAccount} close={setEditAccount}/>}
    </div>)
}

type AccountComponent = {
  account:IMail,
  setEditAccount:React.Dispatch<React.SetStateAction<IMail|null>>
}
const Account : React.FC<AccountComponent> = (props) => {
  return(
    <div className="flex flex-col justify-between items-center w-[24%] p-4 h-[270px] m-1 rounded relative
                    border bg-gray-800/50 hover:bg-gray-800 text-white border-teal-500">
      <FontAwesomeIcon icon={Fas.faEnvelope} className="text-teal-500/50 text-6xl my-4"/>      
      <p className="text-sm">{props.account.name}</p>
      <p className="text-xs font-light">{props.account.user}</p>
      <Button btn="success" type="notline" icon="faWrench" name="Configurar" onClick={()=>props.setEditAccount(props.account)}/>
    </div>
  )
}

type NewAccountComponent = {
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const NewAccount : React.FC<NewAccountComponent>= (props) => {
  const [ name, setName ] = useState("")
  const [ host, setHost ] = useState("")
  const [ port, setPort ] = useState(465)
  //const [ secure, setSecure ] = useState(true)
  const [ user, setUser ] = useState("")
  const [ pass, setPass ] = useState("")
  const createAccount = async (e:FormEvent) => {
    e.preventDefault()
    const data = {
      name:name,
      host:host,
      port:port,
      secure:1,
      user:user,
      pass:pass
    }
    try{
      const r = await api.post('newAccount',data)
      console.log(r.data)
    }catch(Err){
      console.log(Err)
    }
    props.close(false)
  }
  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal icon="faEnvelope" title="Nova Conta de E-mail" close={()=>props.close(false)}/>
        <form className="flex flex-col" onSubmit={(e)=>createAccount(e)}>
          <InputForm label="Conta" required value={name} onChange={setName}/>
          <div className="flex">
            <div className="flex-1 mr-1">
              <InputForm label="Host(SMTP)" required value={host} onChange={setHost}/>
            </div>
            <div className="ml-1">
              <InputNumberForm label="Porta" required value={port} onChange={setPort}/>
            </div>
          </div>          
          <InputForm label="E-mail" required value={user} onChange={setUser}/>
          <InputForm label="Senha" required inputType="password" value={pass} onChange={setPass}/>
          <div className="flex justify-end border-t border-t-neutral-600">
            <Button btn="muted" type="notline" name="Cancelar" onClick={()=>props.close(false)}/>
            <Button btn="success" icon="faEnvelope" name="Criar Conta" submit />
          </div>
        </form>
      </div>}/>
  )
}

type EditAccountComponent = {
  account:IMail,
  close:React.Dispatch<React.SetStateAction<IMail|null>>
}
const EditAccount : React.FC<EditAccountComponent> = (props) => {
  const [ deleteAccount, setDeleteAccount ] = useState<number|null>(null)
  const [ sendTest, setSendTest ] = useState<IMail|null>(null)

  const [ name, setName ] = useState(props.account.name)
  const [ host, setHost ] = useState(props.account.host)
  const [ port, setPort ] = useState(props.account.port)
  //const [ secure, setSecure ] = useState(true)
  const [ user, setUser ] = useState(props.account.user)
  const [ pass, setPass ] = useState(props.account.pass)
  const updateAccount = async (e:FormEvent) => {
    e.preventDefault()
    const data = {
      name:name,
      host:host,
      port:port,
      secure:1,
      user:user,
      pass:pass
    }
    try{
      const r = await api.patch(`editAccount/${props.account.id}`,data)
      console.log(r.data)
    }catch(Err){
      console.log(Err)
    }
    props.close(null)
  }

  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal icon="faEnvelope" title="Conta de E-mail" close={()=>props.close(null)}/>
        <form className="flex flex-col" onSubmit={(e)=>updateAccount(e)}>
          <InputForm label="Conta" required value={name} onChange={setName}/>
          <div className="flex">
            <div className="flex-1 mr-1">
              <InputForm label="Host (SMTP)" required value={host} onChange={setHost}/>
            </div>
            <div className="ml-1">
              <InputNumberForm label="Porta" required value={port} onChange={setPort}/>
            </div>
          </div>          
          <InputForm label="E-mail" required value={user} onChange={setUser}/>
          <InputForm label="Senha" required inputType="password" value={pass} onChange={setPass}/>
          <div className="flex justify-end border-t border-t-neutral-600">
            <Button btn="muted" type="notline" name="Fechar" onClick={()=>props.close(null)}/>
            <Button btn="error" type="notline" icon="faTrash" name="Remover" onClick={()=>setDeleteAccount(props.account.id)}/>
            <Button btn="info" icon="faPaperPlane" type="outline" name="Enviar Teste" onClick={()=>setSendTest(props.account)}/>
            <Button btn="success" icon="faEnvelope" name="Salvar Alterações" submit />
          </div>
        </form>
        { sendTest && 
          <SendTestMail account={sendTest} close={setSendTest}/> }
        { deleteAccount && 
          <RemoveAccount 
            nameAccount={props.account.name} 
            accountId={deleteAccount} 
            close={setDeleteAccount}
            closeEdit={props.close}/> }
      </div>}/>)
}

type SendTestMailComponent = {
  account:IMail,
  close:React.Dispatch<React.SetStateAction<IMail|null>>
}
const SendTestMail : React.FC<SendTestMailComponent> = (props) => {  
  const [ from, setFrom ] = useState("Teste")
  const [ mailTo, setMailTo ] = useState("")
  const [ subject, setSubject ] = useState("Teste de Disparo")
  const [ body, setBody ] = useState("Esta é uma mensagem de teste")
  const [ message, setMessage ] = useState("")
  const [ success, setSuccess ] = useState<boolean|null>(null)
  const sendTest = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        accountId:props.account.id,
        from:from,
        mailTo:mailTo,
        subject:subject,
        body:body
      }
      const r = await api.post('sendMail/',data)
      setSuccess(r.data.success)
      setMessage(r.data.message)
      console.log(r.data)
    }catch(Err){
      console.log(Err)
    }
    setTimeout(()=>{props.close(null)},5000)
    
  }
  return(
    <Modal className="w-full" component={
      <form className="flex flex-col" onSubmit={(e)=>sendTest(e)}>
        <TitleModal icon="faPaperPlane" title="Enviar Teste" close={()=>props.close(null)}/>
        <div className="flex flex-col px-4">
          <InputForm label="Remetente" required value={from} onChange={setFrom}/>
          <InputForm inputType="email" required label="Destino" value={mailTo} onChange={setMailTo}/>
          <InputForm label="Assunto" required value={subject} onChange={setSubject}/>
          <TextAreaForm label="Conteúdo" required value={body} onChange={setBody}/>
        </div>
       
        <div className="flex items-center justify-end border-t border-t-neutral-600">
        { success === true 
          ? <p className="text-teal-500 text-sm w-full text-center">{message}</p>
          : success === false && <p className="text-red-500 text-sm w-full text-center">{message}</p> }
          <Button btn="muted" type="notline" name="Fechar" onClick={()=>props.close(null)}/>
          <Button btn="info" icon="faPaperPlane" name="Disparar" submit/>
        </div>
       
    </form>}/>)

}

type RemoveAccountComponent = {
  accountId:number,
  nameAccount:string,
  closeEdit:React.Dispatch<React.SetStateAction<IMail|null>>,
  close:React.Dispatch<React.SetStateAction<number|null>>
}
const RemoveAccount : React.FC<RemoveAccountComponent> = (props) => {  
  const removeAccount = async () => {
    try{
      const r = await api.delete(`removeAccount/${props.accountId}`)
      console.log(r.data)
    }catch(Err){
      console.log(Err)
    }
    props.closeEdit(null)
    props.close(null)
  }
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon="faTrash" title="Remover Conta de E-mail" close={()=>props.close(null)}/>
        <div className="flex flex-col px-4">
          <p className="text-white font-light my-8">
            Confirmar remoção da conta de email <strong className="text-red-500">{props.nameAccount}</strong>
          </p>
        </div>
        <div className="flex justify-end border-t border-t-neutral-600">
          <Button btn="muted" type="notline" name="Fechar" onClick={()=>props.close(null)}/>
          <Button btn="error" icon="faTrash" name="Sim,Remover" onClick={()=>removeAccount()}/>
        </div>
    </div>}/>)

}

