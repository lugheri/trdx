import { Button } from "../../components/Buttons"

export const Login = () => {
  return (
    <div className="bg-white dark:bg-slate-800">
      <h1>Login</h1>
     <form>
      <label className="block">
        <span className="block text-sm font-medium text-slate-700">Username</span>
        <input type="email" className="peer"/>
        <p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">Username invalid!</p>
      </label>
     </form>     
    </div>
  )
}

export const LoginAdm = () => {
  return (
    <div className="bg-stone-900 h-screen flex justify-end items-center ">
      <div className="bg-slate-50 p-10 w-1/2 h-auto rounded-md shadow">
        <img src="" alt="logo"/>
        <p>Área Administrativa</p>
        <p>Bem-vindo à área administrativa da plataforma. <br/>Por favor, faça o login para acessar as ferramentas de administração e gerenciamento.</p>
        <form className="flex flex-col">
          <input type="text"/>
          <input type="password"/>
          <button>Autenticar</button>
        </form>
        <button>Esqueceu a Senha</button>
        <div>
          <a href="#">Suporte</a>
          <a href="#">Termos de uso</a>
          <a href="#">Politica de Privacidade</a>
        </div>
        <a href="#">Copyright</a>
      </div>
      
       
    </div>
  )
}