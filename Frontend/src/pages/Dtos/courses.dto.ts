export interface ICourse{
  id:number;
  date_created:string;
  image:number;
  author:string;
  name:string;
  description:string;
  tags:string;
  community:number;
  completed:number;
  order:number;
  published:number;
  status:number;
}

export interface IMyCourses{
  id:number;
  image:number;
}

export interface IModules{
  id:number;
  course_id:number;
  image:number;
  type_module:string;
  module:string;
  description:string;
  order:number;
  visibility:number;
  status:number;
}

