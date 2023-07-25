import { FormEvent,useState,useEffect } from "react"
import api from "../../services/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";

import Brand from '/img/logo.png'
import { Link } from "react-router-dom";

export const ForgotPass = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-login-bg h-[80vh] bg-cover bg-center flex flex-col justify-center items-center">
        <img src={Brand} className="w-36"/>
        <div className="bg-[#101010] mt-4 rounded-xl py-4 w-1/4">
          <div className="p-4 text-center text-[#636363] font-semibold text-sm">RESET DE SENHA</div>
          <div className="h-1 bg-gradient-to-r from-[#F40042] to-[#CB001C]"></div>
          <form className="p-4 flex flex-col justify-center items-center">
            <div className="w-[80%] mt-2 overflow-hidden rounded-md flex bg-white justify-between items-center">
              <div className="flex justify-center items-center p-2 text-slate-400">
                <FontAwesomeIcon icon={Fas.faUser}/>
              </div>              
              <input 
                type="text"  
                placeholder="Email de Cadastro"
                required                
                className="w-full border-0 focus:border-b-4 focus:border-[#3CF400] focus:ring-0 dark:focus:border-zinc-300"/>
            </div>
            <p className="text-center m-2 text-sm p-4 text-[#636363]">
              Um email com instruções para recuperar seu acesso será enviado. Confira sua caixa de entrada e caixa de spam.
            </p>
          
            <button type="submit" className="w-[70%] rounded-md font-semibold mt-2 mb-2 p-3 bg-gradient-to-r from-[#3CF400] to-[#73CB00]">
              Recuperar Senha
            </button>
            <Link  to={`/`} className="text-[#636363] hover:text-[#3CF400] text-sm cursor-pointer my-4" >Entrar</Link>  
            
          </form>
        </div>
        <p className="text-[#636363] my-4 text-sm">
          Ainda não é um assinante? <a href="https://otraderquemultiplica.com.br/" className="hover:text-white hover:font-bold" target="blank">Aperte aqui!</a>
        </p>
      </div>    
       
      <div className="bg-[#070707] h-[20vh] flex justify-center items-start">
        <p className="text-[#636363] mt-8 text-sm">Você tem alguma dúvida? Mande um email para suporte@traderquemultiplica.com</p>
      </div>
    </div>
  )
}