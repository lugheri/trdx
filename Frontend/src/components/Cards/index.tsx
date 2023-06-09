import { CardType } from "../Dtos/cards.dto"

export const Card: React.FC<CardType> = (props) => {
  return(
    <div className={`flex p-4 shadow bg-white dark:bg-gray-800 rounded-md m-2 ${props.className}`}>
      {props.component}
    </div>
  )

}