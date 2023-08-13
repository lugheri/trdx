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

export interface IStudentCourse{
  id:number;
  date_created:string;
  date_validity:string;
  payment_cycle:string;
  student_id:number;
  course_id:number;
  concluded:number;
  status:number;
}


export interface IMyCourses{
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
  StudentsCourse:IStudentCourse		
}

