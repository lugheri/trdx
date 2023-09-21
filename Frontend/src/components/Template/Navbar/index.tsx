import useAuth from "../../../hooks/useAuth";
import api from "../../../services/api";
import { ToggleDarkMode } from "../../Buttons"
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { NavLink, useLocation} from 'react-router-dom';
import { NavLinkProps, itemSide } from "../../Dtos/sidebar.dto";

export const Navbar = () => {
  return (
    <>
      <div className="text-white flex justify-end items-center px-4 h-14">
        {/*ACTIONS*/}
        <div className="flex justify-center items-center">                 
          <div className="group opacity-50 text-xl p-2 hover:opacity-100 cursor-pointer mx-2 flex justify-center items-center">
            <FontAwesomeIcon className="text-gray-300 block group-hover:hidden" icon={Fas.faDoorClosed}/>
            <FontAwesomeIcon className="text-red-800 hidden group-hover:block" icon={Fas.faDoorOpen}/>
            <p className="mx-2 text-sm group-hover:text-red-500">Sair</p>
          </div>
          {/*PROFILE*/}         
          
        </div>  
      </div>
      
    </>
  )
}
