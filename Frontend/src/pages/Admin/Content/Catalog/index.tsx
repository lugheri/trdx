import { useState, useEffect } from 'react';

import { ICourse } from '../../../Dtos/courses.dto';

import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"
import { Card } from '../../../../components/Cards';
import api from '../../../../services/api';
import { Loading } from '../../../../components/Loading';

export const Catalog = () => {
  const novoCurso = () => {
    alert('Novo Curso')
  }
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faChalkboard" 
        title="Catálogo" 
        description="Cátalogo de Cursos"
        rightComponent={
          <div className="flex">
            <Button btn='info' name="Criar Novo Curso" icon="faPlus" onClick={()=>novoCurso()}/>
          </div>
        }/>

      {/*BODY */}  
      <Card component={<ListCourses/>}/>

    </div>
  )
}

const ListCourses : React.FC  = () => {
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
      <div className="bg-slate-300 dark:bg-slate-950 overflow-hidden p-2 rounded">
        { listCourses === null ? <Loading/>
        : listCourses.map((course,key)=>(
          <div key={key} className="dark:bg-slate-500 bg-white shadow-md m-2 block float-left w-[23%] p-4 rounded h-[250px]">
            {course.name}
          </div>
        ))}  
      </div>
    </div>
  )
}