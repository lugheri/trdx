import { useState, useEffect,useRef  } from 'react';
import { IModules } from '../../Dtos/courses.dto';
import api from '../../../../services/api';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import Slider, { Settings } from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Loading } from '../../../../components/Loading';
import { useNavigate } from 'react-router-dom';

type ModulesCourseComponent = {
  courseId:number,
  userId:number
}
export const ModulesCourse : React.FC<ModulesCourseComponent> = (props) => {
  const sliderRef = useRef<Slider|null>(null);


  const [ modules, setModules ] = useState<IModules[]|null>(null)
  const getModules = async () => {
    try{
      const mdl = await api.get(`modulesCourse/${props.courseId}`) 
      setModules(mdl.data.response)
    }catch(e){console.log(e)}
  }
  useEffect(()=>{getModules()},[])
 
  const settings: Settings = {   
    centerMode: false,
    infinite: false, // Torna o carrossel infinito
    slidesToShow: 2, // Número de slides visíveis de cada vez
    slidesToScroll: 1, // Número de slides a rolar por vez     
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2
        }
      },      
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return(
    <div className="flex justify-center w-full relative h-[50vh] mt-[45vh] mb-[100px]">
      {modules === null ? <Loading/> 
      : <>
          <div className="w-[90%]">      
            <Slider ref={sliderRef} {...settings}>        
              { modules.map((module,key)=>
                <ModuleCard key={key} module={module} userId={props.userId} />
              )}     
            </Slider>
          </div>
              
      </>
      }        
    </div>
    )
}


const ModuleCard : React.FC<{module:IModules,userId:number}> = (props) => {
  const [ progressModule, setProgressModule] = useState(0);
  useEffect(()=>{
    const getProgressModule = async () => {
      try{
        const prog = await api.get(`progressModule/${props.module.id}/${props.userId}`)
        setProgressModule(prog.data.response)        
      }catch(e){
        console.log(e)
      }
    }
    getProgressModule()
  },[])

  const navigate = useNavigate();  
  const openModule = () => {
    const hash_lessonId: string = btoa(`[{"courseId":"${props.module.course_id}","moduleId":"${props.module.id}"}]`);
    navigate(`/classRoom/course/lesson/${hash_lessonId}`)
  }

  return(
    <div 
      onClick={()=>openModule()}
      className="blur-background flex flex-col justify-between py-4 items-center w-[300px] md:w-[250px] mr-2 rounded shadow shadow-slate-600 h-[50vh] hover:bg-neutral-800 cursor-pointer duration-150 ease-out">
      <div className="flex flex-col flex-1 w-full justify-center item-center">
        <FontAwesomeIcon className="text-4xl mb-2 text-[#2eff2a]" icon={Fas.faChalkboard}/>
        <p className="font-bold text-neutral-200 text-center">{props.module.module}</p>
        <p className="text-neutral-400 text-sm mx-2 mt-2 font-light text-center">{props.module.description}</p>
      </div>
      <div className="flex rounded-full overflow-hidden bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] h-[18px] w-[90%] p-[1px]">
        <div className="flex items-center h-full w-full bg-neutral-700  shadow rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-l from-[#24ff0055] to-[#2eff2a] duration-1000 ease-out" style={{width:`${progressModule}%`}}></div>
          <p className="absolute w-full left-0 top-0 justify-center text-xs font-bold text-black h-full flex items-center">{progressModule}% Concluido</p>
        </div>
      </div>
      
    </div>
  )
}
