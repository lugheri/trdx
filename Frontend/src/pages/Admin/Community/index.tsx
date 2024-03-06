import { useEffect, useState } from "react";
import { LoadingBars } from "../../../components/Loading";
import { User } from "../../../contexts/Dtos/auth.dto";
import useAuth from "../../../hooks/useAuth";
import { ProfileAdmCommunity } from "./components/ProfileAdmCommunity"
import { SearchMemberResults, SearchMembers } from "./components/SearchMembers";
import { PageMembers } from "./components/PageMembers";
import api from "../../../services/api";
import { Chat } from "./components/Chat";
import { IStudent } from "../Students/Dtos/student.dto";
import { Button } from "../../../components/Buttons";

export const Community = () => {
  const authenticated = useAuth();
  const userData:User|null = authenticated ? authenticated.userData : null 
  const [ searchParams, setSearchParams ] = useState('')
  const [ totalMembers, setTotalMembers ] = useState(0)
  const [ infoMember, setInfoMember ] = useState<IStudent|null>(null)
  const getTotalMembers = async () => {
    try{
      const res = await api.get('totalMembers')
      setTotalMembers(res.data.response)
    }catch(err){console.log(err)}
  }
  useEffect(()=>{getTotalMembers()},[])

  return (
    userData == null ? (
      <LoadingBars/>
    ) : (
      <div className="flex h-full py-1">
        <div className="bg-gray-800 w-1/4 mx-1 rounded-xl flex flex-col overflow-hidden">
          <ProfileAdmCommunity userData={userData}/>
          <SearchMembers totalMembers={totalMembers} searchParams={searchParams} setSearchParams={setSearchParams}/>
          <div className="flex flex-col flex-1 overflow-x-hidden overflow-x-auto">
            { searchParams !== '' ? (
              <SearchMemberResults page={1} params={searchParams} status={1} setInfoMember={setInfoMember}/>
            ) : (
              <PageMembers page={1} status={1} setInfoMember={setInfoMember}/>
            )}
          </div>
        </div>
        <Chat userdata={userData}/>
        { infoMember && (
          <div className="flex flex-col w-1/4 bg-gray-900 mx-1 rounded-xl p-4">
            <div className="flex w-full justify-between items-start">
              <p className="text-white">Info</p>
              <Button name="Fechar" btn="muted" type="notline" onClick={()=>setInfoMember(null)}/> 
            </div>
            <p className="text-white/50 text-xs">Dados do aluno {infoMember.name} ... </p>
          </div>)}
      </div>
    )
  )
}