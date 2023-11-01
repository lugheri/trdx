import { FormEvent,useState,useEffect } from "react"
import api from "../../services/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";

import Brand from '/img/logo.png'
import LogoX from '/img/logoFooter.png'
import { Link, useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loading";

export const Login = () => {
  const [ username, setUsername ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')

  const [ ErrorAuth, setErrorAuth ] = useState<boolean>(false)
  const [ messageErrorAuth, setMessageErrorAuth ] = useState<string>('')
  const [ causeErrorAuth, setCauseErrorAuth ] = useState<string>('')

   const requestFullscreen = () => {
    const element = document.documentElement;
    element.requestFullscreen && element.requestFullscreen(); 
  };


  const sendAuth = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const response = await api.post('/loginStudent', {
        username: username,
        password: password
      });
      if(response.data.success){
        localStorage.setItem('Token', response.data.token);
        window.location.reload();
      }else{
        setErrorAuth(true)
        setMessageErrorAuth(response.data.error.issues[0].message )
        setCauseErrorAuth('Verifique seus dados e tente novamente!')
      }
    }catch(err:any) {
      console.log(err)
      setErrorAuth(true)
      setMessageErrorAuth('Não foi possível efetuar o login')
      setCauseErrorAuth(err.message)
    }
  }

  return (
    <div className="flex flex-col bg-login-mobile-bg bg-center md:bg-top md:bg-login-bg bg-cover bg-no-repeat h-screen justify-center items-center">
       <img src={Brand} className="w-[50%] md:w-[12%] mb-8"/>
       <form onSubmit={sendAuth}  className="blur-background w-[80%] md:w-[25%] p-4 flex flex-col items-center">
        <p className="my-6 text-white text-xl">FAÇA SEU LOGIN</p>
        <div className="w-[80%] mt-2 overflow-hidden rounded-md flex input_login justify-between items-center">
          <div className="flex w-[50px] justify-center items-center p-2 text-gray-400">
            <FontAwesomeIcon icon={Fas.faUser}/>
          </div>              
          <input 
            type="text"  
            placeholder="Email de Cadastro"   
            value={username} onChange={(e)=>{setUsername(e.target.value)}}
            required             
            className="w-full bg-transparent text-white font-light text-sm placeholder:text-gray-400 border-0 focus:border-0 focus:ring-0"/>
        </div>
        <div className="w-[80%] mt-2 overflow-hidden rounded-md flex input_login justify-between items-center">
          <div className="flex w-[50px] justify-center items-center p-2 text-gray-400">
            <FontAwesomeIcon icon={Fas.faKey}/>
          </div>              
          <input 
            type="password"  
            placeholder="Senha"
            value={password} onChange={(e)=>{setPassword(e.target.value)}}
            required                
            className="w-full bg-transparent text-white font-light text-sm placeholder:text-gray-400 border-0 focus:border-0 focus:ring-0"/>
        </div>  
        <div className="flex w-[80%] px-2 justify-center">
          <Link  
            to={`/forgotPass`} 
            className="text-white hover:text-[#999999] text-sm cursor-pointer my-4" >
            Esqueceu a senha?
          </Link>           
        </div>    
        <button 
          type="submit" 
           onClick={requestFullscreen}
          className="w-[80%] md:hidden text-sm rounded-md font-semibold mb-4 p-3 bg-gradient-to-r from-[#3CF400] to-[#73CB00]">
          Acessar comunidade
        </button>  
         <button 
          type="submit" 
          className="w-[80%] hidden md:inline text-sm rounded-md font-semibold mb-4 p-3 bg-gradient-to-r from-[#3CF400] to-[#73CB00]">
          Acessar comunidade
        </button>  
        {ErrorAuth ? ( 
          <strong 
            title={causeErrorAuth} 
            className="border-red-800 border-2 rounded text-center text-xs mx-8 text-red-700 py-4 px-3 rounded-full shadow-md mb-4">
            <FontAwesomeIcon icon={Fas.faExclamationTriangle}/> { messageErrorAuth }
          </strong>)
        :false} 
      </form>   
    </div>
  )
}

export const LoginOldStudent = () => {
  const [ username, setUsername ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')

  const [ ErrorAuth, setErrorAuth ] = useState<boolean>(false)
  const [ messageErrorAuth, setMessageErrorAuth ] = useState<string>('')
  const [ causeErrorAuth, setCauseErrorAuth ] = useState<string>('')
  const sendAuth = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const response = await api.post('/loginStudent', {
        username: username,
        password: password
      });
      if(response.data.success){
        localStorage.setItem('Token', response.data.token);
        window.location.reload();
      }else{
        setErrorAuth(true)
        setMessageErrorAuth(response.data.error.issues[0].message )
        setCauseErrorAuth('Verifique seus dados e tente novamente!')
      }
    }catch(err:any) {
      console.log(err)
      setErrorAuth(true)
      setMessageErrorAuth('Não foi possível efetuar o login')
      setCauseErrorAuth(err.message)
    }
  }
  return(
    <div className="flex flex-col">
      <div className="bg-login-bg h-[80vh] bg-cover bg-center flex flex-col justify-center items-center">
        <img src={Brand} className="w-36"/>
        <div className="bg-[#101010] mt-4 rounded-xl w-[80%] md:w-1/4 py-4">
          <div className="p-4 text-center text-[#636363] font-semibold text-sm">FAÇA SEU LOGIN</div>
          <div className="h-1 bg-gradient-to-r from-[#3CF400] to-[#73CB00]"></div>
          <form onSubmit={sendAuth} className="p-4 flex flex-col justify-center items-center">
            <div className="w-[70%] mt-2 overflow-hidden rounded-md flex bg-white justify-between items-center">
              <div className="flex w-[50px] justify-center items-center p-2 text-slate-400">
                <FontAwesomeIcon icon={Fas.faUser}/>
              </div>              
              <input 
                type="text"  
                placeholder="Email de Cadastro"   
                value={username} onChange={(e)=>{setUsername(e.target.value)}}
                required             
                className="w-full border-0 focus:border-b-4 focus:border-[#3CF400] focus:ring-0 dark:focus:border-zinc-300"/>
            </div>

            <div className="w-[70%] mt-2 overflow-hidden rounded-md flex bg-white justify-between items-center">
              <div className="flex w-[50px] justify-center items-center p-2 text-slate-400">
                <FontAwesomeIcon icon={Fas.faKey}/>
              </div>              
              <input 
                type="password"  
                placeholder="Senha"
                value={password} onChange={(e)=>{setPassword(e.target.value)}}
                required                
                className="w-full border-0 focus:border-b-4 focus:border-[#3CF400] focus:ring-0 dark:focus:border-zinc-300"/>
            </div>        
            <Link  to={`/forgotPass`} className="text-[#636363] hover:text-[#999999] text-sm cursor-pointer my-4" >Esqueceu a senha?</Link>  
            <button type="submit" className="w-[70%] rounded-md font-semibold mb-4 p-3 bg-gradient-to-r from-[#3CF400] to-[#73CB00]">
              Entrar
            </button>
            {ErrorAuth ? ( 
            <strong title={causeErrorAuth} className="border-red-800 border-2 rounded text-center text-xs mx-8 text-red-700 py-4 px-3 rounded-full shadow-md mb-4">
              <FontAwesomeIcon icon={Fas.faExclamationTriangle}/> { messageErrorAuth }
            </strong>)
            :false}
          </form>
        </div>
      </div>     
      <div className="bg-[#070707] h-[20vh] text-white flex items-center flex-col p-6">
        <p className="text-xs">Copyright 2023 © Todos os Direitos Reservados</p>
        <p className="text-xs">SevenX Treinamentos</p>    
        <img src={LogoX} className="w-8 m-2"/>
      </div>
    </div>
  )
}

export const LoginAdm = () => {
  const [ username, setUsername ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')

  const [ ErrorAuth, setErrorAuth ] = useState<boolean>(false)
  const [ messageErrorAuth, setMessageErrorAuth ] = useState<string>('')
  const [ causeErrorAuth, setCauseErrorAuth ] = useState<string>('')


  const sendAuth = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const response = await api.post('/login', {
        username: username,
        password: password
      });
      if(response.data.success){
        localStorage.setItem('Token', response.data.token);
        window.location.reload();
      }else{
        setErrorAuth(true)
        setMessageErrorAuth(response.data.error.issues[0].message)
        setCauseErrorAuth('Verifique seus dados e tente novamente!')
      }
    }catch(err:any) {
      console.log(err)
      setErrorAuth(true)
      setMessageErrorAuth('Não foi possível efetuar o login')
      setCauseErrorAuth(err.message)
    }
  }

 
  return (
    <div className="bg-cyan-950 h-screen flex justify-end items-center ">
      <div className="px-1 w-1/3 h-auto  mr-10">
        <p className="text-white text-4xl font-bold mb-5">
          Área Administrativa
        </p>
        <p className="text-cyan-200 font-light mb-10 ">
          Bem-vindo à área administrativa da plataforma. Por favor, faça o login para acessar as ferramentas de administração e gerenciamento.
        </p>
        <form onSubmit={sendAuth} className="flex flex-col">
          <input type="text" required name="username" value={username} onChange={(e)=>{setUsername(e.target.value)}}
                 className="bg-cyan-900 mb-5 rounded-md border-0 text-cyan-50 text p-2 mx-10
                            placeholder:italic placeholder:text-cyan-100 placeholder:opacity-70
                            focus:bg-cyan-900 focus:border-b-4 focus:border-t-0 focus:border-x-0 focus:border-b-cyan-200 focus:ring-0" 
                            
                 placeholder="Usuário"/>
          <input type="password" required name="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}
                 className="bg-cyan-900 mb-5 rounded-md border-0 text-cyan-50 text p-2 mx-10
                            placeholder:italic placeholder:text-cyan-100 placeholder:opacity-70
                            focus:bg-cyan-800 focus:border-b-4 focus:border-t-0 focus:border-x-0 focus:border-b-cyan-200 focus:ring-0" 
                            
                 placeholder="Senha"/>
          <button 
            type="submit"            
            className="text-cyan-950 mx-20 font-bold bg-green-500 rounded-xl p-2 text-lg shadow-md mb-5 transition duration-150 ease-out
                       hover:bg-green-600 hover:text-cyan-100 hover:ease-in">
            LOGIN           
          </button>
          {ErrorAuth ? ( 
            <strong title={messageErrorAuth} className="bg-red-800 text-center mx-8 text-white py-4 px-2 rounded-md shadow-md mb-4">
              <FontAwesomeIcon icon={Fas.faExclamationTriangle}/> { causeErrorAuth }
            </strong>)
            :false}

        </form>
        <div className="text-center">
          <button className="text-cyan-600 text nmy-5 py-3 px-4 transition duration-150 ease-out 
                              hover:text-cyan-300 hover:ease-in">
            Esqueceu a Senha?
          </button>
          <div className="mt-32">
            <a className="mx-5 text-cyan-300 hover:text-cyan-200" href="#">Suporte</a>
            <a className="mx-5 text-cyan-300 hover:text-cyan-200" href="#">Termos de uso</a>
            <a className="mx-5 text-cyan-300 hover:text-cyan-200" href="#">Politica de Privacidade</a>
          </div>         
        </div>        
      </div>
    </div>
  )
}

export const Logoff = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    localStorage.removeItem('Token')
    navigate(`/`)
    setTimeout(()=>{window.location.reload();},1000)
  },[])


  return(<Loading/>)
}