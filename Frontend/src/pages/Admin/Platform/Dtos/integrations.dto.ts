export interface IIntegrationPlatform{
  id:number;
  date:string;
  name:string;
  url:string;
  description:string;
  ready:number;
  status:number;
}

export interface IProducts{
  id:number;
  integration:string;
  product_id_platform:string;
  community_access:number;
  name:string;
  active:number;
  status:number;
}

export interface IOffers{
  id:number;
  product_id:number;
  offer:string;
  description:string;
  email_copy:number;
  status:number;
}

export interface ICoursesIntegration{
  id:number;
  product_id:number;
  offer_id:number;
  course_id_students:number;
  validity_contract:string;
}

export interface IHookIntegration{
  id:number;
  date:string;
  product_id:number;
  product_name:string;
  offer:string;
  pay_status:string;
  student_name:string;
  student_mail:string;
  data_post:string;
}