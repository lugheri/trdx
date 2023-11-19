import { useEffect, useState, FormEvent } from "react"
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

  
 