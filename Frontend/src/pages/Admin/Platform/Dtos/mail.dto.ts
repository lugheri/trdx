export interface IMail{
  id:number;
  date:string;
  name:string;
  host:string;
  port:number;
  secure:number;
  user:string;
  pass:string;
  status:number;
}

export interface ICopyEmail{
  id:number;
  date:string;
  title:string;
  subject:string;
  body:string;
  status:number;
}