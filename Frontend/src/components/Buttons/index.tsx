import { ButtonType, ToggleType } from "../Dtos/buttons.dto"

export const Toggle: React.FC<ToggleType> = (props) => {
  return (
    <div className="bg-blue-700 text-white text-center p-1 w-24 rounded-lg cursor-pointer" onClick={()=>props.setValue(!props.value)}>
      {props.value ? (<>On</>) : (<>Off</>)}
    </div>
  )
}

export const Button : React.FC<ButtonType> = (props) => {
  return (
    <div className="bg-blue-700 text-white text-center p-1 w-24 rounded-lg cursor-pointer" onClick={props.onClick}>
      { props.name ? props.name : ("Botão")}
    </div>
  )
}