import { ModalType } from "../Dtos/modal.dto"

export const Modal:React.FC<ModalType> = (props) => {
  return(    
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-[#000000aa] backdrop-blur-[2px]">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md animate-[modalUp_.5s]">
        {props.component}
      </div>
        
    </div>
  )
}