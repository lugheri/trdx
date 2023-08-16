import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ICourse, IModules } from "../Dtos/courses.dto";
import api from "../../services/api";
import { Loading } from "../../components/Loading";
import { Card } from "../../components/Cards";
import { urlBase } from "../../utils/baseUrl";

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../components/Buttons";
import useAuth from "../../hooks/useAuth";
import { Student } from "../../contexts/Dtos/auth.dto";



export const ClassRoom = () => {
  const location = useLocation();  
  const params = location.pathname.split('/')[4]
  interface LessonObject {
    courseId: string;
    moduleId: string;
  }
  const base64Decoded: LessonObject[] = JSON.parse(atob(params));
  const courseId = base64Decoded[0].courseId
  const moduleId = base64Decoded[0].moduleId

  return (
    <div className="flex ">
      <div className="flex flex-1 flex-col">
        <Card component={<div className="h-[500px]">Player Aula</div>}/>
        <div>Botoes</div>
        <Card component={<div>Comentarios Curso {courseId}</div>}/>
      </div>
      <div className="flex w-1/3 flex-col">
        <Card component={<div className="h-[550px]">Aulas do modulo {moduleId}</div>}/>
        <div>Botoes</div>
        <Card component={<div>Acoes</div>}/>
      </div>
    </div>
  )
} 