import { createContext, useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContextType,User,Student,AuthProviderProps,TokenProps } from './Dtos/auth.dto';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [ userData, setUserData] = useState<User | Student | null>(null);
  const [ authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [ token, setToken] = useState<boolean | null>(null);
  const [ typeAccess, setTypeAccess] = useState<'Adm' | 'Student' | null>(null);
  const [ levelAccess, setLevelAccess] = useState<number>(0);

  //Validation Data
  const validation = async () => {
    if(localStorage.getItem('Token')){
     
      try{
        const verificateValidationToken = await api.get('/validation',{
          headers: {            
            authorization: localStorage.getItem('Token')
          }
        })
        if(verificateValidationToken.data){
          const dataToken:TokenProps = verificateValidationToken.data;    
       
          if(dataToken.typeAccess == 'Adm'){
            const getUserData = await api.get(`/getUser/${dataToken.userId}`, {
              headers: {
                authorization: localStorage.getItem('Token')
              }
            });
            console.log('GetUserData',getUserData.data.response,`/getUser/${dataToken.userId}`)   
            setUserData(getUserData.data.response)           
            const credential = userData ? await api.get(`/getCredential/${userData.credential}`) : null
            setLevelAccess(credential ? credential.data.response.level_id : 0)
          }else{
            const getStudentData = await api.get(`/getStudent/${dataToken.userId}`, {
              headers: {
                authorization: localStorage.getItem('Token')
              }
            });
            setUserData(getStudentData.data.response)
          }                  
         
          setAuthenticated(true)
          setToken(true)
          setTypeAccess(dataToken.typeAccess)
          return
        }
      }catch(err){
        console.log(err)
      }
    }
    localStorage.removeItem('Token');
    setUserData(null);
    setAuthenticated(false)
    setTypeAccess(null)
    setToken(false)
  }
  
  useEffect(()=>{
    validation()
  },[token])
  
  const contextValue:AuthContextType = {authenticated, userData, typeAccess, levelAccess}    
  return(
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )

}