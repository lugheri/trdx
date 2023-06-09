import { useState, useEffect } from 'react';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from '../../components/Buttons';
import { Card } from '../../components/Cards';
import { TitlePage } from '../../components/Template/TitlePage';
import api from '../../services/api';
import { User } from '../../contexts/Dtos/auth.dto';
import { Modal } from '../../components/Modal';

export const Users = () => {

  const newUser = () => {
    //
  }
  
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage 
        icon="faUsers" 
        title="Usuários" 
        description="Gerencie os usuários administrativos"
        rightComponent={<Button btn="success" border='circle' icon="faUserPlus" name="Novo Usuário" onClick={()=>newUser()} /> }/>
      
      {/*BODY */}
      <div className="flex">
        <Card className="w-2/3" component={<UserList />}/>
        <Card className="flex-1" component={<SearchUsers/>}/>
      </div>
      <Card className="" component={<InactiveUsers />}/>
    </div>
  )
}


const UserList = () => {
  const [users, setUsers] = useState<User[]>([])
  const getUsers = async () => {
    try{
      const users = await api.post('listUsers',{})
      setUsers(users.data.response)
      console.log('USERS',users)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    getUsers()
  },[])

  //Edit User
  const [ editUser, setEditUser] = useState<number|boolean>(false)

  return(
    <div className="h-[300px] overflow-auto flex-1 flex flex-col">
      <p className="text-slate-500 dark:text-slate-300 font-semibold">
        {users.length>0 ? (<>{users.length} Usuário(s) localizado(s)!</>) : (<>Nenhum usuário localizado</>) }
      </p>
      <table>
        <thead className="text-sm text-gray-500 ">
          <tr>
            <th className="py-2">Id</th>
            <th className="py-2">Nome</th>
            <th className="py-2">Email</th>
            <th className="py-2">Logado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.length==0 ? (<tr><td colSpan={5} className="text-center p-5 text-slate-500">Nenhum usuário localizado</td></tr>) 
          : users.map((user,key)=>(
            <tr key={key} className="odd:bg-gray-200 odd:dark:bg-gray-900 dark:text-slate-100 text-center">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.mail}</td>
              <td className="p-2">{user.logged == 1 ? 'Logado' : 'Deslogado'}</td>
              <td className="p-2">
                <Button icon="faPenToSquare" size='sm' btn='info' type='notline' title="Editar Usuário"
                         onClick={()=>setEditUser(user.id)}/>
              </td>
            </tr>
          )) }

        </tbody>
      </table>
      {/* MODAIS */} 
      { editUser ? (<Modal component={<EditUser userId={editUser} open={setEditUser}/>}/>) : false}    
    </div>
  )
}
const SearchUsers = () => {
  return(
    <div className="h-[300px]">
      Busca
    </div>
  )
}
const InactiveUsers = () => {
  return(
    <div className="h-[300px]">
      Inativos
    </div>
  )
}

const EditUser : React.FC<{userId:number| boolean;open: React.Dispatch<React.SetStateAction<number| boolean>>;}> = (props) => {
  return(
    <div>
      <p>Editar Usuário : {props.userId}</p>
      <Button icon="faTimes" size='sm' btn='muted' onClick={()=>props.open(false)}/>
    </div>
  )
}