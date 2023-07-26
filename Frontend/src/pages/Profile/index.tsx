import { useState } from 'react';
import { ToggleDarkMode } from "../../components/Buttons"
import { Card } from "../../components/Cards"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { InputForm, SelectForm } from '../../components/Inputs';
import { TitlePage } from '../../components/Template/TitlePage';

interface Gender {
  [key: string]: string;
}

export const Profile = () => {
  const [ nome, setNome ] = useState<string>('Nome do Aluno')
  const [ mail, setMail ] = useState<string>('email@aluno.com')
  const [ nasc, setNasc ] = useState<string>('2023-07-25')
  const [ numero, setNumero ] = useState<string>('11 98765-4321')
  const [ sexo, setSexo ] = useState<string>('M')
  const [ options, setOptions ] = useState<Gender[]>([{'id':'M','sexo':'Masculino'},{'id':'F','sexo':'Feminino'}])


  return(
    <div className="flex flex-col">
      <TitlePage 
        icon="faUserCircle" 
        title="Minha Conta" 
        description="Gerencie os seus dados e algumas configurações de sua plataforma"/>
      <div className="flex flex-1">
        <Card className="flex-1" component={
          <div className="flex w-full">
            <div className="p-4 flex flex-col w-1/3">
              <div className="bg-gray-500 h-[250px] rounded flex justify-center items-center">
                Imagem de Perfil
              </div>
              <div className="bg-[#3CF400] p-2 text-center my-2 rounded shadown text-sm font-semibold cursor-pointer">
                <FontAwesomeIcon className="opacity-50" icon={Fas.faUpload}/> Alterar Imagem
              </div>
            </div>
            <form className="p-4">
              <InputForm value={nome} className='border-0 mb-[10px] w-[400px]' placeholder="Nome do Aluno" onChange={setNome} required/>
              <InputForm value={mail} className='border-0 mb-[10px] w-[400px]' placeholder="Email do Aluno" onChange={setMail} required/>
              <InputForm value={nasc} inputType='date' className='border-0 mb-[10px] w-[400px]' placeholder="Data de Nascimento" onChange={setNasc} required/>
              <InputForm value={numero} className='border-0 mb-[10px] w-[400px]' placeholder="Nome do Aluno" onChange={setNumero} required/>
              <SelectForm value={sexo} empty="Selecione um nível" className='border-0 mb-[9px] w-[400px]' valueKey="id" lableKey="sexo" options={options} onChange={setSexo} required/>
              <button type="submit" className="bg-[#3CF400] p-2 text-center my-2 rounded shadown text-sm font-semibold">
                <FontAwesomeIcon className="opacity-50" icon={Fas.faSave}/>  Salvar Dados
              </button>
            </form>          
          </div>}/>

        <Card className="w-[200px]"  component={
          <div className="flex w-full flex-col">
            <label className="text-slate-400 font-bold p-2 border-b border-slate-400 text-sm mb-4"><FontAwesomeIcon icon={Fas.faCog} /> Configurações</label>
            <div className="p-2 text-center w-full rounded shadown bg-orange-300 text-sm font-semibold">
              <FontAwesomeIcon className="opacity-50" icon={Fas.faKey}/>  Resetar Senha
            </div>
            <div><ToggleDarkMode/></div>          
          </div>}/>
      </div>
      <div className="flex">
       <div>{/*Cursos*/}</div>
      </div>
    </div>
  )
}