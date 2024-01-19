import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Chart from "react-apexcharts";


import { Button } from "../../../../components/Buttons"
import { Card } from "../../../../components/Cards"
import { TitlePage } from "../../../../components/Template/TitlePage"
import { faUserAstronaut, faUserCheck, faUserClock, faUserGraduate, faUserXmark, faUsers } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { LoadingBars } from "../../../../components/Loading";


export const StudentsReports = () => {
  const [ allStudentsCommunity, setAllStudentsCommunity] = useState<null | number>(null)
  const [ allStudents, setAllStudents] = useState<null | number>(null)
  const getAllStudents = async () => {
    try{
      const totalStudents = await api.get('totalStudents')
      setAllStudentsCommunity(totalStudents.data.community)
      setAllStudents(totalStudents.data.students+totalStudents.data.community)
    }catch(e){
      console.log(e)
    }
  }

  const [ update, setUpdate] = useState(0)
  const [ activesNow, setActivesNow] = useState<null | number[]>(null)
  const getActivesNow = async () => {
    try{
      const activesNow = await api.get('activesNow')
      setActivesNow(activesNow.data)
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{
    getActivesNow()
    const time = update+1
    setTimeout(()=>{setUpdate(time)},10000)    
  },[update])


  const [ newCommunity, setNewCommunity] = useState<null | number[]>(null)
  const [ newStudents, setNewStudents] = useState<null | number[]>(null)
  const [ dateNewStudents, setDateNewStudents] = useState<null | string[]>(null)
  const getNewStudents = async () => {
    try{
      const newStudent = await api.get('newStudentsLast20days')
      setNewCommunity(newStudent.data.community)
      setNewStudents(newStudent.data.students)
      setDateNewStudents(newStudent.data.dates)
    }catch(e){
      console.log(e)
    }
  }
  
  const [ activesAccess, setActivesAccess ] = useState<null|number>(null)
  const [ inactiveAccess, setInactiveAccess ] = useState<null|number>(null)
  const [ expiredAccess, setExpiredAccess ] = useState<null|number>(null)
  const [ endAccess, setEndAccess ] = useState<null|number>(null)
  const getAccessStudents = async () => {
    try{
      const access = await api.get('accessExpireds')
      setActivesAccess(access.data.actives)
      setInactiveAccess(access.data.inactive)
      setExpiredAccess(access.data.expired)
      setEndAccess(access.data.endContract)
    }catch(e){
      console.log(e)
    }
  }

  
  const [courses, setCourses ] = useState<null|string[]>(null)
  const [average, setAverage ] = useState<null|number[]>(null)
  
  const getSatisfaction = async () => {
    try{
      const s = await api.get('satisfactionChart')
      const response = s.data.response
      setCourses(response[0].courses)
      setAverage(response[1].average)
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{
    getAllStudents()
    getNewStudents()
    getAccessStudents()
    getSatisfaction()
  },[])

  return(
    <div className="flex flex-col p-2">
      <TitlePage 
        icon="faUserGraduate" 
        title="Métricas dos Alunos" 
        description="Acompanhe a evolução dos alunos, atividade, entrada, etc"
        rightComponent={<Button name="Exportar Alunos" btn="success" type="notline" icon="faDownload"/>}/>   

      <div className="flex">
        <div className="flex flex-col flex-1 overflow-hidden shadow bg-neutral-900 rounded-md m-2">
          <div className="flex justify-between items-start p-4 bg-neutral-800 w-full">
            <p className="text-white text-6xl">{allStudents == null ? '...' : allStudents}</p>
            <FontAwesomeIcon className="text-white/40 text-xl" icon={faUserGraduate}/>
          </div>
          <p className="p-2 text-neutral-300 text-sm">Total de Alunos</p>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden shadow bg-neutral-900 rounded-md m-2">
          <div className="flex justify-between items-start p-4 bg-neutral-800 w-full">
            <p className="text-white text-6xl">{allStudentsCommunity == null ? '...' : allStudentsCommunity}</p>
            <FontAwesomeIcon className="text-white/40 text-xl" icon={faUsers}/>
          </div>
          <p className="p-2 text-neutral-300 text-sm">Membros da Comunidade</p>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden shadow bg-neutral-900 rounded-md m-2">
          <div className="flex justify-between items-start p-4 bg-neutral-800 w-full">
            <p className="text-white text-6xl">{activesNow == null ? '...' : activesNow}</p>
            <FontAwesomeIcon className="text-white/40 text-xl" icon={faUserAstronaut}/>
          </div>
          <p className="p-2 text-neutral-300 text-sm">Logados Agora</p>
        </div>
      </div>
      <Card component={
        <div className='flex w-full flex-col'>
          { dateNewStudents === null ? <LoadingBars/> :    
          <NewStudentsChart categories={dateNewStudents} newCommunity={newCommunity} newStudents={newStudents}/>}
        </div>}/>

      <div className="flex justify-center items-end">
        <div className="flex flex-col flex-1 overflow-hidden shadow bg-neutral-900 rounded-md m-2">
          <p className="p-2 text-neutral-300 text-sm"><FontAwesomeIcon icon={faUserCheck}/> Status geral dos Alunos</p>
          <div className="flex flex-col items-start py-4 bg-neutral-800 w-full">
            <div className="flex w-full justify-between itens-center py-1 px-4">
              <p className="text-green-300"><FontAwesomeIcon className="opacity-50" icon={faUserCheck}/> Acessos Ativos</p>
              <p className="text-green-500 text-xl">{activesAccess == null ? <LoadingBars/> : activesAccess}</p>
            </div>
            
            <div className="flex w-full justify-between itens-center bg-neutral-900/50 py-1 px-4">
              <p className="text-orange-300"><FontAwesomeIcon className="opacity-50" icon={faUserClock}/> Expiram em menos de 15 dias</p>
              <p className="text-orange-500 text-xl">{endAccess == null ? <LoadingBars/> : endAccess}</p>
            </div>  
            <div className="flex w-full justify-between itens-center py-1 px-4">
              <p className="text-red-300"><FontAwesomeIcon className="opacity-50" icon={faUserXmark}/> Acessos Expirados</p>
              <p className="text-red-500 text-xl">{expiredAccess == null ? <LoadingBars/> : expiredAccess}</p>
            </div>          
          </div>          
        </div>
        <div className="flex">
        { activesAccess === null ? <LoadingBars/> :    
          <AccessChart series={[activesAccess,inactiveAccess,endAccess,expiredAccess]} />}
        </div>
      </div>
      
      <div className='flex w-full flex-col'>    
          { courses === null ? <LoadingBars/> :    
            <SatisfactionChart 
              series={average} 
              categories={courses}/>}
      </div>
    </div>
  )
}


//Charts
//New Students
interface NewStudentsComponent{
  newCommunity: number[];
  newStudents: number[];
  categories: string[]
} 

interface SeriesItem {
  name: string;
  data: number[];
}

const NewStudentsChart : React.FC<NewStudentsComponent> = (props) => { 
  const series : SeriesItem[]=[{
    name: 'Acesso Padrão',
    data: props.newStudents
  },{
    name: 'Acesso Comunidade',
    data: props.newCommunity
  }]
  const options : ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      },
    },
    xaxis: {
      type: 'category',
      categories: props.categories,
    },
    legend: {
      position: 'right',
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  
  }
  return(
    <Chart options={options} series={series} type="bar" height={350} />
  )
}

//Access
interface AccessChartComponent{series: number[];} 
const AccessChart : React.FC<AccessChartComponent> = (props) => { 
  const series : number[]=props.series
  const options : ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Ativos','Inativos','Expirando','Expirado'],
    colors: ['#1abc9c','#95a5a6','#d35400','#c0392b'],
    stroke:{colors:['#000000']},
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200          
        },
        legend: {
          position: 'bottom'
        },
      }
    }]
  }
  return(
    <Chart options={options} series={series} type="donut"/>
  )
}


//Satisfaction
interface SatisfactionChartComponent{
  series: number[];
  categories: string[]
} 
const SatisfactionChart : React.FC<SatisfactionChartComponent> = (props) => { 
  const series : [{name:string;data: number[];}]=[{
    name: 'Satisfação',
    data: props.series
  }]
  const options : ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      type: 'bar',
      events: {
        click: function(chart, w, e) {
          // console.log(chart, w, e)
        }
      }
    },
    colors: ['#00ff00','#1abc9c','#16a085','#2ecc71','#27ae60','#55efc4','#00b894','#81ecec','#00cec9','#badc58','#7ed6df','#22a6b3','#6ab04c','#1dd1a1','#10ac84','#00d2d3','#01a3a4','#00ff0099','#1abc9c99','#16a08599','#2ecc7199','#27ae6099','#55efc499','#00b89499','#81ecec99','#00cec999','#badc5899','#7ed6df99','#22a6b399','#6ab04c99','#1dd1a199','#10ac8499','#00d2d399','#01a3a499'],
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: props.categories,
      labels: {
        style: {
          colors: ['#00ff00','#1abc9c','#16a085','#2ecc71','#27ae60','#55efc4','#00b894','#81ecec','#00cec9','#badc58','#7ed6df','#22a6b3','#6ab04c','#1dd1a1','#10ac84','#00d2d3','#01a3a4','#00ff0099','#1abc9c99','#16a08599','#2ecc7199','#27ae6099','#55efc499','#00b89499','#81ecec99','#00cec999','#badc5899','#7ed6df99','#22a6b399','#6ab04c99','#1dd1a199','#10ac8499','#00d2d399','#01a3a499'],
          fontSize: '12px'
        }
      }
    }
  
    }
  return(
    <Chart options={options} series={series} type="bar" height={350} />
  )
}