import React, { FormEvent, useEffect, useState } from "react"
import { ICoursesIntegration, IOffers, IProducts } from "../../Dtos/integrations.dto"
import api from "../../../../../services/api"
import { Button } from "../../../../../components/Buttons"
import { LoadingBars } from "../../../../../components/Loading"
import { ICourse } from "../../../Content/Dtos/courses.dto"
import { RenderImageGallery } from "../../../../../components/RenderImageGallery"

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, TitleModal } from "../../../../../components/Modal"
import { InputForm, SelectForm, TextAreaForm } from "../../../../../components/Inputs"
import { SettingsEmailProduct } from "./SettingsEmailProduct"



type offersComponents = {
  product:IProducts
}
export const OffersProducts : React.FC<offersComponents> = (props) => {
  const [ offers, setOffers ] = useState<null | IOffers[]>(null)
  const [ error, setError ] = useState<null | string>(null)

  const [ newOffer, setNewOffer ] = useState<number|null>(null)
  const [ editOffer, setEditOffer ] = useState<IOffers|null>(null)
  const [ deleteOffer, setDeleteOffer ] = useState<IOffers|null>(null)
  
  const [ historicWebhook, setHistoricWebhook ] = useState<null|IProducts>(null)
  const [ settingsEmailProducts, setSettingsEmailProducts ] = useState<null|IProducts>(null)

  const getOffers = async () => {
    try{
      const response = await api.get(`listOffers/${props.product.id}/1`)
      if (response && response.data && response.data.success) {
        setOffers(response.data.response);
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) { console.error('Erro ao obter os itens:', err); }
  }
  useEffect(() => {getOffers();}, [newOffer,editOffer,deleteOffer]); 

  return(
    <div className="flex flex-col w-full ">
      <div className="flex items-center justify-between">
        <p className="text-neutral-100">
          <FontAwesomeIcon className="text-teal-500/50" icon={Fas.faBullhorn}/> Ofertas do Produto: {props.product.name} ({props.product.product_id_platform})
        </p>
        <div className="flex">
          <Button btn="muted" icon="faHistory" type="notline" size="sm" name="Histórico do Webhook" onClick={()=>setHistoricWebhook(props.product)}/>
          <Button btn="muted" icon="faCogs" type="notline" size="sm" name="Configurar E-mails" onClick={()=>setSettingsEmailProducts(props.product)}/>
          <Button btn="success" icon="faPlus" name="Nova Oferta" onClick={()=>{setNewOffer(props.product.id)}}/>
        </div>
      </div>
      { error && <p className="text-red-500">{error}</p>}
      { historicWebhook === null 
        ?
          <ListOffersComponent 
            offers={offers} productId={props.product.id} setEditOffer={setEditOffer} setNewOffer={setNewOffer}/>
        : <HistoricWebhooks product={historicWebhook} close={setHistoricWebhook}/>
      }
      { newOffer && <NewOffer productId={newOffer} close={setNewOffer}/> }
      { editOffer && <EditOffer offer={editOffer} close={setEditOffer} setDeleteOffer={setDeleteOffer}/> }
      { deleteOffer && <RemoveOffer setEditOffer={setEditOffer} offer={deleteOffer} close={setDeleteOffer}/>}
      { settingsEmailProducts && <SettingsEmailProduct product={settingsEmailProducts} close={setSettingsEmailProducts}/>} 
    </div>)
}

//LIST OFFERS
type ListOffersComponent = {
  offers: IOffers[]|null,
  productId:number,
  setNewOffer:React.Dispatch<React.SetStateAction<number|null>>,
  setEditOffer:React.Dispatch<React.SetStateAction<IOffers|null>>
}
const ListOffersComponent : React.FC<ListOffersComponent> = (props) => {
  return(
    <>
      { props.offers === null ? <LoadingBars/>
      : props.offers.length == 0 ? 
        <div className="flex flex-col w-full justify-center items-center p-8">
          <FontAwesomeIcon className="text-teal-500/50 text-6xl my-4" icon={Fas.faBullhorn}/>
          <p className="text-neutral-200">Nenhuma oferta cadastrada neste produto!</p>
          <Button btn="success" icon="faPlus" type="outline" name="Nova Oferta" onClick={()=>{props.setNewOffer(props.productId)}}/>
        </div>
        : <div className="flex flex-wrap"> 
          { props.offers.map((offer,key)=>
            <OfferItem key={key} offer={offer} setEditOffer={props.setEditOffer}/>)}
        </div>} </>
  )
}
//OFFER
type OfferItemComponents = {
  offer:IOffers,
  setEditOffer:React.Dispatch<React.SetStateAction<IOffers|null>>,
}
const OfferItem: React.FC<OfferItemComponents> = (props) => {
  const [ coursesOffer, setCoursesOffer ] = useState<null | ICoursesIntegration[]>(null)
  const [ addCourses, setAddCourses ] = useState<IOffers|null>(null)
  const [ update, setUpdate ] = useState<number|null>(null)

  const getCourses = async () => {
    try{
      const response = await api.get(`listCoursePlatform/${props.offer.product_id}/${props.offer.id}`)
      if (response && response.data && response.data.success) {
        setCoursesOffer(response.data.response);
      }
    } catch (err) { console.error('Erro ao obter os itens:', err); }
  }
  useEffect(() => {getCourses();}, [addCourses,update]); 
  return(
    <div className="flex flex-col items-start w-[99%] py-2 m-1 rounded relative
      border bg-gray-800/50 hover:bg-gray-800 text-white border-teal-500">
      <div className="flex w-full justify-between items-center border-b px-4 border-teal-500">
        <p>Oferta: {props.offer.offer}</p>
        <div className="flex">
          <Button btn="info" icon="faEdit" type="notline" size="sm" name="Editar Oferta" onClick={()=>props.setEditOffer(props.offer)}/>
          <Button btn="info" icon="faPlus" size="sm" name="Adicionar/Remover Cursos" onClick={()=>setAddCourses(props.offer)}/>
        </div>
      </div>
      { coursesOffer === null ? <LoadingBars/>
      : coursesOffer.length === 0 
      ? <div className="text-red-500 flex flex-col w-full p-4">Nenhum Curso Cadastrado na Oferta "{props.offer.offer}"!</div> 
      : <div className="flex flex-wrap max-h-[380px] overflow-auto ">
          {coursesOffer.map((course,key)=>
            <Course key={key} course={course}/>)}      
          { addCourses && <AddCourse offer={addCourses} setUpdate={setUpdate} addedCourses={coursesOffer} close={setAddCourses}/>}        
        </div>}      
    </div>
  )
}
//NEW OFFER
type newOfferComponent = {
  productId:number,
  close:React.Dispatch<React.SetStateAction<number|null>>
}
const NewOffer : React.FC<newOfferComponent> = (props) => {
  const [ offer, setOffer] = useState("")
  const [ description,setDescription ] = useState("")
  const newOffer = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        product_id:props.productId,
        offer:offer,
        description:description
      }
      await api.post('newOffer',data),
      props.close(null)
    }catch(e){console.log(e)}
  }
  return(
    <Modal className="w-1/3" component={
      <form onSubmit={(e)=>newOffer(e)}>
        <TitleModal icon="faPlus" title="Cadastrar Nova Oferta" close={()=>props.close(null)}/>
        <div className="flex flex-col">
          <InputForm label="Código da Oferta (Cod da Oferta na Plataforma)" required value={offer} onChange={setOffer}/>
          <TextAreaForm label="Descrição" value={description} onChange={setDescription}/>
        </div>
        <div className="flex justify-end">
          <Button name="Cancelar" btn="muted" type="notline" onClick={()=>props.close(null)}/>
          <Button name="Nova Oferta" icon="faPlus" btn="info" submit/>
        </div>
      </form>
    }/>
  )
}
//EDIT OFFER
type editOfferComponent = {
  offer:IOffers,
  close:React.Dispatch<React.SetStateAction<IOffers|null>>,
  setDeleteOffer:React.Dispatch<React.SetStateAction<IOffers|null>>,
}
const EditOffer : React.FC<editOfferComponent> = (props) => {
  const [ offer, setOffer] = useState(props.offer.offer)
  const [ description,setDescription ] = useState(props.offer.description)
  const newOffer = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        product_id:props.offer.product_id,
        offer:offer,
        description:description
      }
      await api.patch(`editOffer/${props.offer.id}`,data),
      props.close(null)
    }catch(e){console.log(e)}
  }
  return(
    <Modal className="w-1/3" component={
      <form onSubmit={(e)=>newOffer(e)}>
        <TitleModal icon="faEdit" title="Editar Nova Oferta" close={()=>props.close(null)}/>
        <div className="flex flex-col">
          <InputForm label="Código da Oferta (Cod da Oferta na Plataforma)" required value={offer} onChange={setOffer}/>
          <TextAreaForm label="Descrição" value={description} onChange={setDescription}/>
        </div>
        <div className="flex justify-end">
          <Button name="Cancelar" btn="muted" type="notline" onClick={()=>props.close(null)}/>
          <Button name="Remover" icon="faTrash" btn="error" type="outline" onClick={()=>props.setDeleteOffer(props.offer)}/>
          <Button name="Salvar Alterações" icon="faFloppyDisk" btn="success" submit/>
        </div>
      </form>
    }/>
  )
}
//REMOVE OFFER
type removeOfferComponent = {
  offer:IOffers,
  setEditOffer:React.Dispatch<React.SetStateAction<IOffers|null>>
  close:React.Dispatch<React.SetStateAction<IOffers|null>>
}
const RemoveOffer : React.FC<removeOfferComponent> = (props) => {
  const removeOffer = async () => {
    try{
      const data = {status:0}
      await api.patch(`editOffer/${props.offer.id}`,data),
      props.close(null)
      props.setEditOffer(null)
    }catch(e){console.log(e)}
  }
  return(
    <Modal className="w-1/3" component={
      <div className="flex flex-col">
        <TitleModal icon="faTrash" title="Remover Oferta" close={()=>props.close(null)}/>
        <div className="flex flex-col">
          <p className="text-white p-4 font-light">
            Confirmar remoção da Oferta: <strong className="text-red-500 font-bold">{props.offer.offer}</strong>
          </p>
        </div>
        <div className="flex justify-end">
          <Button name="Cancelar" btn="muted" type="notline" onClick={()=>props.close(null)}/>
          <Button name="Sim, Remover" icon="faTrash" btn="error" onClick={()=>removeOffer()}/>
        </div>
      </div>
    }/>
  )
}

//HISTORIC WEBHOOKS
type HistoricWebhooksComponent = {
  product:IProducts,
  close:React.Dispatch<React.SetStateAction<IProducts|null>>
}
const HistoricWebhooks : React.FC<HistoricWebhooksComponent> = (props) => {
  return(
    <div>
      Histórico {props.product.name}
    </div>
  )
}

// : : : : :   C O U R S E S   : : : : : 
type addCourseComponent = {
  offer:IOffers,
  setUpdate:React.Dispatch<React.SetStateAction<number|null>>,
  addedCourses:ICoursesIntegration[],
  close:React.Dispatch<React.SetStateAction<IOffers|null>>
}
const AddCourse : React.FC<addCourseComponent> = (props) => {
  const [ courses, setCourses ] = useState<ICourse[]|null>(null)
  const getAvailableCourses = async () => {
    try{
      const listCourses = await api.post('listCourses',{status:1})
      setCourses(listCourses.data.response)
    }catch(e){console.log(e)}
  }
  useEffect(()=>{getAvailableCourses()},[])  

  const checkCourseAdded = (courseId:number) => {  
    return props.addedCourses.find(course => course.course_id_students === courseId) ? true : false
  }

  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal icon="faPlus" title="Adicionar Cursos" close={()=>props.close(null)}/>
        <p className="my-2 font-light">Cursos disponíveis para inclusão na oferta:</p>
        <div className="flex flex-wrap max-h-[500px] overflow-auto bg-neutral-950 p-2 rounded-md">
          { courses === null ? <LoadingBars/>
          : courses.length == 0 ? <p className="text-red-500 p-4">Nenhum Curso Disponível</p>
          : courses.map((course,key)=><CourseAddButton key={key} setUpdate={props.setUpdate} course={course} offer={props.offer} added={checkCourseAdded(course.id)}/>)}
        </div>
        <div className="flex justify-end pt-3">
          <Button name="Concluir" btn="success" icon="faCheck" onClick={()=>props.close(null)}/>
        </div>
      </div>
    }/>
  )
}


type courseAddButtonComponent = {
  course:ICourse,
  offer:IOffers,
  setUpdate:React.Dispatch<React.SetStateAction<number|null>>,
  added:boolean
}
const CourseAddButton : React.FC<courseAddButtonComponent> = (props) => {
  const contracts = [
    { contract:'S',name:'Semanal'},
    { contract:'Q',name:'Quinzenal'},
    { contract:'M',name:'Mensal'},
    { contract:'B',name:'Bimestral'},
    { contract:'T',name:'Trimestral'},
    { contract:'SM',name:'Semestral'},
    { contract:'A',name:'Anual'},
    { contract:'V',name:'Vitalício'},
  ]
  const [ validityContract, setValidityContract] = useState('V')
  const addOrRemoveCourse = async (action:string) => {
    props.setUpdate(0)
    if(action=='add'){
      const data={
        product_id:props.offer.product_id,
        offer_id:props.offer.id,
        course_id_students:props.course.id,
        validity_contract:validityContract
      }
      await api.post('newCoursePlatform',data)
    }else{
      console.log('GET',`infoCourseStudentPlatform/${props.course.id}`)
      const infoCoursePlatform = await api.get(`infoCourseStudentPlatform/${props.offer.id}/${props.course.id}`)
      const id = infoCoursePlatform.data.response.id
      console.log('response',infoCoursePlatform.data.response)
      console.log('ID',id,'line',props.course.id)
      await api.delete(`deleteCoursePlatform/${id}`)
    }
    props.setUpdate(props.course.id)
    
  }
  return(
    <div className="flex justify-between w-[49.2%] bg-neutral-800 h-32 mb-1 ml-1 rounded overflow-hidden">
      <RenderImageGallery className="h-[100%]" imageId={props.course.image} imgTag/>
      <div className="flex flex-col justify-start flex-1 p-2">
        <p className="text-sm h-12">{props.course.name}</p>
        { props.course.published === 1 
        ? <p className="text-teal-500 w-full text-center text-sm"><FontAwesomeIcon icon={Fas.faBullhorn}/> Publicado</p> 
        : <p className="text-red-500 w-full text-center text-sm"><FontAwesomeIcon icon={Fas.faEyeSlash}/> Privado</p> }
        { props.added 
        ? <Button btn="muted" icon="faMinus" size="sm" name="Remover" onClick={()=>addOrRemoveCourse('del')} />
        : <div className="flex items-center">
            <div className="flex flex-1 flex-col">
            <p className="text-xs">Plano:</p>
            <SelectForm className="text-xs" options={contracts} valueKey="contract" lableKey="name" value={validityContract} onChange={setValidityContract}/>
            </div>
            <Button btn="info" icon="faPlus" size="sm" onClick={()=>addOrRemoveCourse('add')} />
          </div>  }
      </div>      
    </div>
  )
}

type ICourseComponent = {
  course:ICoursesIntegration
}
const Course: React.FC<ICourseComponent> = (props) => {
  const [ infoCourse, setInfoCourse ] = useState<ICourse | null>(null)
  const [ error, setError ] = useState<null | string>(null)
  const getInfoCourse = async () => {
    try{
      const response = await api.get(`infoCourse/${props.course.course_id_students}`)
      if (response && response.data && response.data.success) {
        setInfoCourse(response.data.response);
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) { console.error('Erro ao obter os itens:', err); }
  }
  useEffect(() => {getInfoCourse();}, []); 

  return(
    <div className="flex flex-col justify-center items-center w-[19%] m-1">
      {infoCourse === null ? <LoadingBars/> 
      :<div className="flex flex-col justify-center items-center bg-neutral-950 rounded">
        <RenderImageGallery className="w-[100%]" imageId={infoCourse.default_thumb} imgTag/>
        <p className="text-white text-center my-1 text-xs font-light">
          {infoCourse.name}
        </p>
        <p className="text-white text-center my-1 text-xs">
          <FontAwesomeIcon className="text-sky-500/50 px-2" icon={Fas.faCalendarCheck}/>
          {props.course.validity_contract == 'S' ? 'Semanal' 
          : props.course.validity_contract == 'Q' ? 'Quinzenal' 
          : props.course.validity_contract == 'M' ? 'Mensal' 
          : props.course.validity_contract == 'B' ? 'Bimestral' 
          : props.course.validity_contract == 'T' ? 'Trimestral' 
          : props.course.validity_contract == 'SM' ? 'Semestral' 
          : props.course.validity_contract == 'A' ? 'Anual' 
          : props.course.validity_contract == 'V' ? 'Vitalício'
          : 'Plano Inválido'}
        </p>
      </div>} 
      {error && <p>{error}</p>}    
    </div>
  )
}







{/*import { useEffect, useState, FormEvent } from "react"
import { Modal, TitleModal } from "../../../../../components/Modal"
import { ICoursesIntegration, IOffers, IProducts } from "../../Dtos/integrations.dto"
import api from "../../../../../services/api"
import { Loading } from "../../../../../components/Loading"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../../../../components/Buttons"
import { Card } from "../../../../../components/Cards"
import { InputForm } from "../../../../../components/Inputs"
import { ICourse } from "../../../Content/Dtos/courses.dto"
import { RenderImageGallery } from "../../../../../components/RenderImageGallery"

type IOffersIntegrationsComponents = {
  product:IProducts,
  setOpenProduct:React.Dispatch<React.SetStateAction<IProducts|null>> 
}
export const OffersIntegrations : React.FC<IOffersIntegrationsComponents> = (props) => {
  const [ offers, setOffers ] = useState<null | IOffers[]>(null)
  const [ error, setError ] = useState<null | string>(null)

  const [ newOffer, setNewOffer ] = useState(false)
  const getOffers = async () => {
    try{
      const response = await api.get(`listOffers/${props.product.id}/1`)
      if (response && response.data && response.data.success) {
        setOffers(response.data.response);
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) { console.error('Erro ao obter os itens:', err); }
  }
  useEffect(() => {getOffers();}, [newOffer]); 

  return(
    <Modal className="w-[100%]" component={
      <div className="flex flex-col">
        <TitleModal 
          icon="faWrench" 
          title="Configurar Ofertas do Produto"
          subtitle={`Cadastre todas as suas ofertas disponíveis do produto ${props.product.product_id_platform} no(a) ${props.product.integration}`}
          close={()=>props.setOpenProduct(null)}/>

        <div className="flex justify-end items-center my-2">
          <Button submit btn="info" size="sm" icon="faBullhorn" name='Adicionar Oferta' onClick={()=>setNewOffer(true)} />
        </div>

        {newOffer && <NewOffer productId={props.product.id} setNewOffer={setNewOffer}/>}

        <div className="flex flex-col max-h-[500px] overflow-auto">
        { error !== null ? <p className="text-red-500">{error}</p>
        : offers === null ? <Loading/>
          : offers.length === 0 
          ? <div className="text-red-500 flex flex-col justify-center items-center w-full p-4">Nenhuma Oferta Cadastrado!</div> 
          : <div className="flex flex-wrap">
              {offers.map((offer,key)=>
                <Offer key={key} offer={offer}/>)}              
          </div>}
        </div>
      </div>
    }/>
  )
}

//New Offer
type INewOfferComponent = {
  productId:number,
  setNewOffer:React.Dispatch<React.SetStateAction<boolean>>
}
const NewOffer : React.FC<INewOfferComponent> = (props) => {
  const [ offer, setOffer ] = useState("")
  const [ description, setDescription ] = useState("")

  const [ error, setError ] = useState("")  

  const SaveNewOffer = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        product_id:props.productId,
        offer:offer,
        description:description
      }
      console.log('data',data)
      const response = await api.post('newOffer/',data)
      if (response && response.data && response.data.success) {
        props.setNewOffer(false)
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }
  }

  return(
      <Card component={
        <form className="flex w-full p-2 justify-between items-center" onSubmit={(e)=>SaveNewOffer(e)}>
          { error && <p className="text-red-500">{error}</p>}
        <InputForm className="mx-1" required label="Oferta" value={offer} onChange={setOffer}/>
        <InputForm className="mx-1" label="Descrição" value={description} onChange={setDescription}/>
        <Button className="mt-3" btn="muted" icon="faX" type="notline" onClick={()=>props.setNewOffer(false)} />
        <Button className="mt-3" submit  icon="faFloppyDisk" btn="success" name="Salvar" />        
        </form>
      }/>
  )
}

type IOfferComponent = {
  offer:IOffers
}
const Offer : React.FC<IOfferComponent> = (props) => {
  const [ courses, setCourses ] = useState<null | ICoursesIntegration[]>(null)
  const [ error, setError ] = useState<null | string>(null)

  const [ newCourse, setNewCourse ] = useState<IOffers|null>(null) 

  const getCourses = async () => {
    try{
      const response = await api.get(`listCoursePlatform/${props.offer.product_id}/${props.offer.id}`)
      if (response && response.data && response.data.success) {
        setCourses(response.data.response);
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) { console.error('Erro ao obter os itens:', err); }
  }
  useEffect(() => {getCourses();}, [newCourse]); 
  return(
    <div className="flex flex-col w-full p-2 mt-2 bg-slate-900 rounded">
      <div className="flex justify-between items-center w-full p-2 border-b border-slate-600">
        <p className="text-white ">
          <b>
            <FontAwesomeIcon className="opacity-50" icon={Fas.faBullhorn}/> Oferta:
          </b> {props.offer.offer}
        </p>
        <Button icon="faPlus" size="sm" btn="success" name="Adicionar Curso" onClick={()=>setNewCourse(props.offer)}/> 
      </div>
      <div className="flex flex-col bg-slate-950/50 p-2 rounded-md mt-2">
        { error !== null ? <p className="text-red-500">{error}</p>
        : courses === null ? <Loading/>
          : courses.length === 0 
          ? <div className="text-red-500 flex flex-col w-full p-4">Nenhum Curso Cadastrado na Oferta "{props.offer.offer}"!</div> 
          : <div className="flex flex-wrap">
              {courses.map((course,key)=>
                <Course key={key} course={course}/>)}              
          </div>}
      </div>
      { newCourse &&  <NewCourse offer={newCourse} setNewCourse={setNewCourse}/>}
    </div>    
  )
}

type ICourseComponent = {
  course:ICoursesIntegration
}
const Course: React.FC<ICourseComponent> = (props) => {

  const [ infoCourse, setInfoCourse ] = useState<ICourse | null>(null)
  const [ error, setError ] = useState<null | string>(null)

  const getInfoCourse = async () => {
    try{
      const response = await api.get(`infoCourse/${props.course.course_id_students}`)
      if (response && response.data && response.data.success) {
        setInfoCourse(response.data.response);
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) { console.error('Erro ao obter os itens:', err); }
  }
  useEffect(() => {getInfoCourse();}, []); 


  return(
    <div className="flex flex-col justify-center items-center w-[19%] m-1">
      {infoCourse === null ? <Loading/> 
      :<div className="flex flex-col justify-center items-center">
        <RenderImageGallery className="w-[80%]" imageId={infoCourse.default_thumb} imgTag/>
        <p className="text-white text-center my-1 text-xs font-light">{infoCourse.name}</p>
      </div>} 
      {error && <p>{error}</p>}    
    </div>
  )
}

type INewCourseComponent = {
  offer:IOffers
  setNewCourse:React.Dispatch<React.SetStateAction<IOffers|null>>
}
const NewCourse : React.FC<INewCourseComponent> = (props) => {
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal icon="faPlus" title="Adicionar Curso" close={()=>props.setNewCourse(null)}/>
        <form className="flex flex-col" >Novo Curso</form>
      </div>
    }/>
    
  )
}
*/}
  
 