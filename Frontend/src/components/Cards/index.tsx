import { CardType } from "../Dtos/cards.dto"

export const Card: React.FC<CardType> = (props) => {
  return(
    <div className={`flex p-4 shadow bg-slate-50 dark:bg-gray-800 rounded-md m-2 ${props.className}`}>
      {props.component}
    </div>
  )

}