import React, { ChangeEvent } from 'react';
import { InputType,InputNumberType,TextAreaType,SelectType, SearchType } from "../Dtos/inputs.dto";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export const InputForm: React.FC<InputType> = (props) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>)=>{
    props.onChange(e.target.value)
  }
  return (
    <div className="flex flex-col flex-1">
      {!props.label ? false 
      : (<label className="font-semibold italic text-sm text-neutral-300 py-1">
          {props.label}
        </label>)}
      <input 
        type={props.inputType ? props.inputType : "text"} 
        className={`${props.className} font-light shadow text-white border rounded-md p-2 placeholder:italic placeholder:font-light placeholder:text-neutral-400 mb-4 bg-neutral-500/20 border-neutral-700 focus:border-b-4 focus:border-x-0 focus:border-t-0 focus:ring-0 focus:border-teal-600 `} 
        placeholder={props.placeholder} 
        value={props.value}
        required={props.required}
        onChange={handleInputChange} />
    </div>
  ) 
}
export const InputNumberForm: React.FC<InputNumberType> = (props) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>)=>{
    props.onChange(parseInt(e.target.value))
  }
  return (
    <div className="flex flex-col flex-1">
      {!props.label ? false 
      : (<label className="font-semibold italic text-sm text-neutral-300 py-1">
          {props.label}
        </label>)}
      <input 
        type="number" 
        className={`${props.className} font-light shadow text-white border rounded-md p-2 placeholder:italic placeholder:font-light placeholder:text-neutral-400 mb-4 bg-neutral-500/20 border-neutral-700 focus:border-b-4 focus:border-x-0 focus:border-t-0 focus:ring-0 focus:border-teal-600 `} 
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
      : (<label className="font-semibold italic text-sm text-neutral-300  py-1">
         {props.label}
        </label>)}
      <textarea 
         className={` font-light shadow text-white border rounded-md p-2 placeholder:italic placeholder:font-light placeholder:text-neutral-400 mb-4 bg-neutral-500/20 border-neutral-700 focus:border-b-4 focus:border-x-0 focus:border-t-0 focus:ring-0 focus:border-teal-600 ${props.className} `} 
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
      : (<label className="font-semibold italic text-sm text-neutral-300 py-1">
          {props.label}
        </label>)}  
      <select 
        className={`${props.className} font-light shadow text-white border rounded-md p-2 placeholder:italic placeholder:font-light placeholder:text-neutral-900 mb-4 bg-neutral-500/20 border-neutral-700 focus:border-b-4 focus:border-x-0 focus:border-t-0 focus:ring-0 focus:border-teal-600 `} 
        value={props.value} 
        onChange={handleSelectChange} 
        required={props.required}>
          { props.empty ? ( <option value="">{props.empty}</option>) : false}
          { !props.valueKey ? false
            : props.options.map((option:any, index:any) => (
              <option 
                key={index} 
                className="text-neutral-900"
                value={option[props.valueKey]}>
                  {option[props.lableKey]}
              </option>
             ))}
      </select>
    </div>
  ) 
}

export const SearchInputForm: React.FC<SearchType> = (props) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>)=>{
    props.onChange(e.target.value)
  }
  return (
    <div className="flex flex-col flex-1">
      {!props.label ? false 
      : (<label className="font-semibold italic text-sm text-neutral-300 py-1">
          {props.label}
        </label>)}
      <div className={`${props.className} flex justify-center items-center font-light shadow text-white border rounded-md  mb-2 bg-neutral-500/20 border-neutral-700`}>
        <input 
          type="text"
          className="w-full p-2 text-white placeholder:italic placeholder:font-light border-0 placeholder:text-neutral-400 bg-transparent  focus:border-0 focus:ring-0"
          placeholder={props.placeholder} 
          value={props.value}
          required={props.required}
          onChange={handleInputChange} />
        { props.icon ? (<FontAwesomeIcon className="mx-2 text-neutral-300/50" icon={Fas[props.icon] as IconProp}/>) : false}  
      </div>  
      
    </div>
  ) 
}


//export const Range = () => {}