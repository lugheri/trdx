import useAuth from '../../../hooks/useAuth';
import { Student } from '../../../contexts/Dtos/auth.dto';

import { urlBase } from '../../../utils/baseUrl';

import { Welcome } from './components/Welcome';
import { NextLesson } from './components/NextLesson';
import { CoursesCarousel } from './components/CoursesCarousel';


import { BannerHome } from './components/BannerHome';
import api from '../../../services/api';
import { useEffect } from 'react';

export const Home = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null  

  const checkContracts = async () => {
    try{
      await api.get(`checkValidityStudent/${userData.id}`)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{checkContracts()},[])

 

  return(
    <>
    <div className="relative flex-col hidden lg:flex bg-black" 
      style={{
        backgroundImage: `url(${urlBase}/gallery/bg-home-candles.jpg)`,
        backgroundSize:'100%',
        backgroundRepeat:'no-repeat'
        }}>
      <BannerHome/>
      <Welcome studentId={userData ? userData.id : 0} />  
      <NextLesson studentId={userData ? userData.id : 0} />      
      <CoursesCarousel studentId={userData ? userData.id : 0} />   
    </div>
    <div className="relative flex flex-col pt-28 lg:hidden" 
      style={{
        backgroundImage: `url(${urlBase}/gallery/bg-home-mobile.jpg)`,
        backgroundSize:'100%',
        backgroundRepeat:'no-repeat'
        }}>
      <Welcome studentId={userData ? userData.id : 0} />  
      <NextLesson studentId={userData ? userData.id : 0} />      
      <CoursesCarousel studentId={userData ? userData.id : 0} />   
    </div>

    </>
  )
}




















