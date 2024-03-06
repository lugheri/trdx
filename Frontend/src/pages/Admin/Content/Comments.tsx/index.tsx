import { FormEvent, useEffect, useState } from "react"
import { Card } from "../../../../components/Cards"
import { SearchInputForm, SelectForm } from "../../../../components/Inputs"
import { TitlePage } from "../../../../components/Template/TitlePage"
import { Button } from "../../../../components/Buttons"
import { IComments } from "../Dtos/comments.dto"
import api from "../../../../services/api"
import moment from 'moment';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Loading, LoadingBars } from "../../../../components/Loading"
import { IStudent } from "../../Students/Dtos/student.dto"
import { urlBase } from "../../../../utils/baseUrl"
import { ICourse, ILessonsModule } from "../Dtos/courses.dto"
import { Modal, TitleModal } from "../../../../components/Modal"
import { RenderImageGallery } from "../../../../components/RenderImageGallery"
import { ITeacher } from "../Dtos/teachers.dto"
import { MessageTextInput } from "../../../../components/MessageTextInput"

export const Comments = () => {
  const [ searchParams, setSearchParams ] = useState("")
  const [ typeComments, setTypeComments ] = useState<'news'|'answered'|'removed'>("news")
  const [ totalComments, setTotalComments ] = useState<number|null>(null)
  const getTotalComments = async () => {
    try{    
      const response = await api.get(`totalComments/${typeComments}`)
      if (response && response.data && response.data.success) {
        setTotalComments(response.data.response)
      }
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{ getTotalComments() },[typeComments])

  return(
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faCommentDots" 
        title="Comentários" 
        description="Acompanhamento dos comentários dos alunos"/>
      {/*BODY */}  
      <Card component={
        <div className="flex flex-col w-full">
          <div className="flex p-1 justify-start items-center border-b border-neutral-800">
            <div className="pt-2 mr-4">
              <SearchInputForm placeholder="Busque comentários por assunto" className="w-[400px]" icon="faSearch" value={searchParams} onChange={setSearchParams}/>
            </div>
            <Button icon="faComment" border="circle" btn="success" type={`${typeComments == 'news' ? "default" : "outline"}`} title="Novos Comentários" onClick={()=>setTypeComments("news")}/>
            <Button icon="faComments" border="circle" btn="info" type={`${ typeComments == 'answered' ? "default" : "outline"}`} title="Comentários Respondidos" onClick={()=>setTypeComments("answered")}/>
            <Button icon="faTrash" border="circle" btn="error" type={`${ typeComments == 'removed' ? "default" : "outline"}`}  title="Comentários Removidos" onClick={()=>setTypeComments("removed")}/>
          </div>

          {searchParams !== "" ? 
            <SearchComment params={searchParams}  typeComments={typeComments} setSearchParams={setSearchParams}/>
          :<>        
            <p className="text-white my-4">
              { typeComments == "news" ? <><FontAwesomeIcon className="text-teal-500/50" icon={Fas.faComment}/> Novos Comentários </>
                : typeComments == "answered" ? <><FontAwesomeIcon className="text-blue-500/50" icon={Fas.faComments}/> Comentários Respondidos </>
                : <><FontAwesomeIcon className="text-red-500/50" icon={Fas.faTrash}/> Comentários Removidos </>}    
                {totalComments && totalComments}</p>
          
            <div className="flex flex-wrap w-full">
              <PageComments page={1} typeComments={typeComments}/>
            </div>
          </>}

          
        </div>}/>
    </div>
  )
}

type SearchCommentComponent = {
  params:string,
  typeComments:'news'|'answered'|'removed',
  setSearchParams:React.Dispatch<React.SetStateAction<string>>
}
const SearchComment: React.FC<SearchCommentComponent>= (props) => {
  const [ comments, setComments ] = useState<IComments[]|null>(null)
  const [ update, setUpdate ] = useState(false)
  const getComments = async () => {
    setComments(null)
    try{      
      const response = await api.get(`searchComment/${props.params}/${props.typeComments}`)
      if (response && response.data && response.data.success) {
        setComments(response.data.response)
      } 
    }catch(e){ console.log(e) }
  }  
  useEffect(()=>{ getComments() },[props.params,props.typeComments])
  return(
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-white my-4">
          <FontAwesomeIcon className="text-teal-500/50" icon={Fas.faSearch}/> Buscando comentários sobre: <b className="text-teal-500">{props.params}</b>
        </p>
        <Button icon="faX"name="Fechar Busca" btn="muted" onClick={()=>props.setSearchParams("")}/>
      </div>

       <div className="flex flex-wrap w-full">
        {comments === null ? <LoadingBars/> 
          : comments.length == 0 ? 
            <div className="flex flex-col w-full justify-center items-center p-8 text-white">
              <FontAwesomeIcon className="my-4 text-4xl text-neutral-500/50" icon={Fas.faCommentSlash}/>
              <p>Nenhum comentário encontrado</p>
            </div>
          : comments.map((comment,key)=><Comment update={update} setUpdate={setUpdate} key={key} comment={comment}/>)}
       </div>
      
    </div>
  )
}

type PageCommentComponent = {
  typeComments:'news'|'answered'|'removed',
  page:number
}
const PageComments: React.FC<PageCommentComponent>= (props) => {
  const [ comments, setComments ] = useState<IComments[]|null>(null)
  const [ nextPage, setNextPage ] = useState(0)
  const [ update, setUpdate ] = useState(false)
  
  const getComments = async () => {
    try{      
      const response = await api.get(`getComments/${props.typeComments}/${props.page}`)
      if (response && response.data && response.data.success) {
        setComments(response.data.response)
      } 
    }catch(e){ console.log(e) }
  }  
  useEffect(()=>{ getComments() },[props.typeComments,update])

  return(
    <>
      {comments === null ? <LoadingBars/> 
      : comments.length == 0 ? props.page === 1 &&
        <div className="flex flex-col w-full justify-center items-center p-8 text-white">
          <FontAwesomeIcon className="my-4 text-4xl text-neutral-500/50" icon={Fas.faCommentSlash}/>
          <p>Nenhum comentário encontrado</p>
        </div>
      : <>
          { comments.map((comment,key)=><Comment key={key} comment={comment} update={update} setUpdate={setUpdate}/>)}
          { nextPage === 0 
            ? comments.length >= 10 
              && <Button block btn="muted" type="notline" name="Carregar Mais" onClick={()=>setNextPage(props.page+1)}/>
            : <PageComments page={nextPage} typeComments={props.typeComments}/>
          }    
        </>} 
    </>
  )
}



type CommentComponent = {
 comment:IComments,
 update:boolean,
 setUpdate:React.Dispatch<React.SetStateAction<boolean>>

}
const Comment : React.FC<CommentComponent> = (props) => {
  const [ infoStudent, setInfoStudent ] = useState<IStudent|null>(null) 
  const [ infoLesson, setInfoLesson ] = useState<ILessonsModule|null>(null) 
  const [ answer, setAnswer ] = useState<IComments|null>(null)
  const [ remove, setRemove ] = useState<IComments|null>(null) 
  
  useEffect(()=>{
    props.setUpdate(!props.update)
  },[answer,remove])

  const [ answersQuestion, setAnswerQuestion ] = useState<IComments|null>(null) 
  const getAnswers = async () => {
    setAnswerQuestion(null)
    try{      
      const response = await api.get(`getAnswers/${props.comment.id}`)
      console.log('Rsp getAnswers',response.data)
      if (response && response.data && response.data.success) {
        setAnswerQuestion(response.data.response)
      } 
    }catch(e){ console.log(e) }
  }  

  const getInfoStudent = async () => {
    setInfoStudent(null)
    try{      
      const response = await api.get(`getStudent/${props.comment.student_id}`)
      if (response && response.data && response.data.success) {
        setInfoStudent(response.data.response)
      } 
    }catch(e){ console.log(e) }
  }  
   const getInfoLesson = async () => {
    setInfoLesson(null)
    try{      
      const response = await api.get(`infoLesson/${props.comment.lesson_id}`)
      if (response && response.data && response.data.success) {
        setInfoLesson(response.data.response)
      } 
    }catch(e){ console.log(e) }
  }  
  useEffect(()=>{ 
    getAnswers()
    getInfoStudent() 
    getInfoLesson()},[props.comment])

    const formatDate = (date:string) => {
      return moment(date).format('DD/MM/YY HH:mm');
    }
    

  return(
    <div className="flex bg-neutral-800 w-full my-2">      
      {infoStudent == null ? 
      <>
        <div className="flex flex-col w-[100px]  h-[100px] justify-start items-center">
          <Photo photo_id={0}/> 
        </div>
        <div className="flex flex-col flex-1 py-2 px-1">
          <p className="text-neutral-300 font-light flex items-center">
            <b>Cod. do Aluno: {props.comment.student_id}-</b> <FontAwesomeIcon className="mx-2 text-teal-500 text-[.2rem]" icon={Fas.faCircle}/>
            <span>-</span>
          </p>
          <div className="text-white text font-extralight my-2" dangerouslySetInnerHTML={{ __html: props.comment.comment }} />

          <div className="flex border-t border-neutral-600 justify-between">
            <div className="flex">
              <Button icon="faReply" className="font-light" btn="muted" type="notline" size="sm" name="Responer" onClick={()=>setAnswer(props.comment)}/>
              <Button icon="faTrash" btn="error" type="notline" size="sm" title="Remover Comentário" onClick={()=>setRemove(props.comment)}/>
            </div>
            <p className="py-2 text-neutral-400 text-sm"><FontAwesomeIcon className="mx-2 text-teal-500"  icon={Fas.faChalkboardTeacher}/> Aula: {infoLesson?.name}</p>
          </div>
        </div>
      </>
      : <>
        <div className="flex flex-col w-[100px]  h-[100px] justify-start items-center">
          <Photo photo_id={infoStudent.photo}/> 
        </div>
        <div className="flex flex-col flex-1 py-2 px-1">
          <p className="text-neutral-300 font-light flex items-center">
            <b>{infoStudent.name}</b> 
            <FontAwesomeIcon className="mx-2 text-teal-500 text-[.2rem]" icon={Fas.faCircle}/>
            <span>{infoStudent.mail}</span>
            <FontAwesomeIcon className="mx-2 text-teal-500 text-[.2rem]" icon={Fas.faCircle}/>
            <p className="text-white text-xs">{formatDate(props.comment.date_created)}</p>
          </p>
          <div className="text-white text font-extralight my-2" dangerouslySetInnerHTML={{ __html: props.comment.comment }} />
         

          <div className="flex border-t border-neutral-600 justify-between">
            <div className="flex">
              <Button icon="faReply" className="font-light" btn="muted" type="notline" size="sm" name="Responer" onClick={()=>setAnswer(props.comment)}/>
              <Button icon="faTrash" btn="error" type="notline" size="sm" title="Remover Comentário" onClick={()=>setRemove(props.comment)}/>
            </div>
            <p className="py-2 text-neutral-400 text-sm"><FontAwesomeIcon className="mx-2 text-teal-500"  icon={Fas.faChalkboardTeacher}/> Aula: {infoLesson?.name}</p>
          </div>
          { answersQuestion !== null && 
          <div className="bg-neutral-900 p-2 rounded text-white">
            <p className="text-xs font-light"><b>Resposta:</b>
            <div dangerouslySetInnerHTML={{ __html: answersQuestion.comment }} /></p>  
          </div>}
        </div>
        
      </>}    
      { answer && <AnswerComment comment={props.comment} infoLesson={infoLesson} infoStudent={infoStudent} setAnswer={setAnswer}/>}  
      { remove && <RemoveComment comment={props.comment} studentName={infoStudent ? infoStudent.name : ""} setAnswer={setAnswer} setRemove={setRemove}/>}  
  
    </div>
  )
}

type AnswerCommentComponent = {
  comment:IComments,
  infoStudent:IStudent|null,
  infoLesson:ILessonsModule|null,
  setAnswer:React.Dispatch<React.SetStateAction<IComments|null>>
 }
const AnswerComment : React.FC<AnswerCommentComponent> = (props) => {
  const [ answer, setAnswer] = useState("")
  const [ answerAs, setAnswerAs] = useState('0')   
  const [ openVideo, setOpenVideo] = useState<string|null>(null)

  const [ teachers, setTeachers ] = useState<ITeacher|null>(null)
  const getTeachers = async () => {
    try{
      const resp = await api.get('listTeachers')
      console.log('TEACHERS',resp.data)
      setTeachers(resp.data.response)
    }catch(err){
      console.log(err)
    }
  }

  const [ infoCourse, setInfoCourse ] = useState<ICourse|null>(null)
  const getInfoCourse = async () => {
    if(props.infoLesson){
      try{
        const info = await api.get(`infoCourse/${props.infoLesson.course_id}`)
        setInfoCourse(info.data.response)
      }catch(err){console.log(err)}
    }
  }
  useEffect(()=>{ 
    getTeachers()
    getInfoCourse()
  },[])

  

  const [ error, setError ] = useState<null | string>(null)
  const publicComment = async () => {
    try{
      const data = {       
        public:1,
        status:1    
      }
      const response = await api.patch(`editComment/${props.comment.id}`,{public:1})
      console.log('PUBLICANDO',response.data,data,`editComment/${props.comment.id}`)
      if (response && response.data && response.data.success) {
        props.setAnswer(null)
      } else {
        console.log(response.data)
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }
  }
  
  const saveAnswerComment = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        teacher_id: parseInt(answerAs),
        answers_comment_id:props.comment.id,
        comment:answer,
        public:1,
        status:1    
      }
      const response = await api.post('newAnswer/',data)
      if (response && response.data && response.data.success) {
        publicComment()
      } else {
        setError('Ocorreu um erro ao requisitar esta ação! '+response.data.error);
      }
    } catch (err) {
      console.error('Erro ao obter os itens:', err);
    }

  }

  return(<Modal className="overflow-x-visible" component={
    <div className="flex flex-col w-[900px]">
      <TitleModal icon="faReply" title="Responder Comentário" close={()=>props.setAnswer(null)}/>
      <div className="flex flex-col p-4">
        {/*COMMENT*/}
        <div className="flex overflow-hidden">      
          {props.infoStudent == null ? 
            <>
              <div className="flex flex-col w-[100px]  h-[100px] justify-start items-center">
                <Photo photo_id={0}/> 
              </div>
              <div className="flex flex-col flex-1 py-2 px-1">
                <p className="text-neutral-300 font-light flex items-center">
                  <b>Cod. do Aluno: {props.comment.student_id}-</b> <FontAwesomeIcon className="mx-2 text-teal-500 text-[.2rem]" icon={Fas.faCircle}/>
                  <span>-</span>
                </p>
                <div className="text-white text font-extralight my-2" dangerouslySetInnerHTML={{ __html: props.comment.comment }} />            
              </div>
            </>
          : <>
            <div className="flex flex-col w-[100px]  h-[100px] justify-start items-center">
              <Photo photo_id={props.infoStudent.photo}/> 
            </div>
            <div className="flex flex-col flex-1 py-2 px-1">
              <p className="text-neutral-300 font-light flex items-center">
                <b>{props.infoStudent.name}</b> <FontAwesomeIcon className="mx-2 text-teal-500 text-[.2rem]" icon={Fas.faCircle}/>
                <span>{props.infoStudent.mail}</span>
              </p>
              <div className="text-white text font-extralight my-2" dangerouslySetInnerHTML={{ __html: props.comment.comment }} />     
            </div>
          </>} 
        </div>
        {props.infoLesson && 
          <div className="flex w-full justify-end items-center">            
            <div className="flex flex-col p-4 ">           
              { infoCourse && <p className="text-slate-400">Curso: {infoCourse.name}</p>}
              <p className="text-slate-400">Aula: {props.infoLesson.name}</p>
              <Button name="Ver Aula" size="sm" icon="faExternalLink" btn="info" type="notline" onClick={()=>setOpenVideo(props.infoLesson !== null ? props.infoLesson.link : null)}/>
            </div>
            { infoCourse && <RenderImageGallery className="w-1/6 h-auto" imageId={infoCourse.default_thumb} imgTag/>}
          </div>}
        
        
        <form onSubmit={(e)=>saveAnswerComment(e)} className="mt-20">
          
          <label className="font-semibold italic text-sm text-neutral-300  py-1">
            Resposta
          </label>
          <div className="shadow rounded-md p-2 border mb-4 border-neutral-700 bg-neutral-500/20">          
            <MessageTextInput message={answer} setMessage={setAnswer} sizeEmoji="18px" classStyle="bottom-10"/>
          </div>
          {teachers === null ? <LoadingBars/> : <SelectForm label="Responder" options={teachers} valueKey="id" empty="Responder como?" lableKey="name" required value={answerAs} onChange={setAnswerAs}/>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end border-t border-neutral-600 pt-2 mt-2">
            <Button btn="muted" name='Cancelar' type='notline' onClick={()=>props.setAnswer(null)} />
            <Button btn="success" icon="faEdit" name='Responder Comentário' submit />
          </div>
        </form>
        

         {openVideo && <RenderVideo 
                          setOpenVideo={setOpenVideo} 
                          link={openVideo} 
                          course={infoCourse ? infoCourse.name : ""} 
                          lesson={props.infoLesson ? props.infoLesson.name : ""} />} 

        
      </div>
    </div>
  }/>)
}

type RemoveCommentComponent = {
  comment:IComments,
  studentName:string,
  setAnswer:React.Dispatch<React.SetStateAction<IComments|null>>,
  setRemove:React.Dispatch<React.SetStateAction<IComments|null>>,
 }
const RemoveComment : React.FC<RemoveCommentComponent> = (props) => {
  const removeComment = async () => {
    try{  
      await api.patch(`editComment/${props.comment.id}`, {status:0}) 
    }catch(e){console.log(e)}
    props.setAnswer(null)
    props.setRemove(null)
  }
  return(<Modal component={
    <div className="flex flex-col">
      <TitleModal icon="faTrash" title="Remover Comentário" close={()=>props.setRemove(null)}/>    
       <p className="text-white font-xl mt-8 mx-4 mb-4">
        Confirmar a remoção do comentário<br/>
        <span className="flex text-sm italic font-light">"
          <div dangerouslySetInnerHTML={{ __html: props.comment.comment }} />
        " ?</span></p>
        <p className="w-full text-right text-sm text-neutral-300">- Aluno: {props.studentName}</p>
     <div className="flex border-t mt-4 p-2 justify-end items-center">
       <Button name="Cancelar" btn="muted"  type='outline' onClick={()=>props.setRemove(null)} />
       <Button name="Sim, Remover" icon="faTrash" btn="error" onClick={()=>removeComment()}/> 
     </div> 
    </div> 
  }/>)
}





type RenderVideoComponent = {
  link:string,
  setOpenVideo:React.Dispatch<React.SetStateAction<string|null>>,
  lesson:string,
  course:string
}
const RenderVideo: React.FC<RenderVideoComponent> = (props) => {  
  return(
    <Modal component={
      <div className="flex flex-col">
        <TitleModal title="Video" icon="faVideo" close={()=>props.setOpenVideo(null)}/>
        <div className="flex justify-center items-center w-[500px]">
          {props.link === null ? <Loading/>
          : props.link ?
            <>
              <iframe  
                  className="h-full min-h-[40vh] my-2" 
                  width="100%" 
                  allow="autoplay; fullscreen" 
                  src={`https://player.vimeo.com/video/${props.link}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
            </>
          : <div className="flex flex-col justify-center items-center p-8">
              <FontAwesomeIcon className="text-pink-500/50 text-4xl my-4" icon={Fas.faVideoSlash}/>
              <p className="text-white">Ocorreu uma falha ao carregar seu vídeo</p>
              <p className="text-slate-200 font-light text-sm">Cheque o link do seu vídeo novamente para prosseguir!</p>
            </div>}
        
        </div>
        <div className="flex justify-end border-t border-neutral-700 mt-2 pt-1">
          <Button name="Fechar" btn="muted" type="outline" onClick={()=>props.setOpenVideo(null)}/>
        </div>
      </div>}/>
  )
}





const Photo : React.FC<{photo_id:number}> = (props)=> {
  const [ urlPhoto, setUrlPhoto ] = useState<string|null>(null)
 
  

  useEffect(()=>{
    const getPhoto = async () => {
      setUrlPhoto(null)
      try{        
        const photo = await api.get(`photoProfile/${props.photo_id}`)     
        photo.data.response == false ? setUrlPhoto(null) :
        setUrlPhoto(`${photo.data.response.file}`)
      }catch(e){console.log(e)}
    }
    getPhoto()    
  },[props.photo_id])

  return(
    <div className="flex w-full h-[100px] overflow-hidden rounded justify-center items-start pt-3">
      { urlPhoto ?
      <img src={`${urlBase}/gallery/${urlPhoto}`} alt="Foto do Aluno" style={{ maxWidth: '60%',borderRadius:'8px' }} />
      : <div className="bg-neutral-500/50 text-neutral-800 w-[60px] h-[60px] flex rounded justify-center items-center"><FontAwesomeIcon  icon={Fas.faUser}/></div>}
    </div>
  )
}