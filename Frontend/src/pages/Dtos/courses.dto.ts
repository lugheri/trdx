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

export interface ILessons{
  id:number;
  course_id:number;
  module_id:number;
  date_created:string;
  type_lesson:string;
  max_time:string;
  top_score:number;
  teacher_id:number;
  type_content:string;
  link:string;
  video_platform:string;
  image:number;
  name:string;
  description:string;
  tags:string;
  order:number;
  visibility:number;
  status:number;
}

