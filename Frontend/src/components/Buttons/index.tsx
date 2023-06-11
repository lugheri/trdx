import { ButtonType, ToggleType } from "../Dtos/buttons.dto"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import useTheme from '../../hooks/useTheme';

export const Toggle: React.FC<ToggleType> = (props) => {
  return (
    <div 
    className="bg-blue-700 text-white text-center p-1 w-24 rounded-lg cursor-pointer" 
    onClick={()=>props.setValue(!props.value)}>
      {props.value ? (<>On</>) : (<>Off</>)}
    </div>
  )
}

export const ToggleDarkMode: React.FC = () => {
  const themeProps = useTheme() 

  const changeTheme = () => {
    themeProps === undefined ? false
    : themeProps.theme === "dark" ? themeProps.setTheme("light") : themeProps.setTheme("dark");
  }

  return (
    <div className="flex justify-start items-center py-4 cursor-pointer" onClick={()=>changeTheme()}>
      <div         
        className="flex justify-start items-center bg-blue-400 rounded-full h-[30px] w-[40px] ease-in-out duration-300
                  dark:justify-end dark:bg-gray-800">
        <div className="h-[30px] w-[30px] flex justify-center items-center rounded-full text-lg ease-in-out duration-300
                         text-yellow-300
                         dark:text-blue-300">
          { themeProps === undefined ? false 
            : themeProps.theme === "dark" ? (<FontAwesomeIcon icon={Fas.faMoon}/>) : (<FontAwesomeIcon icon={Fas.faSun}/>) } 
            
        </div> 
            
      </div>
      <p className="text-slate-300 ml-2 hidden dark:inline">Modo Escuro</p>
      <p className="text-slate-600 ml-2 inline dark:hidden">Modo Claro</p>
    </div>
  )

}

export const Button : React.FC<ButtonType> = (props) => {
  const { btn, type, size, border } = props;
  const getClassNames = () => {
    const btnDefault = "bg-[#2ecc71] text-white hover:bg-[#27ae60]"

    const btnInfo = "bg-[#3498db] text-white hover:bg-[#2980b9] border border-[#3498db]"
    const btnOutlineInfo = "border border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white"
    const btnNotlineInfo = "text-[#3498db] hover:bg-[#3498db] hover:text-white"

    const btnSuccess = "bg-[#1abc9c] text-white hover:bg-[#16a085] border border-[#1abc9c]"
    const btnOutlineSuccess = "border border-[#1abc9c] text-[#1abc9c] hover:bg-[#1abc9c] hover:text-white"
    const btnNotlineSuccess = "text-[#1abc9c] hover:bg-[#1abc9c] hover:text-white"

    const btnWarning = "bg-[#e67e22] text-white hover:bg-[#d35400] border border-[#e67e22]"
    const btnOutlineWarning = "border border-[#e67e22] text-[#e67e22] hover:bg-[#e67e22] hover:text-white"
    const btnNotlineWarning = "text-[#e67e22] hover:bg-[#e67e22] hover:text-white"

    const btnError = "bg-[#e74c3c] text-white hover:bg-[#c0392b] border border-[#e74c3c]"
    const btnOutlineError = "border border-[#e74c3c] text-[#e74c3c] hover:bg-[#e74c3c] hover:text-white"
    const btnNotlineError = "text-[#e74c3c] hover:bg-[#e74c3c] hover:text-white"

    const btnMuted = "bg-[#bdc3c7] text-white hover:bg-[#95a5a6] border border-[#bdc3c7]"
    const btnOutlineMuted = "border border-[#bdc3c7] text-[#bdc3c7] hover:bg-[#bdc3c7] hover:text-slate-600"
    const btnNotlineMuted = "text-slate-400 dark:text-[#bdc3c7] hover:bg-[#bdc3c7] hover:text-slate-600 dark:hover:text-slate-800"

    const sizeSM= props.name ? "py-1 px-2 text-xs" : "p-1 text-xs"
    const sizeMD= props.name ? "py-2 px-3 text-sm" :"p-2 text-sm"
    const sizeLG= props.name ? "py-3 px-4 text-lg" : "p-3 text-lg"
    
    const block= "w-full"

    const borderCircle="rounded-full"
    const borderSquare=" "
    const borderRounded="rounded-md"

    const classNames = [
      'flex justify-center m-1 items-center text-center cursor-pointer font-semibold',
      btn === 'info' ? (type === 'outline' ? btnOutlineInfo : (type === 'notline' ? btnNotlineInfo : btnInfo)) :
        (btn === 'success' ? (type === 'outline' ? btnOutlineSuccess : (type === 'notline' ? btnNotlineSuccess : btnSuccess)) :
          (btn === 'warning' ? (type === 'outline' ? btnOutlineWarning : (type === 'notline' ? btnNotlineWarning : btnWarning)) :
            (btn === 'error' ? (type === 'outline' ? btnOutlineError : (type === 'notline' ? btnNotlineError : btnError)) :
              (btn === 'muted' ? (type === 'outline' ? btnOutlineMuted : (type === 'notline' ? btnNotlineMuted : btnMuted)) :
                btnDefault))))
    ];
    classNames.push(size === 'sm' ? sizeSM : (size === 'lg' ? sizeLG : sizeMD));
    classNames.push(border === 'square' ? borderSquare : (border === 'circle' ? borderCircle : borderRounded));
    props.block ? classNames.push(block) : false

    return classNames.join(' ');
  };
  const style = getClassNames();

  return (
    <button 
      type={ props.submit ? "submit" : "button" }
      className={style+" "+props.className}
      title={ props.title ? props.title : ""}
      onClick={props.onClick}>
        { props.icon ? (<FontAwesomeIcon className="m-1" icon={Fas[props.icon] as IconProp}/>) : false}  
        { props.name ? props.name : false}
    </button>
  )
}