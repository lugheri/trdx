import { useState, useEffect } from 'react';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Users = () => {
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <div className="flex p-2 justify-between">
        <div className="p-4">
          <p><FontAwesomeIcon icon={Fas.faUsers}/> Usuários</p>
          <small>Gerencie os usuários administrativos</small>
        </div>
        <div>
          Novo Usuário
        </div>
      </div>

       {/*BODY */}

    </div>
  )
}