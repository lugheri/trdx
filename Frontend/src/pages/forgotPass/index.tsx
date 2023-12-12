
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FormEvent, useState } from "react"
import Brand from '/img/logo.png'
import { Link } from "react-router-dom";
import api from "../../services/api";

export const ForgotPass = () => {
  const [ checkMail, setCheckMail ] = useState<boolean|null>(null)
  const [ mail, setMail ] = useState("")
  const newPass = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const dataStudent = await api.get(`checkMailStudent/${mail}`)
      console.log(dataStudent.data)
      setCheckMail(dataStudent.data.success ? true :false)
      dataStudent.data.success && await api.get(`resetPassLogin/${dataStudent.data.success}/${mail}`)


      setMail("")
    }catch(e){console.log(e)}
  }
  return (
    <div className="flex flex-col bg-[#090909] h-screen justify-center items-center">
      <img src={Brand} className="w-[50%] md:w-[12%] mb-8"/>
      <form onSubmit={newPass}  className="bg-white/10 border border-neutral-500 rounded-xl w-[80%] md:w-[30%] p-4 flex flex-col items-center">
        <p className="my-6 text-white text-2xl">RESET DE SENHA</p>
        { checkMail === null 
        ?
          <>
            <div className="w-[80%] mt-2 overflow-hidden rounded-md flex bg-white justify-between items-center">
              <div className="flex justify-center items-center p-2 text-gray-400">
                <FontAwesomeIcon icon={Fas.faUser}/>
              </div>              
              <input 
                type="email"  
                placeholder="E-mail de Cadastro"
                required       
                value={mail}
                onChange={(e)=>setMail(e.target.value)}         
                className="w-full border-0 focus:border-b-4 focus:border-[#3CF400] focus:ring-0 dark:focus:border-zinc-300"/>
            </div>
            <p className="text-center m-2 text-sm p-4 text-gray-200">
              Um e-mail com instruções para recuperar seu acesso será enviado. Confira sua caixa de entrada e caixa de spam.
            </p>          
            <button 
              type="submit" 
              className="w-[80%] rounded-md font-semibold mt-2 mb-2 p-3 bg-gradient-to-r from-[#3CF400] to-[#73CB00]">
              Recuperar Senha
            </button>
          </>
        : checkMail === true 
          ? 
            <>
              <FontAwesomeIcon className="text-5xl m-2 text-green-500" icon={Fas.faPaperPlane}/>
              <p className="text-center m-2 text-sm p-4 text-gray-200">
                Os seus novos dados de acesso foram enviados para seu e-mail. Confira sua caixa de entrada e caixa de spam.
              </p>
            </>
          : checkMail === false &&
            <>
             <div className="w-[80%] mt-2 overflow-hidden rounded-md flex bg-white justify-between items-center">
              <div className="flex justify-center items-center p-2 text-gray-400">
                <FontAwesomeIcon icon={Fas.faUser}/>
              </div>              
              <input 
                type="email"  
                placeholder="E-mail de Cadastro"
                required       
                value={mail}
                onChange={(e)=>setMail(e.target.value)}         
                className="w-full border-0 focus:border-b-4 focus:border-[#3CF400] focus:ring-0 dark:focus:border-zinc-300"/>
              </div>
              <p className="text-center m-2 text-sm p-4 text-red-400">
                Não encontramos nenhum aluno com o e-mail informado, confira seus dados e tente novamente!
              </p>          
              <button 
                type="submit" 
                className="w-[80%] rounded-md font-semibold mt-2 mb-2 p-3 bg-gradient-to-r from-[#3CF400] to-[#73CB00]">
                Recuperar Senha
              </button>
            </>
        }
        <div className="flex w-[80%] px-2 justify-center">
          <Link 
            to={`/`} 
            className="text-white hover:text-[#3CF400] text-sm cursor-pointer my-4">
              Entrar
          </Link>    
        </div> 
        {checkMail != true &&
        <p className="text-gray-400 my-8 text-sm">
          Ainda não é um assinante? <a href="https://otraderquemultiplica.com.br/" className="hover:text-white hover:font-bold" target="blank">Aperte aqui!</a>
        </p>}
      </form>  
      <p className="text-gray-400 font-light mt-8 text-sm text-center">Você tem alguma dúvida? Mande um e-mail para suporte@otraderquemultiplica.com.br</p>
    </div>
  )
}