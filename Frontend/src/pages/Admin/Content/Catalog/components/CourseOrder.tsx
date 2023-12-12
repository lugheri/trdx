import { useState } from "react";
import { Button } from "../../../../../components/Buttons";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { ICourse } from "../../Dtos/courses.dto";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from "../../../../../services/api";
import { RenderImageGallery } from "../../../../../components/RenderImageGallery";

type CourseOrderComponent = {
  close:React.Dispatch<React.SetStateAction<boolean>>,
  courses:ICourse[]
}
export const CourseOrder : React.FC<CourseOrderComponent> = (props) => {
  const [ orderedCourses, setOrderedCourses] = useState(props.courses)

  const onDragEnd  = (result:any) => {
    if (!result.destination) {
      return; // se o item foi solto fora de uma área de destino, não faz nada
    }
    const newCourses = Array.from(orderedCourses);
    const [removedCourses] = newCourses.splice(result.source.index, 1);
    newCourses.splice(result.destination.index, 0, removedCourses);
    setOrderedCourses(newCourses);
    newCourses.map((c,i)=>
      updateOrder(c.id,i+1)
    )
  }

  const updateOrder = async (course_id:number,order:number) => {
    try{
      const r = await api.patch(`editCourse/${course_id}`,{order:order})
      console.log(r.data)
    }catch(e){console.log(e)}
  }

  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal icon="faSortNumericAsc" title="Configure a Ordem dos Cursos" close={()=>props.close(false)}/>
        {props.courses.length === 0 
        ? <div className="flex flex-col justify-center items-center w-full p-4 ">
            <FontAwesomeIcon className="text-teal-500/60 text-4xl my-2" icon={Fas.faCube}/>
            <p className="text-white font-light my-4">Você ainda não cadastrou nenhum curso</p> 
          </div>
        : <DragDropContext onDragEnd={onDragEnd}> 
            <Droppable droppableId="modules"> 
              {(provided) => 
                <div
                  ref={provided.innerRef} {...provided.droppableProps} 
                  className="flex bg-neutral-950/50 max-h-[400px] overflow-auto flex-wrap rounded my-2 p-2">
                  { orderedCourses.map((course,key)=>
                    <Draggable key={course.id} draggableId={course.id.toString()} index={key}>
                      {(provided) => (
                        <div 
                          className="w-full" 
                          ref={provided.innerRef} {...provided.draggableProps}{...provided.dragHandleProps}>
                          <CourseItem course={course} index={key}/>
                        </div>)}                      
                    </Draggable>                  
                  )}
                  {provided.placeholder}
                </div>             
              }            
            </Droppable>
          </DragDropContext>
        }        
        <div className="flex justify-end">
          <Button name="Fechar" btn="muted" type="notline" onClick={()=>props.close(false)}/>
        </div>
      </div>
    }/>
  )
}

type CourseItemComponent = {
  course:ICourse,
  index:number
}
const CourseItem : React.FC<CourseItemComponent> = (props) => {
  return(    
    <div 
      className={`flex justify-between items-center w-full m-1 rounded h-[100px]
                  bg-gray-800 hover:bg-gray-700 text-white`}>
      <RenderImageGallery className="h-full" imgTag={true} imageId={props.course.default_thumb}/>
   
      <p className="text-sm my-3 text-center">{props.course.name}</p>
      <p className="text-teal-500/50 px-4">
        {props.index+1}º
      </p>
    </div> 
  )
}