import { useState, useEffect } from 'react';
import Banner from '/img/banner-home-2.png'
import { ICourse, ILessons, IMyCourses } from '../Dtos/courses.dto';
import useAuth from '../../../hooks/useAuth';
import { Student } from '../../../contexts/Dtos/auth.dto';
import api from '../../../services/api';
import { Loading } from '../../../components/Loading';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { urlBase } from '../../../utils/baseUrl';
import { useNavigate } from 'react-router-dom';
import { ButtonDefault } from '../../../components/Buttons';

export const Home = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null 
  const [ nextLessonId, setNextLessonId ] = useState<number|null>(null)
  useEffect(()=>{
    const getNextLesson = async () => {
      try{
        const nextLesson = await api.get(`lastLessonViewed/${userData ? userData.id : 0}`)          
        setNextLessonId(nextLesson.data.response)
      }catch(err){
        console.log(err)
      }
    }
    getNextLesson()
  },[])

  const [ listMyCourses, setListMyCourses ] = useState<IMyCourses[]|null>(null)
  const getMyCourses = async () => {
    try{
      const mc = await api.get(`myCourses/${userData ? userData.id : 0}`)
      setListMyCourses(mc.data.response)
    }catch(e){
      console.log(e)
    }    
  }
  useEffect(()=>{ getMyCourses()},[])   


  return(
    <HomePageCarousel 
      component={
        <div className="flex flex-col">
          <Welcome/>          
          { nextLessonId && <NextLesson lessonId={nextLessonId}/> } 
          { listMyCourses === null ? <Loading/> : listMyCourses.length == 0 ? <Empty/> 
          : <AllCourses listMyCourses={listMyCourses} studentId={userData ? userData.id : 0}/>}
        </div>
    }/>
  )
}

type HomePageCarouselComponent = {
  component: React.ReactNode;
  className?:string;
}
export const HomePageCarousel : React.FC<HomePageCarouselComponent> = (props) => {
  return(
  <div 
    className={`${props.className} relative`} 
    style={{
            background: `linear-gradient(to bottom,rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 1)),
                         url(${urlBase}/gallery/bg-text-1.jpg)`,
            backgroundSize:'100% auto',
            backgroundRepeat:'no-repeat',
            backgroundAttachment:'fixed'
            }}>
        {props.component}
      
     
  </div>)
}

const Welcome = () => {
  const homeVideo = '359281775'
  return(
    <div className="flex mt-[300px] 2xl:mt-[600px] justify-center items-center ml-28 mr-4">
      <iframe 
        className="bg-slate-900 rounded-xl  shadow-md shadow-black
                  w-[500px] h-[270px]
                  2xl:w-[1000px] 2xl:h-[540px]        
                  " 
        width="100%" 
        allow="autoplay; fullscreen" 
        src={`https://player.vimeo.com/video/${homeVideo}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}>
      </iframe>
      
      <div className="flex flex-col flex-1 justify-start items-start px-4">
        <p className="text-white font-black  mb-4 text-shadow-custom
                      text-xl 2xl:text-5xl ">
          PROGRAMAÇÃO DAS SALAS DE TRADE AO VIVO
        </p>
        <p className="text-slate-300 font-light text-shadow-custom my-2
                     text-sm 2xl:text-3xl  ">
          SALA DE TRADE AO VIVO - DIURNA de Segunda a Sexta às 10h de Brasília.<br/>
          Clique no botão abaixo para assistir no dia e hora marcado.
        </p>
        <ButtonDefault icon="faPlay" className="mb-3 text-xs" name="Assista de Segunda a Sexta às 10h"/>

        <p className="text-slate-300  text-sm font-light text-shadow-custom my-2">
          SALA DE TRADE AO VIVO - NOTURNA de Quarta-feira 01/11 às 22h de Brasília.<br/>
          Clique no botão abaixo para assistir no dia e hora marcado.
        </p> 
        <ButtonDefault icon="faPlay" className="mb-3 text-xs" name="Assista de Quarta-feira 01/11 às 22h"/>

        <p className="text-slate-300 text-sm font-light text-shadow-custom my-2">
          Obs.: Todas as salas são gravadas, para assistir acesse "Gravações Sala" disponível aqui na área de alunos.
        </p>              
      </div>
    </div>
  )
} 

const NextLesson: React.FC<{lessonId:number}> = ({lessonId}) => {
  const [infoLesson, setInfoLesson] = useState<ILessons | null>(null); // Inicializa com null ou um valor padrão apropriado

  useEffect(()=>{
    const infoNextLesson = async () => {
      const info = await api.get(`/infoLesson/${lessonId}`)
      setInfoLesson(info.data.response)
    }
    infoNextLesson()
  },[])

  const navigate = useNavigate();  
  const openModule = () => {
    const hash_lessonId: string = btoa(`[{"courseId":"${infoLesson?.course_id}","moduleId":"0"}]`);
    navigate(`/classRoom/course/lesson/${hash_lessonId}`)
  }

  return (
    <div className="flex mt-[100px] justify-center items-center ml-28 mr-4">
      <div className="w-[500px] h-[270px] mb-4 rounded-xl relative flex justify-center items-center bg-slate-900 text-neutral-600">
        <p className="p-2 bg-neutral-800 text-white text-xs font-light rounded-md absolute top-4 left-4 shadow">
          Continue de onde parou  
        </p>
        CAPA
      </div>
      <div className="flex flex-col flex-1 justify-start items-center md:items-start px-4">
        <p className="text-neutral-100 font-bold text-xl w-full text-center md:text-left">{infoLesson?.name}</p>
        <p className="text-neutral-100 font-light mt-4 w-full text-center md:text-left">{infoLesson?.description}</p>
        <ButtonDefault icon="faPlay" className="mb-3" onClick={()=>openModule()} name="Continuar Conteúdo"/>        
      </div>        
    </div>
  )
}

type AllCoursesComponent={
  studentId:number,
  listMyCourses:IMyCourses[]
}
const AllCourses : React.FC<AllCoursesComponent> = (props) => {

  const settings = {
    dots:true,
    centerMode: true,
    infinite: true, // Torna o carrossel infinito
    slidesToShow: 3, // Número de slides visíveis de cada vez
    slidesToScroll: 1, // Número de slides a rolar por vez  
    autoplay: true,
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
        <div
          style={{
            width: "5px",
            height: "5px",
            marginTop:"30px",
            color: "green",
            border: "1px green solid"
          }}
        >
        </div>
      ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
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
    <div className=" w-full h-[300px] mt-[100px] mb-[100px]">
       <h2>Carousel Infinito</h2>
       
      <Slider {...settings}>        
        { props.listMyCourses.map((course,key)=>
          <Course key={key} infoCourse={course} userId={props.studentId}/>)}     
      </Slider>
      
    </div>
  )
}


const Course : React.FC<{infoCourse:IMyCourses;userId:number}> = (props) => {
  //const [ fileImage, setFileImage ] = useState(null)
  const [ dataCourse, setDataCourse ] = useState< ICourse | null>(null)
  useEffect(()=>{
    const getDataCourse = async () => {
      try{
        const prog = await api.get(`infoCourse/${props.infoCourse.id}`)
        setDataCourse(prog.data.response)        
      }catch(e){
        console.log(e)
      }
    }
    getDataCourse()
  },[])


  const [ validityCourse, setValidityCourse] = useState(null);
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
    <div onClick={()=>openCourse()}
         className="flex flex-col p-2 w-full px-3 mb-4  md:mb-1 opacity-90 cursor-pointer hover:opacity-100">
      <div className="bg-slate-300 w-full h-[250px] rounded-xl flex justify-center items-center overflow-hidden">
        <RenderImage className="w-full h-full" imageId={props.infoCourse.image}/>
      </div> 
      <p className="text-white text-sm mb-2 font-bold min-h-[50px] flex items-center">{dataCourse?.name}</p>
      
    </div>
  )
}

const RenderImage : React.FC<{className:string,imageId:number}> = (props) => {
  const [ fileImage, setFileImage ] = useState(null)

  useEffect(()=>{
    const getInfoImage = async () => {
      try{
        const i = await api.get(`infoFile/${props.imageId}`)
        setFileImage(i.data.response.file)
      }catch(e){
        console.log(e)
      }
    }
    getInfoImage()
  },[props.imageId])

  return(
    fileImage == null ? <Loading/> : 
    <div 
      className={props.className} 
      style={{backgroundImage:`url(${urlBase}/gallery/${fileImage})`,
              backgroundSize:'cover',
              backgroundPosition:'center'}}/>
  )
}



const Empty = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full  text-slate-400 dark:text-slate-200">
      <FontAwesomeIcon className="text-3xl opacity-60 mb-2" icon={Fas.faFaceFrown}/> 
      <p>Parece que você ainda não possui nenhum curso</p>
    </div>
  )
}




















export const HomeOld = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null  

  const homeVideo='797995639'
  const textHtml = `
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-weight: bolder;">
        <span style="font-size: 12pt; font-family: Montserrat; color:white;">
          :: PROGRAMAÇÃO DAS SALAS DE TRADE AO VIVO<br><br><br>SALA DE TRADE AO VIVO - DIURNA
        </span>
      </span>
      <span style="font-size: 12pt; font-family: Montserrat;"><o:p></o:p></span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify;line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat;">&nbsp;</span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="color: white; font-family: Montserrat; font-size: 12pt;">
        Segunda a Sexta às 10h de Brasília.
      </span><br>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat;">&nbsp;</span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat; color: white;">
        <span style="color: rgb(114, 124, 245);">
          <a href="https://us06web.zoom.us/j/82663172724">Aperta aqui</a>
        </span>
        <a href="https://us02web.zoom.us/j/82360488633">
          <span style="font-family: Cambria, serif; color: rgb(114, 124, 245);">&nbsp;</span>
        </a>
      </span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white;">
        para assistir&nbsp;
        <span style="font-weight: bolder;">no dia e hora marcado</span>.<o:p></o:p>
      </span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;"><br></p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;"><br></p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-weight: bolder;">
        <span style="font-size: 12pt; font-family: Montserrat; color: white;">
          SALA DE TRADE AO VIVO - NOTURNA
        </span>
      </span>
      <span style="font-size: 12pt; font-family: Montserrat;"><o:p></o:p></span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat; color: white;">
        <br>Quarta-feira 19/07 às 22h de Brasília.<br><br>
      </span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white;">
        <span style="color: rgb(114, 124, 245);">
          <a href="https://us06web.zoom.us/j/89771105722">Aperta aqui</a>
        </span>
        <a href="https://us02web.zoom.us/j/85743430223">
          <span style="font-family: Cambria, serif; color: rgb(114, 124, 245);">&nbsp;</span>
        </a>
      </span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white;">para assistir&nbsp;
      <span style="font-weight: bolder;">no dia e hora marcado</span>.<o:p></o:p>
      </span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat; color: white;"><br></span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify;line-height: normal;">
      <span style="font-size: 12pt; font-family: Montserrat; color: white;"><br></span>
    </p>
    <p class="MsoNormal" style="margin-bottom: 0cm; font-size: 14.4px; text-align: justify; line-height: normal;">
      <span style="font-size: 14.4px; font-weight: bolder;">
        <span style="font-size: 12pt; font-family: Montserrat; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">
          Obs.:
        </span>
      </span>
      <span style="font-size: 12pt; font-family: Cambria, serif; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">&nbsp;</span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">
        Todas as salas são gravadas, para assistir
      </span>
      <span style="font-size: 12pt; font-family: Cambria, serif; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">&nbsp;</span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">
      acesse "Gravações Sala" 
      </span>
      <span style="font-size: 12pt; font-family: Montserrat; color: white; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">
        disponível aqui na área de alunos.
      </span>
    </p>`


  const [ nextLessonId, setNextLessonId ] = useState<number|null>(null)

  useEffect(()=>{
    const getNextLesson = async () => {
      try{
        const nextLesson = await api.get(`lastLessonViewed/${userData ? userData.id : 0}`)          
        setNextLessonId(nextLesson.data.response)
      }catch(err){
        console.log(err)
      }
    }
    getNextLesson()
  },[])

  return(
    <div className="flex flex-col items-center py-2 p-4">    
      <div className="w-full h-[120px] md:h-[275px]  rounded-t-3xl relative overflow-hidden">
        <img src={Banner} className="w-full my-2 rounded-t-3xl absolute"/> 
        <div className="bg-gradient-to-b from-transparent via-transparent to-[#070707] w-full flex absolute z-10 absolute h-full">
        </div>
      </div>

      <div className="flex flex-col items-center md:flex-row my-8 w-full">
        <div className="flex flex-col w-full md:w-[40%]">
       
          <div className=" h-[25vh] md:h-[40vh]">
            <iframe 
              className="h-full rounded-xl overflow-hidden" 
              width="100%"
              allow="autoplay; fullscreen" 
              src={`https://player.vimeo.com/video/${homeVideo}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
          </div>

          {/*BUTTONS*/}
          <div className="flex flex-col py-2">
            <div className="bg-gray-700 rounded my-1 px-4 h-14 flex justify-between items-center">
              <FontAwesomeIcon className="text-5xl text-slate-800" icon={faTelegram}/>
              <p className="text-white font-light text-sm">Grupo no Telegram</p>
              <button onClick={()=>window.open('https://t.me/+SB4xj2nbssNjMWZh', '_blank')}
                className="text-white bg-sky-600 px-4 py-2 rounded text-sm opacity-90 hover:opacity-100">
                Acesse
              </button>
            </div>
            <div className="bg-gray-700 rounded my-1 px-4 h-14 flex justify-between items-center">
              <FontAwesomeIcon className="text-5xl text-slate-800" icon={faWhatsapp}/> 
              <p className="text-white font-light text-sm">WhatsApp de Suporte</p>
              <button onClick={()=>window.open('https://bit.ly/suportegc', '_blank')}
                className="text-white bg-teal-500 px-4 py-2 rounded text-sm opacity-90 hover:opacity-100">
                Acesse
              </button>
            </div>
            <button onClick={()=>window.open('https://forms.gle/3siEWVTB8R9cyRHM8', '_blank')}
            className="bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055]  shadow-lg py-3 px-4 text-center my-1 rounded shadown text-sm font-semibold opacity-90 hover:opacity-100">
              Preencher a Pesquisa
            </button>
            <button onClick={()=>window.open('mailto:suporte@otraderquemultiplica.com.br', '_blank')}
               className="bg-gray-700 my-1 rounded-full flex justify-center items-center p-2 hover:bg-gray-800">
              <p className="text-white text-sm font-light">
                <FontAwesomeIcon className="mr-2" icon={Fas.faEnvelope}/>suporte@otraderquemultiplica.com.br
              </p>
            </button>
          </div>  
        </div>          
        
        <div className="flex flex-1 p-4">
          <div dangerouslySetInnerHTML={{ __html:textHtml}}/>
        </div>
      </div>

      { nextLessonId && <NextLesson lessonId={nextLessonId}/> } 
      <MyCourses studentId={userData ? userData.id : 0} />     
            
    </div>
  )
}


const MyCourses: React.FC<{studentId:number}> = ({studentId}) => {
  const [ listMyCourses, setListMyCourses ] = useState<IMyCourses[]|null>(null)
  const getMyCourses = async () => {
    try{
      const mc = await api.get(`myCourses/${studentId}`)
      setListMyCourses(mc.data.response)
    }catch(e){
      console.log(e)
    }    
  }
  useEffect(()=>{ getMyCourses()},[])
  return (
    <div className="flex flex-wrap">
     { listMyCourses === null ? <Loading/> : listMyCourses.length == 0 ? <Empty/> : 
       listMyCourses.map((course,key)=>(<Course key={key} infoCourse={course} userId={studentId}/>
      ))}     
    </div>
  )
}



