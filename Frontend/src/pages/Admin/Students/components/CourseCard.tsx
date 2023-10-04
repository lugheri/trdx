import { useState, useEffect } from 'react';
import { Button } from "../../../../components/Buttons";
import api from '../../../../services/api';
import { Loading } from '../../../../components/Loading';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IFileGallery } from '../../../Students/Dtos/gallery.dto';
import { urlBase } from '../../../../utils/baseUrl';
import { Modal, TitleModal } from '../../../../components/Modal';
import { ICourse } from '../../Content/Dtos/courses.dto';

interface ICourseCard{
  id:number;
  image:number;
  name:string;
  studentName:string;
  studentId:number;
  viewMode: 'cells'|'list';
}

export const CourseCard : React.FC<ICourseCard> = (props) => {
  const [ infoImage, setInfoImage ]= useState<IFileGallery|null>(null)
  const [ infoCourse, setInfoCourse ]= useState<ICourse|null>(null)
  useEffect(()=>{
    const getInfoImage = async () => {
      try{
        const info = await api.get(`infoFile/${props.image}`)
        setInfoImage(info.data.response)
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
    getInfoImage()
    props.viewMode == 'list' && infoCourse()

  },[props.viewMode])

   /*Modal Triggers*/
   const [vigency, setVigency] = useState<number|null>(null)
   const [studentEvolution, setStudentEvolution] = useState<number|null>(null)
   const [removeCourse, setRemoveCourse] = useState<number|null>(null)
 



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
    <div className="flex w-full h-[150px] mb-2 bg-neutral-800 rounded-lg overflow-hidden shadow-neutral-950 shadow ">
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
              { infoCourse.description.length > 150 ? infoCourse.description.slice(0, 145) + ' . . . ' : infoCourse.description }
            </p>
          </div>
          <div className="flex justify-between items-center bg-gradient-to-r from-neutral-800 to-neutral-700 w-full p-1">
            <p className="bg-teal-800 text-center text-sm text-white opacity-50 rounded py-1 px-2">
              Plano
            </p>          
            <div className="flex">
              <Button icon="faCalendarCheck" btn='info' name="Vigência" type="notline" size='sm' onClick={()=>setVigency(infoCourse.id)}/>
              <Button icon="faChartLine" btn='info' name="Evolução do Aluno" type="notline" size='sm' onClick={()=>setStudentEvolution(infoCourse.id)}/>
              <Button icon="faTrash" btn='error' name="Remover Curso" type="notline" size='sm' onClick={()=>setRemoveCourse(infoCourse.id)}/>
            </div>
          </div>
        {/*Modais*/}
        { vigency && <Modal component={<div>
                          <TitleModal icon='faCalendarCheck' close={()=>setVigency(null)} 
                                      title='Contratos de Vigência'
                                      subtitle={`Planos de Vigência no curso ${infoCourse.name} do aluno ${props.studentName}`}/>
                                        </div>}/>}

        { studentEvolution && <Modal component={<div>
                          <TitleModal icon='faChartLine' close={()=>setStudentEvolution(null)} 
                                      title='Evolução do Aluno'
                                      subtitle={`Acompanhe a evolução do aluno ${props.studentName} no curso ${infoCourse.name}`}/>
                                        </div>}/>}

        { removeCourse && <Modal component={<div>
                          <TitleModal icon='faTrash' close={()=>setRemoveCourse(null)} 
                                      title='Remover Curso'
                                      subtitle={`Remover o acesso do curso ${infoCourse.name} do aluno ${props.studentName}`}/>
                                        </div>}/>} 
      </div>}       
    </div>
    
  )

}