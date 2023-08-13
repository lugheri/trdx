import React, { useState, useEffect, FormEvent } from 'react';
import { urlBase } from '../../../../utils/baseUrl';

import { ICourse } from '../../../Dtos/courses.dto';
import { IFileGallery } from '../../../Dtos/gallery.dto';

import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"
import { Card } from '../../../../components/Cards';
import api from '../../../../services/api';
import { Loading } from '../../../../components/Loading';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { InputForm, SelectForm, TextAreaForm } from '../../../../components/Inputs';
import { Modal, TitleModal } from '../../../../components/Modal';


export const Catalog = () => {
  const [ newCourse, setNewCourse ] = useState(false)

  const [ editCourse, setEditCourse ] = useState<null|number>(null)

  
  
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faChalkboard" 
        title="Catálogo" 
        description="Cátalogo de Cursos"
        rightComponent={
          <div className="flex">
            <Button btn='info' name="Criar Novo Curso" icon="faPlus" onClick={()=>setNewCourse(true)}/>
          </div>
        }/>

      {/*BODY */}  
      { newCourse ? 
        <Card component={
          <NewCourse 
            setEditCourse={setEditCourse}
            setNewCourse={setNewCourse}/>}/>
      : editCourse ?  
        <EditCourse 
          editCourse={editCourse}
          setEditCourse={setEditCourse}/>
      :      
        <Card component={
          <ListCourses 
            setEditCourse={setEditCourse}/>}/>
      }


    </div>
  )
}

const NewCourse : React.FC<{setNewCourse: React.Dispatch<React.SetStateAction<boolean>>; 
                            setEditCourse: React.Dispatch<React.SetStateAction<null|number>>}> = (props) => {

  const [ fase, setFase ] = useState(1)

  const [nome, setNome] = useState("")
  const [warningNome, setWarningNome] = useState(false)
  const [descricao, setDescricao] = useState("")

  const [autor, setAutor] = useState("")
  const [comunidade, setComunidade] = useState(0)
  const [tags, setTags] = useState("")

  const [ capaCurso, setCapaCurso ] = useState(0)
  const [ infoImage, setInfoImage ]= useState<IFileGallery|null>(null)
  useEffect(()=>{
    const getInfoImage = async () => {
      try{
        const info = await api.get(`infoFile/${capaCurso}`)
        setInfoImage(info.data.response)
      }catch(e){
        console.log(e)
      } 
    }
    capaCurso > 0 ? getInfoImage() : false
  },[capaCurso])

  
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

  const optionSelComunidade = [{"valor":0,"label":"Não"},{"valor":1,"label":"Sim"}]

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
        "community":comunidade,
        "completed":0,
        "published":0,
        "status":1
      }
      const res = await api.post(`newCourse`, data)
      if(res.data.success){
        setNewCourseId(res.data.response.id)
        setNome("")
        setWarningNome(false)
        setDescricao("")
        setAutor("")
        setComunidade(0)
        setTags("")
        setCapaCurso(0)
        setInfoImage(null)
      }
      setFase(5)
    }catch(e){
      console.log(e)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex">
        <div className={`${fase === 1 ? "bg-blue-400 text-white dark:bg-blue-500 dark:text-white" 
                         : fase > 1 ? "bg-blue-300 text-white dark:bg-blue-800 dark:text-blue-300"
                         : "bg-slate-200 text-slate-400 dark:bg-gray-900 dark:text-gray-600"} 
                         h-8 flex justify-center items-center flex-1 mr-1 text-sm font-bold`}>
          <p> <FontAwesomeIcon className="opacity-50" icon={Fas.faInfoCircle}/> Informações</p>
        </div>
        <div className={`${fase === 2 ? "bg-blue-400 text-white dark:bg-blue-500 dark:text-white" 
                         : fase > 2 ? "bg-blue-300 text-white dark:bg-blue-800 dark:text-blue-300"
                         : "bg-slate-200 text-slate-400 dark:bg-gray-900 dark:text-gray-600"} 
                         h-8 flex justify-center items-center flex-1 mr-1 text-sm font-bold`}>
          <p> <FontAwesomeIcon className="opacity-50" icon={Fas.faWrench}/> Pré Configuração</p>
        </div>
        <div className={`${fase === 3 ? "bg-blue-400 text-white dark:bg-blue-500 dark:text-white" 
                         : fase > 3 ? "bg-blue-300 text-white dark:bg-blue-800 dark:text-blue-300"
                         : "bg-slate-200 text-slate-400 dark:bg-gray-900 dark:text-gray-600"} 
                         h-8 flex justify-center items-center flex-1 mr-1 text-sm font-bold`}>
          <p> <FontAwesomeIcon className="opacity-50" icon={Fas.faCamera}/> Imagem de Capa</p>
        </div>
        <div className={`${fase === 4 ? "bg-teal-400 text-white dark:bg-teal-500 dark:text-white" 
                         : fase > 4 ? "bg-blue-300 text-white dark:bg-blue-800 dark:text-blue-300"
                         : "bg-slate-200 text-slate-400 dark:bg-gray-900 dark:text-gray-600"} 
                         h-8 flex justify-center items-center flex-1 mr-1 text-sm font-bold`}>
          <p> <FontAwesomeIcon className="opacity-50" icon={Fas.faCheck}/> Confirmação</p>
        </div>    
      </div>

      <div className="bg-slate-200 dark:bg-gray-700 rounded p-2 mt-2">
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
            <div className="flex w-full p-2 bg-slate-200 dark:bg-gray-700  rounded">  
              { capaCurso !== 0 ?
                <div className="flex flex-col w-1/4 justify-center items-center bg-slate-700 rounded my-2">                  
                  {infoImage ? <img src={`${urlBase}/gallery/${infoImage.file}`} className='w-[200px]'/> : <Loading/>}
                  <p className="mt-1 text-sm font-bold text-slate-300">Imagem selecionada para capa!</p>
                  <Button icon="faTrash" name="Remover" btn="error" type="notline" size="sm" onClick={()=>setCapaCurso(0)}/>
                </div>
              : false}
              <Card className='flex-1 min-h-[250px] max-h-[300px] overflow-auto' component={
                <div className="flex w-full flex-1">
                  <PageGallery page={1} setCapaCurso={setCapaCurso}/>
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
            <div className="flex flex-col w-1/3 justify-center items-center bg-slate-700 rounded m-2">              
              {infoImage ? <img src={`${urlBase}/gallery/${infoImage.file}`} className='w-[200px]'/> : <Loading/>}
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
                  <Button icon="faFolderOpen" name="Abrir Curso" btn="info"  type='outline' onClick={()=>props.setEditCourse(newCourseId)} /> 
                  <Button icon="faPlus" name="Criar Novo Curso" btn="success"  onClick={()=>setFase(1)} /> 
                </div>
              </div>
            }
          </div>
        }/>
      : false }      
      </div>
    </div>
  )
}
const PageGallery: React.FC<{page:number;setCapaCurso:React.Dispatch<React.SetStateAction<number>>}> = (props) => {
  const [ itemsGallery, setItemsGallery ] = useState<IFileGallery[]|null>(null)
  const [ nextPage, setNextPage ] = useState(0)
  useEffect(()=>{
    const listItemsGallery = async () => {
      try{
        const filters = {
          "status":1,
          "page":props.page
        }
        const list = await api.post('filterFiles',filters)
        setItemsGallery(list.data.response)
      }catch(e){
        console.log(e)
      }      
    }
    listItemsGallery()
  },[])

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap">
        {
          itemsGallery === null ? <Loading/> 
          : itemsGallery.map((file,key)=>(
            <div key={key} className="p-4">
              <p className="text-slate-400 font-bold text-sm text-center">{ file.name}</p>
              <div className="w-[150px] relative h-auto flex justify-center items-center">
                <img src={`${urlBase}/gallery/${file.file}`} className='w-[150px]'/>
                <div 
                  className="bg-slate-900 text-center cursor-pointer absolute w-full h-full flex justify-center items-center text-white opacity-10 hover:opacity-70"
                  onClick={()=>props.setCapaCurso(file.id)}>
                  Selecionar Imagem
                </div>
              </div>           
            </div>
          ))
        }       
      </div>  
      {nextPage > 0 ?  <PageGallery page={nextPage} setCapaCurso={props.setCapaCurso}/> : false}
      { itemsGallery ? itemsGallery.length > 0 ? nextPage == 0 ?
        <Button btn="muted" type="outline" size="sm" name="Carregar Mais" onClick={()=>setNextPage(props.page+1)}/>
      : false : false : false }
    </div>
  )
}

const ListCourses : React.FC<{setEditCourse: React.Dispatch<React.SetStateAction<null|number>>}> = (props) => {
  const [ listCourses, setListCourses ] = useState<ICourse[]|null>(null)
  const [ totalCourses, setTotalCourses ] = useState<number>(0)
  useEffect(()=>{
    const listCourses = async () => {
      try{
        const c = await api.post('listCourses',{"status":1});       
        setListCourses(c.data.response)
        setTotalCourses(c.data.response.length)
      }catch(e){
        console.log(e)
      }      
    }
    listCourses()
  },[])
  return(
    <div>
      <p className="font-bold text-slate-400 dark:text-slate-300 my-2">{totalCourses} Curso(s) Cadastrado(s).</p>
      <div className="bg-slate-300 dark:bg-slate-950 overflow-hidden p-2 rounded flex flex-wrap">
        { listCourses === null ? <Loading/>
        : listCourses.map((course,key)=>(
          <div key={key} 
              className="dark:bg-gray-800 bg-white shadow-md m-2 w-[23%] rounded  flex flex-col justify-start items-center">
            <div className="bg-slate-600 w-full h-[250px] flex justify-center items-center relative overflow-hidden">
              <RenderImage imageId={course.image}/>
              { course.published == 1 ? 
                <div className="absolute bottom-0 right-2 bg-teal-500 text-white px-2 py-1 text-xs font-bold shadow rounded-t-lg">
                  <FontAwesomeIcon icon={Fas.faBullhorn}/> Público</div> 
              : <div className="absolute bottom-0 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold shadow rounded-t-lg">
                  <FontAwesomeIcon icon={Fas.faLock}/> Privado</div> }
            </div>
            <div className="flex flex-col w-full p-1 justify-start items-start">
              <p className="text-slate-600 dark:text-slate-300 font-black  h-[50px]">{course.name.slice(0, 45)}</p>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-light h-[50px]" title={course.description}>
                { course.description.length > 50 ? course.description.slice(0, 45) + ' . . . ' : course.description }
              </p>
              <div className="flex w-2/3 text-sm mt-4 text-slate-400 dark:text-slate-300 justify-between">
                <p title="Id do Curso"><strong>Cód.:</strong> {course.id} </p>
                <p title="Usuários no curso"><FontAwesomeIcon icon={Fas.faUsers}/> 0 </p>
                <p title="Avaliação média do curso"><FontAwesomeIcon icon={Fas.faStar}/> 0 </p>
              </div>
              <div className="flex w-full justify-center items-end mt-2">
                <Button icon="faFolderOpen" name="Abrir Curso" block btn="info" type="outline" size="sm" onClick={()=>props.setEditCourse(course.id)} />
              </div>
            </div>              
          </div>
        ))}  
      </div>
    </div>
  )
}
const RenderImage : React.FC<{imageId:number}> = (props) => {
  const [ fileImage, setFileImage ] = useState(null)
  useEffect(()=>{
    const getInfoImage = async () => {
      try{
        const i = await api.get(`infoFile/${props.imageId}`)
        setFileImage(i.data.response.file)
      }catch(e){
        console.log(e)
      }
    }
    getInfoImage()
  },[props.imageId])
  return(
    fileImage ? <img src={`${urlBase}/gallery/${fileImage}`}/> : <Loading/>
  )
}

const EditCourse : React.FC<{setEditCourse: React.Dispatch<React.SetStateAction<null|number>>; editCourse: number}> = (props) => {
  const [ infoCourse, setInfoCourse ] = useState<null|ICourse>(null)

  const [ editInfoCourse, setEditInfoCourse ] = useState(false)

  useEffect(()=>{
    const getInfo = async () => {
      try{
        const i = await api.get(`infoCourse/${props.editCourse}`)
        setInfoCourse(i.data.response)
      }catch(e){
        console.log(e)
      }
    }
    getInfo()
  },[props.editCourse])
  return(
    <div className="flex flex-col">
      <div className="px-4 pb-1">
        <p className="text-slate-500 text-lg dark:text-slate-300 font-bold">Página do Curso</p>
      </div>
      <Card  component={
        infoCourse === null ? <Loading/> :
          <div className="flex flex-1 items-center">
            <div className="border bg-white rounded w-[200px] h-[200px] flex justify-center items-center overflow-hidden p-1 shadow-neutral-400 dark:shadow-black shadow-md">
              <RenderImage imageId={infoCourse.image}/>
            </div>
            <div className="flex flex-col flex-1 pl-3 border-l border-slate-300 dark:border-slate-600 ml-3 ">
              <p className="text-slate-500 dark:text-slate-300"><strong>Cód.: </strong>{infoCourse.id}</p>
              <p className="text-slate-500 dark:text-slate-300"><strong>Título: </strong>{infoCourse.name}</p>
              <p className="text-slate-500 dark:text-slate-300"><strong>Descrição: </strong>{infoCourse.description}</p>
              <p className="text-slate-500 dark:text-slate-300"><strong>Por: </strong>{infoCourse.author}</p>
              <p className="text-slate-500 dark:text-slate-300"><strong>Tags: </strong>{infoCourse.tags}</p>
              <p className="text-slate-500 dark:text-slate-300"><strong>Privacidade: </strong>{infoCourse.published == 1 ? "Público" : "Privado"}</p>
              <div className="flex justify-end items-center p-2 bg-gradient-to-l from-slate-200 to-white dark:bg-gradient-to-l dark:from-gray-900 dark:to-gray-800 flex-1 w-full">
                <Button icon="faReply" name="Voltar" btn="muted" type="notline" size="sm" className='rounded-none' onClick={()=>props.setEditCourse(null)} />
                <Button icon="faListCheck" name="Provas" btn="info" type="notline" size="sm" className='rounded-none'/>
                <Button icon="faChartColumn" name="Estatísticas" btn="info" type="notline" size="sm" className='rounded-none'/>
                <Button icon="faEnvelopeOpenText" name="Configurar E-mails" btn="info" type="notline" size="sm" className='rounded-none'/>
                <Button icon="faEdit" name="Editar Informações" btn="info" type="notline" size="sm" className='rounded-none' onClick={()=>setEditInfoCourse(true)}/>
              </div>
            </div>
        </div>
      }/>

      <p>Conteudo ...</p>

      { editInfoCourse ? <Modal component={
        <div>
          <TitleModal 
            icon='faEdit' close={()=>setEditInfoCourse(false)} 
            title='Editar Informações do Curso' 
            subtitle={`Edite as informações básicas do curso ${infoCourse?.name} `}/>
            {infoCourse ? 
              <EditInfoCourse infoCourse={infoCourse} setEditCourse={props.setEditCourse} setEditInfoCourse={setEditInfoCourse}/>
            : <Loading/>}
          </div>
      }/> : false }
      
    </div>
   
  )
}

const EditInfoCourse : React.FC<{infoCourse: ICourse;
                                 setEditCourse: React.Dispatch<React.SetStateAction<null|number>>;
                                 setEditInfoCourse: React.Dispatch<React.SetStateAction<boolean>>}> = (props) => {
  const [nome, setNome] = useState(props.infoCourse.name)
  const [warningNome, setWarningNome] = useState(false)
  const [descricao, setDescricao] = useState(props.infoCourse.description)

  const [autor, setAutor] = useState(props.infoCourse.author)
  const [comunidade, setComunidade] = useState(props.infoCourse.community)
  const [published, setPublished] = useState(props.infoCourse.published)
  const [tags, setTags] = useState(props.infoCourse.tags)

  const [ editImage, setEditImage ] = useState(false)

  const [ capaAtualCurso, setCapaAtualCurso ] = useState(props.infoCourse.image)
  const [ capaCurso, setCapaCurso ] = useState<number>(props.infoCourse.image)

  useEffect(()=>{
    setEditImage(false)
    setCapaAtualCurso(capaCurso)
   
   },[capaCurso])

  const editInfoCourse = async (e:FormEvent) => {
    e.preventDefault()
    try{
      props.setEditCourse(null)   
      const data = {
        "image":capaCurso,
        "author":autor,
        "name":nome,
        "description":descricao,
        "tags":tags,
        "community":typeof comunidade == 'string' ? parseInt(comunidade,10) : comunidade ,
        "completed":0,
        "published":typeof published == 'string' ? parseInt(published,10) : published ,
        "status":1
      }
      console.log(data)
      await api.patch(`editCourse/${props.infoCourse.id}`, data)  
     
      props.setEditCourse(props.infoCourse.id)   
      props.setEditInfoCourse(false)
      
    }catch(e){
      console.log(e)
    }
  }

  const optionSelComunidade = [{"valor":0,"label":"Não"},{"valor":1,"label":"Sim"}]
  const optionSelPublished = [{"valor":0,"label":"Privado"},{"valor":1,"label":"Público"}]
  return (   
    <form className="flex flex-col flex-1" onSubmit={(e)=>editInfoCourse(e)}>
      <div className="flex">
        <div className="flex flex-col w-1/3 justify-center items-center bg-slate-700 rounded m-2">              
          {capaAtualCurso ? <RenderImage imageId={capaAtualCurso} /> : <Loading/>}
           <Button name="Alterar Capa" icon="faEdit" btn="info" type="notline" onClick={()=>{setEditImage(true)}} />         
        </div>
        { editImage ? 
          <div className="flex flex-col flex-1">           
            <Card className='flex-1 min-h-[250px] max-h-[300px] overflow-auto' component={
              <div className="flex w-full flex-1">
            
                <PageGallery page={1} setCapaCurso={setCapaCurso}/>
              </div>
            }/>
          </div>
        :
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
            <div className="flex w-full ">
              <SelectForm label="Comunidade" options={optionSelComunidade} valueKey="valor"  lableKey="label" value={comunidade} onChange={setComunidade}/>
              <SelectForm label="Privacidade" options={optionSelPublished} valueKey="valor"  lableKey="label" value={published} onChange={setPublished}/>
            </div>
            <div className="flex flex-col w-full ">
              <TextAreaForm 
                label="Tags(Separadas por ponto e vírgula ';')" 
                placeholder='Insira tags para ajudar os alunos a encontrar este curso nas buscas' value={tags} onChange={setTags}/>
            </div>
          </div>
        }
      </div>
      <div className="flex border-t mt-4 p-2 justify-end items-center">
        <Button name="Cancelar" btn="muted"  type='outline' onClick={()=>props.setEditInfoCourse(false)} />
        <Button submit name="Salvar Alterações" icon="faSave" btn="success" /> 
      </div> 
    </form>
  )
}




                                                      
