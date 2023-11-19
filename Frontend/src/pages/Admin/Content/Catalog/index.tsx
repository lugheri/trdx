import { useState } from 'react';

import { Button } from "../../../../components/Buttons"
import { TitlePage } from "../../../../components/Template/TitlePage"
import { Card } from '../../../../components/Cards';

import { CourseCreate } from './components/CourseCreate';
import { CourseList } from './components/CourseList';
import { CourseSetup } from './components/CourseSetup';


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
      { newCourse ? <CourseCreate setOpenCourse={setOpenCourse} setNewCourse={setNewCourse}/>
      : openCourse ? <CourseSetup openCourse={openCourse} setOpenCourse={setOpenCourse}/>
      : <div className="flex flex-col"> 
          <Card component={<CourseList published={1} openCourse={openCourse} setOpenCourse={setOpenCourse}/>}/>
          <Card component={<CourseList published={0} openCourse={openCourse} setOpenCourse={setOpenCourse}/>}/>
        </div>}
          
    </div>
  )
}