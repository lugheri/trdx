import { useState, useEffect } from 'react';
import { ButtonType, ToggleType } from "../Dtos/buttons.dto"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export const Toggle: React.FC<ToggleType> = (props) => {
  return (
    <div 
    className="bg-blue-700 text-white text-center p-1 w-24 rounded-lg cursor-pointer" 
    onClick={()=>props.setValue(!props.value)}>
      {props.value ? (<>On</>) : (<>Off</>)}
    </div>
  )
}

export const Button : React.FC<ButtonType> = (props) => {
  const { btn, type, size, border } = props;
  const getClassNames = () => {
    const btnDefault = "bg-[#2ecc71] text-white hover:bg-[#27ae60]"

    const btnInfo = "bg-[#3498db] text-white hover:bg-[#2980b9]"
    const btnOutlineInfo = "border-2 border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white"
    const btnNotlineInfo = "text-[#3498db] hover:bg-[#3498db] hover:text-white"

    const btnSuccess = "bg-[#1abc9c] text-white hover:bg-[#16a085]"
    const btnOutlineSuccess = "border-2 border-[#1abc9c] text-[#1abc9c] hover:bg-[#1abc9c] hover:text-white"
    const btnNotlineSuccess = "text-[#1abc9c] hover:bg-[#1abc9c] hover:text-white"

    const btnWarning = "bg-[#e67e22] text-white hover:bg-[#d35400]"
    const btnOutlineWarning = "border-2 border-[#e67e22] text-[#e67e22] hover:bg-[#e67e22] hover:text-white"
    const btnNotlineWarning = "text-[#e67e22] hover:bg-[#e67e22] hover:text-white"

    const btnError = "bg-[#e74c3c] text-white hover:bg-[#c0392b]"
    const btnOutlineError = "border-2 border-[#e74c3c] text-[#e74c3c] hover:bg-[#e74c3c] hover:text-white"
    const btnNotlineError = "text-[#e74c3c] hover:bg-[#e74c3c] hover:text-white"

    const btnMuted = "bg-[#bdc3c7] text-white hover:bg-[#95a5a6]"
    const btnOutlineMuted = "border-2 border-[#bdc3c7] text-[#bdc3c7] hover:bg-[#bdc3c7] hover:text-white"
    const btnNotlineMuted = "text-[#bdc3c7] hover:bg-[#bdc3c7] hover:text-white"

    const sizeSM="p-1 text-xs"
    const sizeMD="p-2"
    const sizeLG="p-3 text-lg"

    const borderCircle="rounded-full"
    const borderSquare=" "
    const borderRounded="rounded-lg"

    const classNames = [
      'flex justify-center items-center text-center cursor-pointer font-semibold',
      btn === 'info' ? (type === 'outline' ? btnOutlineInfo : (type === 'notline' ? btnNotlineInfo : btnInfo)) :
        (btn === 'success' ? (type === 'outline' ? btnOutlineSuccess : (type === 'notline' ? btnNotlineSuccess : btnSuccess)) :
          (btn === 'warning' ? (type === 'outline' ? btnOutlineWarning : (type === 'notline' ? btnNotlineWarning : btnWarning)) :
            (btn === 'error' ? (type === 'outline' ? btnOutlineError : (type === 'notline' ? btnNotlineError : btnError)) :
              (btn === 'muted' ? (type === 'outline' ? btnOutlineMuted : (type === 'notline' ? btnNotlineMuted : btnMuted)) :
                btnDefault))))
    ];
    classNames.push(size === 'sm' ? sizeSM : (size === 'lg' ? sizeLG : sizeMD));
    classNames.push(border === 'square' ? borderSquare : (border === 'circle' ? borderCircle : borderRounded));

    return classNames.join(' ');
  };
  const style = getClassNames();

  return (
    <div className={style}
         onClick={props.onClick}>
      { props.icon ? (<FontAwesomeIcon className="m-1" icon={Fas[props.icon] as IconProp}/>) : false}  
      { props.name ? props.name : false}
    </div>
  )
}