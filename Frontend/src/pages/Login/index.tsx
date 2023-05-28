import { FormEvent,useState,useEffect } from "react"
import api from "../../services/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";

export const Login = () => {
  return (
    <div className="bg-white dark:bg-slate-800">
      <h1>Login ST</h1>
    
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