import { useState, useEffect } from 'react';
import { Button } from "../../../../../components/Buttons";
import api from '../../../../../services/api';
import { Loading, LoadingBars } from '../../../../../components/Loading';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IFileGallery } from '../../../../Students/Dtos/gallery.dto';
import { urlBase } from '../../../../../utils/baseUrl';
import { Modal, TitleModal } from '../../../../../components/Modal';
import { ICourse } from '../../../Content/Dtos/courses.dto';
import { NewValidityContract, RemoveValidityContract, ValidityContract } from './ValidityContracts';

import moment from 'moment';

interface ICourseCard{
  id:number;
  image:number;
  name:string;
  studentName:string;
  studentId:number;
  viewMode: 'cells'|'list';
  setUpdate:React.Dispatch<React.SetStateAction<number>>;
}

export const CourseCard : React.FC<ICourseCard> = (props) => {
  const [ infoImage, setInfoImage ]= useState<IFileGallery|null>(null)
  const [ infoCourse, setInfoCourse ]= useState<ICourse|null>(null)
  const [ statusContract, setStatusContract ]= useState<'Expirado'|'Expira Hoje!'|'Vigente'|null>(null)
  const [ planContract, setPlanContract ]= useState<string|null>(null)

  /*Modal Triggers*/
  const [validityContract, setValidityContract] = useState<number|null>(null)
  const [newContract, setNewContract] = useState<number|null>(null)
  const [removeContract, setRemoveContract] = useState<number|null>(null)
  const [studentEvolution, setStudentEvolution] = useState<number|null>(null)
  const [removeCourse, setRemoveCourse] = useState<number|null>(null)
  

  useEffect(()=>{
    const getInfoImage = async () => {
      try{
        if(props.image){
          const info = await api.get(`infoFile/${props.image}`)
          setInfoImage(info.data.response)
        }else{
          setInfoImage(null)
        }
      }catch(e){
        console.log(e)
      } 
    }    
    const infoCourse = async () => {
      try{
        const info = await api.get(`infoCourse/${props.id}`)
        setInfoCourse(info.data.response)
      }catch(e){
        console.log(e)
      } 
    }

    const ActiveContract = async () => {
      try{
        const today = moment();
        const contract = await api.get(`activeContract/${props.studentId}/${props.id}`)
        let status : 'Expirado'|'Expira Hoje!'|'Vigente'|null = null
        const statusExpired = contract.data.response.end_validity ? moment(contract.data.response.end_validity, 'YYYY-MM-DD') : moment('YYYY-MM-DD') ;
        if(contract.data.response.payment_cycle === "V" ){
          status = 'Vigente';
        }else{
          if (statusExpired.isBefore(today)) {
            status = 'Expirado';
          } else if (statusExpired.isSame(today, 'day')) {
            status = 'Expira Hoje!';
          } else {
            status = 'Vigente';
          }
        }
        const plan = contract.data.response.payment_cycle === "A" ? "Anual"
                   : contract.data.response.payment_cycle === "SM" ? "Semestral"
                   : contract.data.response.payment_cycle === "T" ? "Trimestral"
                   : contract.data.response.payment_cycle === "B" ? "Bimestral"
                   : contract.data.response.payment_cycle === "M" ? "Mensal"
                   : contract.data.response.payment_cycle === "Q" ? "Quinzenal"
                   : contract.data.response.payment_cycle === "S" ? "Semanal"
                   : "Vitalício"
        setStatusContract(status)
        setPlanContract(plan)
      }catch(e){
        console.log(e)
      } 
    }
    getInfoImage()
    if(props.viewMode == 'list'){
      infoCourse() 
      ActiveContract()
    }

  },[props.viewMode,validityContract])


  return(
    props.viewMode == 'cells' ? 
      <div className="shadow-neutral-950 shadow overflow-hidden flex flex-col w-[175px] rounded bg-neutral-700 mr-1 mb-1 opacity-60 hover:opacity-100 cursor-pointer" title={props.name}>
        { props.image !== 0 ? 
          infoImage ? <img src={`${urlBase}/gallery/${infoImage.file}`} className='w-full'/> : <Loading/>
          : <div className="flex flex-col w-full h-[180px] bg-neutral-500 text-neutral-800 flex justify-center items-center">
              <FontAwesomeIcon className="text-4xl" icon={Fas.faCamera}/>
              <p>Sem Capa</p>
            </div>
        }
      </div>
    : 
    <div className="flex w-full h-[200px] mb-2 bg-neutral-800 rounded-lg overflow-hidden shadow-neutral-950 shadow ">
      <div className="w-1/4">
        { props.image !== 0 ? 
          infoImage ? <img src={`${urlBase}/gallery/${infoImage.file}`} className='w-full'/> : <Loading/>
          : <div className="flex flex-col w-full h-[180px] bg-neutral-500 text-neutral-800 flex justify-center items-center">
              <FontAwesomeIcon className="text-4xl" icon={Fas.faCamera}/>
              <p>Sem Capa</p>
            </div>
        }
      </div>
      {infoCourse === null ? <Loading/> : 
        <div className="flex flex-col justify-between w-full overflow-auto">
          <div className="p-2">
            <p className="text-xl text-neutral-300">{infoCourse.name}</p>
            <p className="text-sm text-neutral-400" title={infoCourse.description}>
              { infoCourse.description.length > 300 ? infoCourse.description.slice(0, 295) + ' . . . ' : infoCourse.description }
            </p>
          </div>
          <div className="flex justify-between items-center bg-gradient-to-r from-neutral-800 to-neutral-700 w-full p-1">
            <p className={`${statusContract == 'Vigente' ? 'bg-teal-800' : statusContract == 'Expira Hoje!' ? 'bg-orange-800' : 'bg-red-800' } 
                           text-center text-sm text-white opacity-50 rounded py-1 px-2`}>
              { planContract ? `Plano ${planContract} - ${statusContract}` : 'Sem Plano'}
            </p>          
            <div className="flex">
              <Button icon="faCalendarCheck" btn='info' name="Vigência" type="notline" size='sm' onClick={()=>setValidityContract(infoCourse.id)}/>
              <Button icon="faChartLine" btn='info' name="Evolução do Aluno" type="notline" size='sm' onClick={()=>setStudentEvolution(infoCourse.id)}/>
              <Button icon="faTrash" btn='error' name="Remover Curso" type="notline" size='sm' onClick={()=>setRemoveCourse(infoCourse.id)}/>
            </div>
          </div>
        {/*Modais*/}
        { validityContract && <ValidityContract 
                                close={()=>setValidityContract(null)}
                                setNewContract={setNewContract} newContract={newContract}
                                setRemoveContract={setRemoveContract} removeContract={removeContract}
                                studentId={props.studentId} studentName={props.studentName}
                                courseId={infoCourse.id} courseName={infoCourse.name} />}
        { newContract && <NewValidityContract infoCourse={infoCourse} close={()=>setNewContract(null)} studentId={props.studentId} studentName={props.studentName} courseId={infoCourse.id} courseName={infoCourse.name} />}
        { removeContract && <RemoveValidityContract infoCourse={infoCourse} close={()=>setRemoveContract(null)} studentName={props.studentName} contractId={removeContract} /> }
        { studentEvolution && <EvolutionCourse infoCourse={infoCourse} studentName={props.studentName} setStudentEvolution={setStudentEvolution}/>}
        { removeCourse && <RemoveCourse setUpdate={props.setUpdate} studentId={props.studentId} infoCourse={infoCourse} studentName={props.studentName} setRemoveCourse={setRemoveCourse}/>} 
      </div>}       
    </div>    
  )
}


type EvolutionCourseComponent = {
  infoCourse:ICourse,
  setStudentEvolution:React.Dispatch<React.SetStateAction<number|null>>
  studentName:string
}
const EvolutionCourse : React.FC<EvolutionCourseComponent>  = (props) => {
  return(
    <Modal component={
      <div>
        <TitleModal 
          icon='faChartLine' 
          close={()=>props.setStudentEvolution(null)} 
          title='Evolução do Aluno'
          subtitle={`Acompanhe a evolução do aluno ${props.studentName} no curso ${props.infoCourse.name}`}/>
      </div>}/>
    
  )
}


type RemoveCourseComponent = {
  infoCourse:ICourse,
  setRemoveCourse:React.Dispatch<React.SetStateAction<number|null>>
  studentName:string,
  studentId:number,
  setUpdate:React.Dispatch<React.SetStateAction<number>>;
}
const RemoveCourse : React.FC<RemoveCourseComponent>  = (props) => {
  const [ idJoin, setIdJoin]= useState<number|null>(null)

  const getCheckCourseStudent = async () => {
    try{
      const check = await api.get(`checkCourseStudent/${props.studentId}/${props.infoCourse.id}`)
      setIdJoin(check.data.response)
    }catch(e){
      console.log(e)
    } 
  }   

  useEffect(()=>{
    getCheckCourseStudent()
  },[])


  const removeCourse = async () => {
    try{
      await api.delete(`delCourseStudent/${idJoin}`)
      props.setUpdate(idJoin == null ? 0 : idJoin)
      props.setRemoveCourse(null)

    }catch(err){
      console.log(err)
    }
  }


  return(
    <Modal component={
      <div className="flex flex-col p-2">
        <TitleModal 
          icon='faTrash' 
          close={()=>props.setRemoveCourse(null)} 
          title='Remover Curso'
          subtitle={`Remover o acesso do curso ${props.infoCourse.name} do aluno ${props.studentName}`}/>

        <p className="text-white font-xl mt-8 mx-4 mb-4">
          Confirmar a remoção do curso <b>{props.infoCourse.name}</b>
        </p>
        <div className="flex border-t mt-4 p-2 justify-end items-center">
          <Button name="Cancelar" btn="muted"  type='outline' onClick={()=>props.setRemoveCourse(null)} />
          { idJoin == null ? <LoadingBars/> : <Button name="Sim, Remover" icon="faTrash" btn="error" onClick={()=>removeCourse()} /> }
        </div> 
        
        
      </div>}/>
    
  )
}