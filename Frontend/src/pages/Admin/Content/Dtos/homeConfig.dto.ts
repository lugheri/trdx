import * as Fas from "@fortawesome/free-solid-svg-icons";

export interface IButtonHomeConfig{
  id:number;
  type: 'light'|'info'|'success'|'warning'|'error'|'muted'|'default'; 
  icon:null | keyof typeof Fas ;
  name:string;
  link:string;
  order:number;
  status:number;
}

export interface ISocialButton{
  id:number;
  social_media:string;
  text:string;
  link:string;
  order:number;
  status:number;
}