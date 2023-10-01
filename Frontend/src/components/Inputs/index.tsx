import React, { ChangeEvent } from 'react';
import { InputType,InputNumberType,TextAreaType,SelectType } from "../Dtos/inputs.dto";

export const InputForm: React.FC<InputType> = (props) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>)=>{
    props.onChange(e.target.value)
  }
  return (
    <div className="flex flex-col flex-1">
      {!props.label ? false 
      : (<label className="font-semibold italic text-sm text-slate-500 dark:text-slate-300">
          {props.label}
        </label>)}
      <input 
        type={props.inputType ? props.inputType : "text"} 
        className={`${props.className} shadow border rounded p-2 placeholder:italic mb-4 bg-zinc-700 text-white placeholder:text-zinc-400 
                   border-slate-700 focus:border-b-4 focus:ring-0 focus:border-teal-600`} 
        placeholder={props.placeholder} 
        value={props.value}
        required={props.required}
        onChange={handleInputChange} />
    </div>
  ) 
}


export const InputNumberForm: React.FC<InputNumberType> = (props) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>)=>{
    props.onChange(e.target.value)
  }
  return (
    <div className="flex flex-col flex-1">
      {!props.label ? false 
      : (<label className="font-semibold italic text-sm text-slate-500 dark:text-slate-300">
          {props.label}
        </label>)}
      <input 
        type="number" 
        className={`shadow border rounded p-2 placeholder:italic mb-4 bg-zinc-700 text-white placeholder:text-zinc-400 
                   border-slate-700 focus:border-b-4 focus:ring-0 focus:border-teal-600 ${props.className} `} 
        value={props.value}
        min={props.min}
        max={props.max}
        step={props.step}
        required={props.required}
        onChange={handleInputChange} />
    </div>
  ) 
}

export const TextAreaForm: React.FC<TextAreaType> = (props) => {
  const handleTextareaChange  = (e: ChangeEvent<HTMLTextAreaElement>)=>{
    props.onChange(e.target.value)
  }
  return (
    <div className="flex flex-col flex-1">
      {!props.label ? false 
      : (<label className="font-semibold italic text-sm text-slate-500 dark:text-slate-300">
         {props.label}
        </label>)}
      <textarea 
        className={`shadow border border-slate-300 mb-4 rounded text-slate-700 p-2 placeholder:italic placeholder:text-slate-400
                    dark:bg-zinc-600 dark:border-slate-800 dark:text-white dark:placeholder:text-zinc-400 bg-slate-200
                    focus:border-b-4 focus:border-teal-600 focus:ring-0 dark:focus:border-zinc-300 ${props.className}`} 
        value={props.value}
        placeholder={props.placeholder} 
        required={props.required}
        onChange={handleTextareaChange } />
    </div>
  ) 
}

export const SelectForm: React.FC<SelectType> = (props) => {
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>)=>{
    props.onChange(e.target.value)
  }
  return (
    <div className="flex flex-col flex-1">
      {!props.label ? false 
      : (<label className="font-semibold italic text-sm text-slate-500 dark:text-slate-300">
          {props.label}
        </label>)}  
      <select 
        className={`shadow border rounded p-2 placeholder:italic mb-4 bg-zinc-700 text-white placeholder:text-zinc-400 
               border-slate-700 focus:border-b-4 focus:ring-0 focus:border-teal-600 ${props.className} `}  
        value={props.value} 
        onChange={handleSelectChange} 
        required={props.required}>
          { props.empty ? ( <option value="">{props.empty}</option>) : false}
          { !props.valueKey ? false
            : props.options.map((option:any, index:any) => (
              <option 
                key={index} 
                value={option[props.valueKey]}>
                  {option[props.lableKey]}
              </option>
             ))}
      </select>
    </div>
  ) 
}
//export const Range = () => {}