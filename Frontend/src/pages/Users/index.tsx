import { useState, useEffect } from 'react';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from '../../components/Buttons';

export const Users = () => {

  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <div className="flex p-2 justify-between items-center">
        <div className="p-4 text-slate-500">
          <p className="text-xl font-bold"><FontAwesomeIcon icon={Fas.faUsers}/> Usuários</p>
          <small className="text-sm">Gerencie os usuários administrativos</small>
        </div>
        <Button btn="success" border='circle' icon="faUserPlus" name="Novo Usuário" />   
      </div>

       {/*BODY */}

    </div>
  )
}