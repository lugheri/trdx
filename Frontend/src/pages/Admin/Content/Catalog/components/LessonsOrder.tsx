import { useState } from "react";
import { Button } from "../../../../../components/Buttons";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { ILessonsModule } from "../../Dtos/courses.dto";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from "../../../../../services/api";

type LessonsOrderComponent = {
  module_id:number,
  order_module:number,
  close:React.Dispatch<React.SetStateAction<number|null>>,
  lessons:ILessonsModule[]
}

export const LessonsOrder : React.FC<LessonsOrderComponent> = (props) => {
  const [ orderedLessons, setOrderedLessons] = useState(props.lessons)

  const onDragEnd  = (result:any) => {
    if (!result.destination) {
      return; // se o item foi solto fora de uma área de destino, não faz nada
    }
    const newLessons = Array.from(orderedLessons);
    const [removedLessons] = newLessons.splice(result.source.index, 1);
    newLessons.splice(result.destination.index, 0, removedLessons);
    setOrderedLessons(newLessons);
    newLessons.map((l,i)=>
      updateOrder(l.id,l.module_id,l.visibility,i+1)
    )
  }

  const updateOrder = async (lesson_id:number,module_id:number,visibility:number,order:number) => {
    try{
      const orderLesson = (props.order_module*100)+order
      await api.patch(`editLessonModule/${lesson_id}`,{ module_id:module_id, visibility:visibility,order:orderLesson})

    }catch(e){console.log(e)}
  }

  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal icon="faSortNumericAsc" title="Configure a Ordem das Aulas" close={()=>props.close(null)}/>
        {props.lessons.length === 0 
        ? <div className="flex flex-col justify-center items-center w-full p-4 ">
            <FontAwesomeIcon className="text-teal-500/60 text-4xl my-2" icon={Fas.faCube}/>
            <p className="text-white font-light my-4">Este módulo ainda não possui nenhuma aula</p> 
          </div>
        : <DragDropContext onDragEnd={onDragEnd}> 
            <Droppable droppableId="lessons"> 
              {(provided) => 
                <div ref={provided.innerRef} {...provided.droppableProps} 
                     className="flex bg-neutral-950/50 max-h-[400px] overflow-auto flex-wrap rounded my-2 p-2">
                  { orderedLessons.map((lesson,key)=>
                    <Draggable key={lesson.id} draggableId={lesson.id.toString()} index={key}>
                      {(provided) => (<div className="w-full" ref={provided.innerRef} {...provided.draggableProps}{...provided.dragHandleProps}>
                        <LessonItem lesson={lesson} index={key}/>
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
          <Button name="Fechar" btn="muted" type="notline" onClick={()=>props.close(null)}/>
        </div>
      </div>
    }/>
  )
}


type LessonItemComponent = {
  lesson:ILessonsModule,
  index:number  
}
const LessonItem : React.FC<LessonItemComponent> = (props) => {
  return(    
      <div className={`flex justify-between items-center w-full p-4 m-1 rounded
                      border bg-gray-800/50 hover:bg-gray-800 text-white
                      ${props.lesson.visibility == 1 ? "border-teal-500" : "border-red-500" }`}>
        <p className="text-xs font-light text-center">
          <FontAwesomeIcon className={`text-teal-500/50 text-xl mr-2 ${props.lesson.visibility == 1 ? "text-teal-500/50" : "text-red-500/50" }`}
          icon={ props.lesson.type_lesson == 'Aula' ? Fas.faChalkboardTeacher : Fas.faQuestionCircle}/>
          Tipo: {props.lesson.type_lesson} Cod: {props.lesson.id}
        </p>
        <p className="text-sm my-3 text-center">{props.lesson.name}</p>
        {props.lesson.visibility == 1 ? <b className="text-teal-500">Público</b> 
        : <b className="text-red-500">Privado</b>} 
        <p className={`${props.lesson.visibility == 1 ? "text-teal-500/50" : "text-red-500/50" }`}>
          {props.index+1}º
        </p>
      </div> 
  )
}