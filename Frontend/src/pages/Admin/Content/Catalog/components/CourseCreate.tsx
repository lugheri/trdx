import React, { useState, useEffect, FormEvent } from 'react';
import { urlBase } from '../../../../../utils/baseUrl';

import { IFileGallery } from '../../../../Students/Dtos/gallery.dto';

import { Button } from "../../../../../components/Buttons"
import { Card } from '../../../../../components/Cards';
import api from '../../../../../services/api';
import { Loading } from '../../../../../components/Loading';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { InputForm, SelectForm, TextAreaForm } from '../../../../../components/Inputs';
import { PageGallery } from './PageGallery';

type NewCourseComponent = {
  setNewCourse: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenCourse: React.Dispatch<React.SetStateAction<null|number>>
}
export const CourseCreate : React.FC<NewCourseComponent> = (props) => {
  const [ fase, setFase ] = useState(1)
  const [ nome, setNome] = useState("")
  const [ warningNome, setWarningNome] = useState(false)
  const [ descricao, setDescricao] = useState("")
  const [ autor, setAutor] = useState("")
  const [ comunidade, setComunidade] = useState('0')
  const [ tags, setTags] = useState("")
  const [ capaCurso, setCapaCurso ] = useState(0)
  const [ infoImage, setInfoImage ]= useState<IFileGallery|null>(null)

  const getInfoImage = async () => {
    try{
      if(capaCurso){
        const info = await api.get(`infoFile/${capaCurso}`)
        setInfoImage(info.data.response)
      }else{
        setInfoImage(null)
      }
    }catch(e){console.log(e)}
  }
  useEffect(()=>{capaCurso > 0 ? getInfoImage() : false},[capaCurso])

  const nextFase = () => {
    fase == 1 ? 
      nome !== "" ? setFase(2) :  setWarningNome(true)
    : fase == 2 ? setFase(3)
    : fase == 3 ? 
      capaCurso > 0 ? setFase(4) : false
    : false
  }
  const previousFase = () => {
    const pf = fase-1
    setFase(pf)
  }
  const optionSelComunidade = [{"valor":'0',"label":"Não"},{"valor":'1',"label":"Sim"}]

  const [ newCourseId, setNewCourseId ] = useState<null|number>(null)
  const createNewCourse = async (e:FormEvent) => {
    e.preventDefault();
    try{
      const data = {
        "image":capaCurso,
        "author":autor,
        "name":nome,
        "description":descricao,
        "tags":tags,
        "community":parseInt(comunidade),
        "completed":0,
        "published":0,
        "status":1
      }
      console.log(data)
      const res = await api.post(`newCourse`, data)
      if(res.data.success){
        setNewCourseId(res.data.response.id)
        setNome("")
        setWarningNome(false)
        setDescricao("")
        setAutor("")
        setComunidade('0')
        setTags("")
        setCapaCurso(0)
        setInfoImage(null)
      }
      console.log(res.data)
      setFase(5)
    }catch(e){
      console.log(e)
    }
  }

return (
  <div className="flex flex-col w-full">
    <div className="flex px-2">
      <div className={`${fase === 1 ? "bg-blue-400 text-white" 
                       : fase > 1 ? "bg-blue-400/40 text-white"
                       : "bg-neutral-500/30 text-neutral-500"} 
                       h-8 flex justify-center items-center flex-1 mr-1 text-sm font-bold`}>
        <p> <FontAwesomeIcon className="opacity-50" icon={Fas.faInfoCircle}/> Informações</p>
      </div>
      <div className={`${fase === 2 ? "bg-blue-400 text-white" 
                       : fase > 2 ? "bg-blue-400/40 text-white"
                       : "bg-neutral-500/30 text-neutral-500"} 
                       h-8 flex justify-center items-center flex-1 mr-1 text-sm font-bold`}>
        <p> <FontAwesomeIcon className="opacity-50" icon={Fas.faWrench}/> Pré Configuração</p>
      </div>
      <div className={`${fase === 3 ? "bg-blue-400 text-white" 
                       : fase > 3 ? "bg-blue-400/40 text-white"
                       : "bg-neutral-500/30 text-neutral-500"} 
                       h-8 flex justify-center items-center flex-1 mr-1 text-sm font-bold`}>
        <p> <FontAwesomeIcon className="opacity-50" icon={Fas.faCamera}/> Imagem de Capa</p>
      </div>
      <div className={`${fase === 4 ? "bg-blue-400 text-white" 
                       : fase > 4 ? "bg-blue-400/40 text-white"
                       : "bg-neutral-500/30 text-neutral-500"} 
                       h-8 flex justify-center items-center flex-1 mr-1 text-sm font-bold`}>
        <p> <FontAwesomeIcon className="opacity-50" icon={Fas.faCheck}/> Confirmação</p>
      </div>    
    </div>
  
    { fase === 1 ? //Informações 
      <Card  component={
        <div className="flex flex-col w-full px-32 py-4">
          <div className="flex flex-col w-full ">
            <InputForm label="Nome" placeholder='Nome do Curso' value={nome} onChange={setNome}/>
            { warningNome ? <label className="w-full text-center text-red-500 font-bold mt-0">Escolha um nome para o curso!</label> : false }
          </div>
          <div className="flex w-full">
            <TextAreaForm label="Descrição" placeholder='Nome do Curso' value={descricao} onChange={setDescricao}/>
          </div>
          <div className="flex border-t mt-4 p-2 justify-end items-center">
            <Button name="Cancelar" btn="muted" type='notline' onClick={()=>props.setNewCourse(false)} />
            <Button name="Prosseguir" btn="info" onClick={()=>nextFase()} />
          </div>         
        </div>}/>
    : fase === 2 ? //Preconfiguracao 
      <Card  component={
        <div className="flex flex-col w-full px-32 py-4">
          <div className="flex flex-col w-full ">
            <InputForm label="Autor" placeholder='Nome do Autor do Curso' value={autor} onChange={setAutor}/>
          </div>
          <div className="flex flex-col w-full ">
            <SelectForm label="Comunidade" options={optionSelComunidade} valueKey="valor"  lableKey="label" value={comunidade} onChange={setComunidade}/>
          </div>
          <div className="flex w-full">
            <TextAreaForm 
              label="Tags(Separadas por ponto e vírgula ';')" 
              placeholder='Insira tags para ajudar os alunos a encontrar este curso nas buscas' value={tags} onChange={setTags}/>
          </div>
          <div className="flex border-t mt-4 p-2 justify-end items-center">
            <Button name="Cancelar" btn="muted"  type='notline' onClick={()=>props.setNewCourse(false)} />
            <Button name="Voltar" btn="muted"     onClick={()=>previousFase()} />
            <Button name="Prosseguir" btn="info" onClick={()=>nextFase()} />
          </div>         
        </div>}/>
    : fase === 3 ? //Capa 
      <Card  component={
        <div className="flex flex-col flex-1">
          <div className="flex w-full p-2 bg-neutral-950 rounded">  
            { capaCurso !== 0 ?
              <div className="flex flex-col w-1/4 justify-center items-center bg-slate-700 rounded my-2">                  
                {infoImage ? <img src={`${urlBase}/gallery/${infoImage.file}`} className='w-[200px]'/> : <Loading/>}
                <p className="mt-1 text-sm font-bold text-slate-300">Imagem selecionada para capa!</p>
                <Button icon="faTrash" name="Remover" btn="error" type="notline" size="sm" onClick={()=>setCapaCurso(0)}/>
              </div>
            : false}
            <Card className='flex-1 min-h-[250px] max-h-[300px] overflow-auto' component={
              <div className="flex w-full flex-1">
                <PageGallery page={1} setImage={setCapaCurso}/>
              </div>
            }/>
          </div>
          <div className="flex border-t mt-4 p-2 justify-end items-center">
            <Button name="Cancelar" btn="muted"  type='notline' onClick={()=>props.setNewCourse(false)} />
            <Button name="Voltar" btn="muted"     onClick={()=>previousFase()} />
            { capaCurso !== 0 ? <Button name="Prosseguir" btn="info" onClick={()=>nextFase()} /> : false }
          </div> 
        </div>
        }/>          
    : fase === 4 ? 
    <Card component={
      <form className="flex flex-col flex-1" onSubmit={(e)=>createNewCourse(e)}>
        <p className="text-slate-400">
          <FontAwesomeIcon className="text-sky-400 opacity-70" icon={Fas.faClipboardCheck}/> Confirme se todos os dados estão corretos antes de salvar o curso!</p>
        <div className="flex">
          <div className="flex flex-col w-1/3 justify-center items-center bg-gray-700/40 rounded m-2">              
            {infoImage ? <img src={`${urlBase}/gallery/${infoImage.file}`} className='w-[90%]'/> : <Loading/>}
            <Button name="Alterar Capa" icon="faEdit" btn="info" type="notline"  onClick={()=>previousFase()} />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex flex-col w-full ">
              <InputForm label="Nome" required placeholder='Nome do Curso' value={nome} onChange={setNome}/>
            </div>
            <div className="flex flex-col w-full ">
              <TextAreaForm label="Descrição" placeholder='Nome do Curso' value={descricao} onChange={setDescricao}/>
            </div>

            <div className="flex flex-col w-full ">
              <InputForm label="Autor" placeholder='Nome do Autor do Curso' value={autor} onChange={setAutor}/>
            </div>
            <div className="flex flex-col w-full ">
              <SelectForm label="Comunidade" options={optionSelComunidade} valueKey="valor"  lableKey="label" value={comunidade} onChange={setComunidade}/>
            </div>
            <div className="flex flex-col w-full ">
              <TextAreaForm 
                label="Tags(Separadas por ponto e vírgula ';')" 
                placeholder='Insira tags para ajudar os alunos a encontrar este curso nas buscas' value={tags} onChange={setTags}/>
            </div>
          </div>

        </div>
        
        <div className="flex border-t mt-4 p-2 justify-end items-center">
            <Button name="Cancelar" btn="muted"  type='outline' onClick={()=>props.setNewCourse(false)} />
            <Button submit name="Salvar Novo Curso" icon="faSave" btn="success" /> 
          </div> 
      </form>
    }/>
    : fase === 5 ? 
      <Card component={
        <div className="flex flex-1">
          { newCourseId === null ? 
              <div className="flex flex-col w-full justify-center items-center">
                <FontAwesomeIcon className="text-red-300 text-3xl" icon={Fas.faExclamationCircle}/> 
                <p className="m-2 text-red-400">Ocorreu um erro ao criar o curso!</p>
                <Button name="Tentar Novamente" btn="muted"  type='outline' onClick={()=>setFase(1)} /> 
              </div>
            :  
            <div className="flex flex-col w-full justify-center items-center">
              <FontAwesomeIcon className="text-teal-300 text-3xl" icon={Fas.faCheckCircle}/> 
              <p className="m-2 text-teal-500">Curso cadastrado com sucesso!</p>
              <div className="flex">
                <Button icon="faFolderOpen" name="Abrir Curso" btn="info"  type='outline' onClick={()=>{props.setOpenCourse(newCourseId),props.setNewCourse(false)}} /> 
                <Button icon="faPlus" name="Criar Novo Curso" btn="success"  onClick={()=>setFase(1)} /> 
              </div>
            </div>
          }
        </div>
      }/>
    : false }      
    </div>
  )
}
