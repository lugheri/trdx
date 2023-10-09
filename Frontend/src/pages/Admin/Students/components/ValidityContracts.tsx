import { useState, useEffect, FormEvent } from 'react'
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../../../components/Buttons";
import { IValidityContract } from '../Dtos/validityContracts.dto';
import api from '../../../../services/api';
import moment from 'moment';
import { InputForm, SelectForm } from '../../../../components/Inputs';

interface IValidityContractComponent{
  studentId:number,
  studentName:string,
  courseId:number,
  courseName:string,
  newContract:number|null,
  setNewContract:React.Dispatch<React.SetStateAction<number|null>>,
  removeContract:number|null,
  setRemoveContract:React.Dispatch<React.SetStateAction<number|null>>,
  close:React.Dispatch<React.SetStateAction<number|null>>
}
export const ValidityContract : React.FC<IValidityContractComponent> = (props) => {

  const [ currentContract, setCurrentContract ] = useState<IValidityContract|null>(null)
  const [ listContracts, setListContract ] = useState<IValidityContract[]|null>(null)
  useEffect(()=>{
    const getContracts = async () => {
      try{
        const contracts = await api.get(`validityContracts/${props.studentId}/${props.courseId}`)
        console.log(contracts.data.response)
        setCurrentContract(contracts.data.response.currentContract)
        setListContract(contracts.data.response.contracts)
      }catch(err){
        console.log(err)
      }
    }
    getContracts()
  },[props.removeContract,props.newContract])

  const checkStatusContract = (dateEndContract:string,cycle:string) => {
    if(cycle=="V"){
      return 'Vigente';    
    }
    const today = moment();
    const statusExpired = moment(dateEndContract, 'YYYY-MM-DD');
    if (statusExpired.isBefore(today)) {
      return 'Expirado';
    } else if (statusExpired.isSame(today, 'day')) {
      
      return 'Expira Hoje!';
    } else {
      return 'Vigente';
    }
  }

  const nameCycle = (cycle:string) => {
    return cycle === "A" ? "Anual"
         : cycle === "SM" ? "Semestral"
         : cycle === "T" ? "Trimestral"
         : cycle === "B" ? "Bimestral"
         : cycle === "M" ? "Mensal"
         : cycle === "Q" ? "Quinzenal"
         : cycle === "S" ? "Semanal"
         : "Vitalício"
  }
  
  return(
    <div className="flex flex-col ">
      <div className="flex flex-col items-center bg-slate-700 rounded my-2 p-4">
        <p className="text-neutral-300 w-full text-left text-sm"><strong>Aluno: </strong>{props.studentName}</p>
        <p className="text-neutral-300 w-full text-left text-sm"><strong>Curso: </strong>{props.courseName}</p>

        <table className="mt-4 table-fixed w-[656px]">
          <caption className="caption-top pb-2 text-sky-300 text-thin text-xs">
            <FontAwesomeIcon icon={Fas.faInfoCircle}/> Apenas será considerado o contrato com a data de validade maior!
          </caption>           
          <thead className="bg-neutral-950 text-neutral-300 text-sm">
            <tr>
              <th className="py-2">#</th>
              <th>Inicio Contrato</th>
              <th>Validade</th>
              <th>Ciclo</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
        </table>
        <div className="max-h-[200px] overflow-auto">
          <table className="table-fixed w-[650px]">
            <tbody className="w-full">
              { listContracts === null ?
                <tr className="odd:bg-slate-700 even:bg-slate-600 text-sm text-slate-300 text-center">
                  <td colSpan={6}><FontAwesomeIcon icon={Fas.faCircleNotch} pulse className="text-teal-500"/> Carregando Contratos ...</td>
                </tr>  
              : listContracts.length === 0 ? 
                <tr className="odd:bg-slate-700 even:bg-slate-600 text-sm text-slate-300 text-center">
                  <td colSpan={6} className="p-4"><FontAwesomeIcon icon={Fas.faCalendarXmark} className="text-teal-500"/> Nenhum contrato cadastrado</td>
                </tr>
              : listContracts.map((contract,key)=>
                currentContract?.id === contract.id ? 
                <tr key={key} className={`${checkStatusContract(contract.end_validity,contract.payment_cycle) == 'Expirado' ? 'bg-red-500/50 text-red-300' : checkStatusContract(contract.end_validity,contract.payment_cycle) == 'Expira Hoje!' ? 'bg-orange-400/50 text-orange-200':'bg-teal-700 text-teal-100'} text-sm  text-center`}>                  
                  <td className="py-2 px-1">{contract.id}</td>
                  <td>{moment(contract.start_validity).format('DD/MM/YYYY')}</td>
                  <td>{moment(contract.end_validity).format('DD/MM/YYYY')}</td>
                  <td>{nameCycle(contract.payment_cycle)}</td>
                  <td>{checkStatusContract(contract.end_validity,contract.payment_cycle)}</td>
                  <td className="flex justify-end items-center p-2 text-base">
                    <button className="px-1 text-red-500 opacity-75 hover:opacity-100" onClick={()=>props.setRemoveContract(contract.id)}><FontAwesomeIcon icon={Fas.faTrash}/></button>
                  </td>
                </tr>  
                :
                <tr key={key} className="odd:bg-slate-700 even:bg-slate-600 text-sm text-slate-300 text-center opacity-50 hover:opacity-100">                  
                  <td className="py-2 px-1">{contract.id}</td>
                  <td>{moment(contract.start_validity).format('DD/MM/YYYY')}</td>
                  <td>{moment(contract.end_validity).format('DD/MM/YYYY')}</td>
                  <td>{nameCycle(contract.payment_cycle)}</td>
                  <td>Inativo</td>
                  <td className="flex justify-end items-center p-2 text-base">
                    <button className="px-1 text-red-500 opacity-75 hover:opacity-100" onClick={()=>props.setRemoveContract(contract.id)}><FontAwesomeIcon icon={Fas.faTrash}/></button>
                  </td>
                </tr>  
              )}                          
            </tbody>
          </table> 
        </div>
        <Button icon="faCalendarPlus" name="Criar novo contrato de vigencia" btn="info" onClick={()=>props.setNewContract(1)} />
      </div>
      <div className="flex justify-end items-center">
        <Button name="Fechar" btn="muted" type="notline" onClick={()=>props.close(null)}/>
      </div>
    </div>
  )
}

interface INewValidityContract{
  studentId:number,
  studentName:string,
  courseId:number,
  courseName:string,
  close:React.Dispatch<React.SetStateAction<number|null>>
}
export const NewValidityContract : React.FC<INewValidityContract> = (props) => {
  const [ startContract, setStartContract ] = useState("")
  const [ cycle, setCycle ] = useState("")
  const [ endContract, setEndContract ] = useState("")

  useEffect(()=>{
    if(startContract){
      const init = moment(startContract, 'YYYY-MM-DD');
      const end = cycle == "A" ? init.add(1, 'years').format('YYYY-MM-DD')
                : cycle == "SM" ? init.add(6, 'months').format('YYYY-MM-DD')
                : cycle == "T" ? init.add(3, 'months').format('YYYY-MM-DD')
                : cycle == "B" ? init.add(2, 'months').format('YYYY-MM-DD')
                : cycle == "M" ? init.add(1, 'months').format('YYYY-MM-DD')
                : cycle == "Q" ? init.add(15, 'days').format('YYYY-MM-DD')
                : cycle == "S" ? init.add(7, 'days').format('YYYY-MM-DD')
                : ""
                console.log('END',end)
      setEndContract(end)
    }
  },[startContract,cycle])

  const plans = [{value:"A",name:"Anual (12 Meses)"},
                 {value:"SM",name:"Semestral (6 Meses)"},
                 {value:"T",name:"Trimestral (3 Meses)"},
                 {value:"B",name:"Bimestral (2 Meses)"},
                 {value:"M",name:"Mensal (1 Mês)"},
                 {value:"Q",name:"Quinzenal (15 Dias)"},
                 {value:"S",name:"Semanal (7 Dias)"},
                 {value:"V",name:"Vitalício"}]

  const newContract = async (e:FormEvent) => {
    e.preventDefault()
    try{
      const data = {
        student_id:props.studentId,
        course_id:props.courseId,
        start_validity:startContract,
        end_validity:endContract,
        payment_cycle:cycle
      }
      await api.post(`addContract`,data)
      props.close(null)
    }catch(err){
      console.log(err)
    }

  }

  return(
    <form onSubmit={(e)=>newContract(e)}>
      <div className="flex flex-col bg-gray-900 rounded my-2 py-4 px-8">
        <InputForm label="Data de Inicio" inputType='date' required value={startContract} onChange={setStartContract}/>
        <SelectForm label="Ciclo" empty='Selecione o ciclo de vigência' options={plans} lableKey='name' required valueKey='value' value={cycle} onChange={setCycle} />
        <InputForm label="Data de Término" inputType='date' value={endContract} onChange={setEndContract}/>
      </div>
      <div className="flex justify-end items-center">
        <Button name="Cancelar" btn="muted" type="notline" onClick={()=>props.close(null)}/>
        <Button name="Criar Contrato" icon="faSave" btn="success" submit />
      </div>
    </form>
  )
}

interface IRemoveValidityContract{
  contractId:number,
  close:React.Dispatch<React.SetStateAction<number|null>>
}
export const RemoveValidityContract : React.FC<IRemoveValidityContract> = (props) => {
  const deleteContract = async () => {
    try{      
      await api.delete(`removeContract/${props.contractId}`)
      props.close(null)
    }catch(err){
      console.log(err)
    }
  }
  return(
    <div>
      <p className="text-slate-200 text-lg mx-2 my-4">Confirmar remoção do contrato de vigência?</p>

      <div className="flex justify-end items-center">
        <Button name="Cancelar" btn="muted" type="notline" onClick={()=>props.close(null)}/>
        <Button name="Sim, Remover" icon="faTrash" btn="error" onClick={()=>deleteContract()}/>
      </div>
    </div>
  )
}