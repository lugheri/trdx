import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Card } from "../../../components/Cards"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { InputForm, SelectForm } from '../../../components/Inputs';
import { TitlePage } from '../../../components/Template/TitlePage';
import useAuth from '../../../hooks/useAuth';
import { Student } from '../../../contexts/Dtos/auth.dto';
import api from '../../../services/api';
import { urlBase } from '../../../utils/baseUrl';

export const Profile = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null  
  const [ photo, setPhoto ] = useState<number>(0)
  return(
    <div className="flex flex-col">
      <TitlePage         
        title="Minha Conta" 
        description="Gerencie os seus dados e algumas configurações de sua plataforma"/>
      <div className="flex">
        <Card className="w-full" component={
          <div className="flex flex-col md:flex-row w-full">
            <EditPhotoProfile student_name={userData ? userData.name : ""} student_id={userData ? userData.id : 0} photo={photo}/>
            <EditInfoStudent student_id={userData ? userData.id : 0} setPhoto={setPhoto}/>     
            <ChangePassword student_id={userData ? userData.id : 0} student_mail={userData ? userData.mail : ""}/>
          </div>}/>       
      </div>     
    </div>
  )
}

//EDIT PROFILE
const EditPhotoProfile : React.FC<{student_name:string,student_id:number,photo:number}> = (props) => {
  const [ previewImage, setPreviewImage] = useState<string | null>(null);
  const [ selectedFile, setSelectedFile ] = useState<File|null>(null); 
  const targetInputFileRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    targetInputFileRef.current && targetInputFileRef.current.click(); 
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if(file){ 
      setSelectedFile(file)
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  }
  const uploadNewImage = async () => {
    const data={
      name_student:props.student_name,
      student_id:props.student_id,
      file:selectedFile
    }
    try{      
      await api.post('newPhotoProfile',data, { headers: { 'Content-Type': 'multipart/form-data',}})  
      setSelectedFile(null)   
    }catch(e){ console.log(e) }
  }

  return(
    <div className="p-10 flex flex-col items-center w-full md:w-1/4">
      <div className="bg-white w-[180px] h-[180px] overflow-hidden rounded-full mb-8 flex justify-center items-center">
        { previewImage ? 
          <img src={previewImage} alt="Preview da imagem" style={{ maxWidth: '180px' }} />
        : props.photo === 0 ? <FontAwesomeIcon className="opacity-50 text-4xl" icon={Fas.faUser}/>
        : <PhotoProfile photo_id={props.photo}/>}
      </div>
      <input type="file" ref={targetInputFileRef} accept="image/*" className={`hidden`} onChange={handleFileChange}/>
      { selectedFile ? 
        <div className="flex flex-col">
          <button onClick={()=>uploadNewImage()}
                  className="bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow p-2 text-center my-2 rounded shadow text-sm font-semibold">
            <FontAwesomeIcon className="opacity-50" icon={Fas.faSave}/> Salvar Imagem
          </button>
          <button onClick={handleClick} className="text-[#3CF400] p-2 text-center my-2  text-sm" >
            <FontAwesomeIcon className="opacity-50" icon={Fas.faRefresh}/> Trocar Imagem
          </button>
        </div>
      : <button onClick={handleClick}
                className="bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow p-2 text-center my-2 rounded shadown text-sm font-semibold">
          <FontAwesomeIcon className="opacity-50" icon={Fas.faUpload}/> Alterar Imagem
        </button>}
    </div>
  )
}
const PhotoProfile : React.FC <{photo_id:number}> = ({photo_id}) => {
  const [ urlPhoto, setUrlPhoto ] = useState<string|null>(null)
  useEffect(()=>{
    const getPhoto = async () => {
      try{  
        const photo = await api.get(`photoProfile/${photo_id}`)
        setUrlPhoto(`${photo.data.response.file}`)
      }catch(e){console.log(e)}
    }
    getPhoto()    
  },[])
  return(
    urlPhoto === null ? <FontAwesomeIcon icon={Fas.faCircleNotch} pulse/>
    : <img src={`${urlBase}/gallery/${urlPhoto}`} alt="Foto do Aluno" style={{ maxWidth: '180px' }} />
  )
}

const EditInfoStudent : React.FC<{student_id:number,setPhoto:React.Dispatch<React.SetStateAction<number>>}> = (props) => {
  const [ name, setName ] = useState<string>('')
  const [ mail, setMail ] = useState<string>('')
  const [ phone, setPhone ] = useState<string>('')
  const [ gender, setGender ] = useState<string>('')
  const options =[{'id':'M','sexo':'Masculino'},{'id':'F','sexo':'Feminino'}]

  useEffect(()=>{
    const infoStudents = async () => {
      try{
        const info = (await api.get(`getInfoStudent/${props.student_id}`)).data.response
        props.setPhoto(info.photo)
        setName(info.name)
        setMail(info.mail)
        setPhone(info.phone)
        setGender(info.gender)
      }catch(e){
        console.log(e)
      }
    }
    infoStudents()
  },[])

  const [ saved, setSaved ] = useState(false)
  const editStudent = async (e:FormEvent) => {
    e.preventDefault();    
    try{
      const data = {
        "name":name,
        "phone":phone,
        "gender":gender	
      }
      const response = await api.patch(`EditStudent/${props.student_id}`, data)
      response.data.success && setSaved(true) 
      setTimeout(()=>{setSaved(false)},5000)      
    }catch(e){
      console.log(e)
    }   
  }

  return(
    <form className="p-4 flex-1" onSubmit={(e)=>editStudent(e)}>
      <p className="font-bold mb-4 text-white text-xl">Dados gerais</p>
      <InputForm value={name} label="Nome" className='border-0 mb-[10px] w-full md:w-[400px] text-sm' placeholder="Nome do Aluno" onChange={setName} required/>
      <label className="font-semibold text-sm text-white py-1">Email</label>
      <div className="shadow rounded-md p-2 bg-neutral-400 text-neutral-600 border-slate-700 border-0 mb-[10px] cursor-not-allowed w-full md:w-[400px] text-sm">{mail}</div>
      <InputForm value={phone} label="Whatsapp" className='border-0 mb-[10px] w-full md:w-[400px] text-sm text-sm' placeholder="Nome do Aluno" onChange={setPhone} required/>
      <SelectForm value={gender} label="Sexo" empty="Selecione um item" className='border-0 mb-[9px] w-full md:w-[400px] text-sm' valueKey="id" lableKey="sexo" options={options} onChange={setGender} required/>
      <button type="submit" className="bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow p-2 text-center my-2 rounded shadown text-sm font-semibold">
        <FontAwesomeIcon className="opacity-50" icon={Fas.faSave}/>  Salvar Dados
      </button>
      {saved && <p className="text-teal-500 text-xs m-2"><FontAwesomeIcon className="opacity-50" icon={Fas.faSave}/> Dados salvos com sucesso!</p>}
    </form>
  )
}

const ChangePassword: React.FC<{student_id:number,student_mail:string}> = (props) =>{
  const [ changePass, setChangePass ] = useState(false)

  const [ password, setPassword ] = useState("")
  const [ newPassword, setNewPassword ] = useState("")
  const [ confirmNewPass, setConfirmNewPass ] = useState("")

  const [ resetPass, setResetPass ] = useState(false)
  const [ resetError, setResetError ] = useState("")
  
  const editPass = async (e:FormEvent) => {
    e.preventDefault();    
    if(newPassword!==confirmNewPass){
      setResetPass(true)
      setResetError("As senhas informadas não conferem!")
    }else{
      try{
        const data = {
          "username":props.student_mail,
          "password":password,
          "newPass":newPassword	
        }
        const response = await api.patch(`ResetPass/${props.student_id}`, data)
        if(response.data.success){
          setResetPass(true) 
          setResetError("")
          setTimeout(()=>{
            setResetPass(false),
            setChangePass(false)
            setPassword("")
            setNewPassword("")
            setConfirmNewPass("")
          },5000)      
        }else{
          setResetPass(true) 
          setResetError(response.data.error)
        }
        
      }catch(e){
        console.log(e)
      }   
    }
  }

  return(
    <div className="px-2 flex justify-end items-start w-full md:w-1/3 overflow-hidden">
      { changePass === false ? <button className="bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow p-2 text-center my-2 rounded shadown text-sm font-semibold" onClick={()=>setChangePass(true)}>
          <FontAwesomeIcon className="opacity-50" icon={Fas.faRefresh}/>  Alterar Senha 
        </button>
      : 
        <div className="flex flex-col w-full justify-center items-start pl-8">
          <p className="font-bold mb-4 text-white text-xl mt-4">Alterar Senha</p>
          <form className="w-full" onSubmit={(e)=>editPass(e)}>
            <InputForm value={password} label="Senha Atual" className='border-0 mb-[10px] text-sm' placeholder="Informe sua senha atual" onChange={setPassword} required/>
            <InputForm value={newPassword} label="Nova Senha" className='border-0 mb-[10px] text-sm' placeholder="Escolha uma nova senha" onChange={setNewPassword} required/>
            <InputForm value={confirmNewPass} label="Confirmar Nova Senha" className='border-0 mb-[10px] text-sm' placeholder="Confirme sua nova senha" onChange={setConfirmNewPass} required/>
            <div className="flex w-full justify-end">
              <button className="text-neutral-500 mr-4 p-2 text-center my-2 rounded shadown text-sm font-semibold" onClick={()=>setChangePass(false)}>
                Cancelar
              </button>
              <button type="submit" className="bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow p-2 text-center my-2 rounded shadown text-sm font-semibold">
                <FontAwesomeIcon className="opacity-50" icon={Fas.faSave}/>  Salvar Nova Senha
              </button>
            </div>
          </form>
          {resetPass === true ? resetError ? <p className="mt-6 text-red-500 w-full text-center">{resetError}</p> : <p className="mt-6 text-teal-500 w-full text-center">Senha resetada com sucesso! </p> : false}
        </div>}              
    </div>     
  )
}