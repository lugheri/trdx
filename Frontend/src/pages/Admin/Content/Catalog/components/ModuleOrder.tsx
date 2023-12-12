import { useState } from "react";
import { Button } from "../../../../../components/Buttons";
import { Modal, TitleModal } from "../../../../../components/Modal";
import { IModuleCourse } from "../../Dtos/courses.dto";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from "../../../../../services/api";

type ModuleOrderComponent = {
  course_id:number,
  close:React.Dispatch<React.SetStateAction<number|null>>,
  modules:IModuleCourse[]
}


export const ModuleOrder : React.FC<ModuleOrderComponent> = (props) => {
  const [ orderedModule, setOrderedModule] = useState(props.modules)


  const onDragEnd  = (result:any) => {
    if (!result.destination) {
      return; // se o item foi solto fora de uma área de destino, não faz nada
    }
    const newModules = Array.from(orderedModule);
    const [removedModule] = newModules.splice(result.source.index, 1);
    newModules.splice(result.destination.index, 0, removedModule);
    setOrderedModule(newModules);

    newModules.map((m,i)=>
      updateOrder(m.id,m.visibility,i+1)
    )

  }

  const updateOrder = async (module_id:number,visibility:number,order:number) => {
    try{
      await api.patch(`editModuleCourse/${module_id}`,{visibility:visibility,order:order})

    }catch(e){console.log(e)}
  }


  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal icon="faSortNumericAsc" title="Configure a Ordem dos Módulos" close={()=>props.close(null)}/>
       
        {props.modules.length === 0 
        ? <div className="flex flex-col justify-center items-center w-full p-4 ">
            <FontAwesomeIcon className="text-teal-500/60 text-4xl my-2" icon={Fas.faCube}/>
            <p className="text-white font-light my-4">Este curso ainda não possui nenhum módulo</p> 
          </div>
        : <DragDropContext onDragEnd={onDragEnd}> 
            <Droppable droppableId="modules"> 
              {(provided) => 
                <div ref={provided.innerRef} {...provided.droppableProps} 
                     className="flex bg-neutral-950/50 max-h-[400px] overflow-auto flex-wrap rounded my-2 p-2">
                  { orderedModule.map((module,key)=>
                    <Draggable key={module.id} draggableId={module.id.toString()} index={key}>
                      {(provided) => (<div className="w-full" ref={provided.innerRef} {...provided.draggableProps}{...provided.dragHandleProps}>
                        <ModuleItem module={module} index={key}/>
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


type ModuleItemComponent = {
  module:IModuleCourse,
  index:number
}
const ModuleItem : React.FC<ModuleItemComponent> = (props) => {
  return(    
      <div className={`flex justify-between items-center w-full p-4 m-1 rounded
                      border bg-gray-800/50 hover:bg-gray-800 text-white
                      ${props.module.visibility == 1 ? "border-teal-500" : "border-red-500" }`}>
        <p className="text-xs font-light text-center">
          <FontAwesomeIcon className={`text-teal-500/50 text-xl mr-2 ${props.module.visibility == 1 ? "text-teal-500/50" : "text-red-500/50" }`}
          icon={ props.module.type_module == 'Fase' ? Fas.faPlay : props.module.type_module == 'Módulo' ? Fas.faFolder :  Fas.faGift}/>
          Tipo: {props.module.type_module} Cod: {props.module.id}
        </p>
        <p className="text-sm my-3 text-center">{props.module.module}</p>
        {props.module.visibility == 1 ? <b className="text-teal-500">Público</b> 
        : <b className="text-red-500">Privado</b>} 
        <p className={`${props.module.visibility == 1 ? "text-teal-500/50" : "text-red-500/50" }`}>
          {props.index+1}º
        </p>
      </div> 
  )
}