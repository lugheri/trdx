import useAuth from '../../../hooks/useAuth';
import { Student } from '../../../contexts/Dtos/auth.dto';

//import { urlBase } from '../../../utils/baseUrl';

import { Welcome } from './components/Welcome';
import { NextLesson } from './components/NextLesson';
import { CoursesCarousel } from './components/CoursesCarousel';


import { BannerHome } from './components/BannerHome';

export const Home = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null  

 

  return(
    <div className="relative flex flex-col" 
      style={{/*
        background: `linear-gradient(to bottom,rgba(9, 9, 9, 0),rgba(9, 9, 9, 0.4),rgba(9, 9, 9, 0.6),rgba(9, 9, 9, 0.9), rgba(9, 9, 9, 1), rgba(9, 9, 9, 1), rgba(9, 9, 9, 1)),
                    url(${urlBase}/gallery/bg-text-1.jpg)`,
        backgroundSize:'100% auto',
        backgroundRepeat:'no-repeat'
        */}}>
      <BannerHome/>
      <Welcome studentId={userData ? userData.id : 0} />  
      <NextLesson studentId={userData ? userData.id : 0} />      
      <CoursesCarousel studentId={userData ? userData.id : 0} />   
    </div>
  )
}




















