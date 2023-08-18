import * as Fas from "@fortawesome/free-solid-svg-icons";

export type ToggleType = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
};


export type ButtonType = {
  btn?: 'light'|'info'|'success'|'warning'|'error'|'muted'; 
  submit?: boolean;
  type?: 'default'|'outline'|'notline'; 
  size?: 'sm'|'md'|'lg'; 
  name?: string;
  title?: string;
  border?: 'square'|'rounded'|'circle';
  block?: boolean;
  icon?:null | keyof typeof Fas ;
  className?:string;
  onClick?:() => void;
};