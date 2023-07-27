import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Loading = () => {
 
  return (
    <div className="flex flex-1 justify-center items-center">
      <FontAwesomeIcon icon={Fas.faCircleNotch} pulse/>
    </div>
  )
}