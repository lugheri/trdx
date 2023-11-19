import { useState, useEffect,useRef  } from 'react';
import { ICourse } from '../../Dtos/courses.dto';
import api from '../../../../services/api';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import Slider, { Settings } from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Loading } from '../../../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { RenderImageGallery } from '../../../../components/RenderImageGallery';

import Logo from '/img/logo.png'

type CoursesCarouselComponent = {
  studentId:number;
}
export const CoursesCarousel : React.FC<CoursesCarouselComponent> = (props)  => {
  const sliderRef = useRef<Slider|null>(null);

  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const [ listAllActiveCourses, setListAllActiveCourses ] = useState<ICourse[]|null>(null)
  const getAllCourses = async () => {
    try{
      const courses = await api.post(`listCourses/`,{"published":1,"status":1})
      setListAllActiveCourses(courses.data.response)
    }catch(e){
      console.log(e)
    }    
  }
  useEffect(()=>{ getAllCourses()},[]) 

 
  const settings: Settings = {
    dots:true,
    centerMode: true,
    infinite: true, // Torna o carrossel infinito
    slidesToShow: 4, // Número de slides visíveis de cada vez
    slidesToScroll: 1, // Número de slides a rolar por vez  
    autoplay: true,
    variableWidth: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,    
    appendDots: (dots: React.ReactNode) => (
      <div
        style={{         
          borderRadius: "10px",
          padding: "10px"
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="dot"></div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
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
    <div className="w-full relative h-[400px] mt-[100px] mb-[100px]">
      {listAllActiveCourses === null ? <Loading/> 
      : <>
          <Slider ref={sliderRef} {...settings}>        
            { listAllActiveCourses.map((course,key)=>
              <Course key={key} infoCourse={course} userId={props.studentId}/>)}     
          </Slider>
          <button 
            className="absolute h-[360px] top-0 px-2 flex justify-center items-center group
                       left-[16%] md:left-20 lg:left-20 2xl:left-24" 
            onClick={previous}>
            <span 
              className="bg-neutral-800 w-10 h-10 flex justify-center items-center rounded-full text-white shadow 
                         group-hover:bg-green-500/30 group-hover:border group-hover:border-green-500 group-hover:text-[#0f0]">
              <FontAwesomeIcon 
                className="text-xl"
                icon={Fas.faChevronLeft}/>
            </span>
          </button>
          <button 
            className="absolute h-[360px] top-0 px-2 flex justify-center items-center group right-0" 
            onClick={next}>
            <span 
              className="bg-neutral-800 w-10 h-10 flex justify-center items-center rounded-full text-white shadow 
                         group-hover:bg-green-500/30 group-hover:border group-hover:border-green-500 group-hover:text-[#0f0]">
              <FontAwesomeIcon 
                className="text-xl"
                icon={Fas.faChevronRight}/>
            </span>
          </button>         
      </>
      }        
    </div>
    )
}


const Course : React.FC<{infoCourse:ICourse;userId:number}> = (props) => {
  const [ validityCourse, setValidityCourse] = useState<null|'not_have'|'expired'|'valid'>(null);
  useEffect(()=>{
    const checkValidity = async () => {
      try{
        const contract = await api.get(`validityCourse/${props.infoCourse.id}/${props.userId}`)
        setValidityCourse(contract.data.response)    
        console.log(validityCourse)    
      }catch(e){
        console.log(e)
      }
    }
    checkValidity()
  },[props.infoCourse])

  const navigate = useNavigate();
  
  const openCourse = () => {
    const hash_CourseId: string = btoa(`[{"courseId":"${props.infoCourse.id}"}]`);
    navigate(`/classRoom/course/${hash_CourseId}`)
  }  

  return(
    <div className="flex flex-col p-2 w-full px-3 mb-4  md:mb-1 opacity-90 hover:opacity-100 ">
      <div className="relative bg-slate-300 w-[270px] h-[360px] rounded-xl flex justify-center items-center group overflow-hidden">
        { props.infoCourse.image
        ? <RenderImageGallery className="w-full h-full" imageId={props.infoCourse.image}/>
        : <div className="flex justify-center items-center p-2 rounded-xl bg-black w-full h-full">
            <img className="w-1/2" src={Logo}/>
          </div>
        }
        
        { validityCourse == 'valid' ?
          <button
          className="p-2 bg-neutral-800 w-[60%] text-white text-xs font-light rounded-md absolute hidden bottom-0 left-[20%] shadow 
                      group-hover:bottom-[10px] group-hover:block group-hover:animate-slideUp"  
          onClick={()=>openCourse()}><FontAwesomeIcon icon={Fas.faFolderOpen}/> Abrir Curso</button>
        : <div className="absolute w-full h-full bg-black/80 text-white/60 flex justify-center items-center text-5xl" >
             { validityCourse == 'not_have' ? <FontAwesomeIcon icon={Fas.faLock}/> : <p>EXPIRADO</p>} 
          </div>
        }
      </div> 
      <p className="text-white text-sm mb-2 font-bold min-h-[50px] flex items-center">{props.infoCourse.name}</p>
      
    </div>
  )
}