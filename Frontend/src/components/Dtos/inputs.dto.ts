export type InputType={
  value: string;
  inputType?: 'text'|'password'|'date'|'file';
  className?:string;
  label?:string;
  placeholder?:string;
  required?:boolean;
  onChange: (value: string) => void;
}
export type InputNumberType={
  value: string;
  className?:string;
  label?:string;
  min?:number;
  max?:number;
  step?:number;
  required?:boolean;
  onChange: (value: string) => void;
}

export type TextAreaType={
  value: string;  
  placeholder?:string;
  className?:string;
  label?:string;
  required?:boolean;
  onChange: (value: string) => void;
}



export type SelectType={
  value: string|number;
  className?:string;
  label?:string;
  required?:boolean;
  empty?:string;
  options: string[]|number[]|any;
  valueKey: string;
  lableKey: string;
  onChange: React.Dispatch<React.SetStateAction<any>>;
}
//export type RangeType={}