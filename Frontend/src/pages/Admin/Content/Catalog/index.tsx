import { useState } from 'react';

import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"
import { Card } from '../../../../components/Cards';

import { NewCourse } from './components/NewCourse';
import { ListCourses } from './components/ListCourses';
import { OpenCourse } from './components/OpenCourse';


export const Catalog = () => {
  const [ newCourse, setNewCourse ] = useState(false)
  const [ openCourse, setOpenCourse ] = useState<null|number>(null)
  return(
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
      { newCourse ? <NewCourse setOpenCourse={setOpenCourse} setNewCourse={setNewCourse}/>
      : openCourse ? <OpenCourse openCourse={openCourse} setOpenCourse={setOpenCourse}/>
      : <Card component={
          <ListCourses 
          setOpenCourse={setOpenCourse}/>}/>}
    </div>
  )
}