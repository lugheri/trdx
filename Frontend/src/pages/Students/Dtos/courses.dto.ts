export interface ICourse{
  id:number;
  date_created:string;
  image:number;
  background_image:number;
  default_thumb:number;
  link_page:string;
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
  background_image:number;
  default_thumb:number;
  name:string;
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

export interface ILessonsViewed{
  id:number;  
  date_created:string;
  course_id:number;
  module_id:number;
  lesson_id:number;
  student_id:number;
  score:number;
}

export interface ILessonsModule{
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
  LessonsViewed?: {
    id: number;
  };
}


export interface ICommentLessons{
  id:number;
  date_created:string;
  lesson_id:number;
  student_id:number;
  teacher_id:number;
  answers_comment_id:number;
  comment:string;
  public:number;
  status:number;
  Student?:{
    id:number;
    photo:number;
    name:string;
  }
}


export interface INoteLesson{
  id:number;
  date_created:string;
  student_id:number;
  course_id:number;
  module_id:number;
  lesson_id:number;
  note:string;
}


export interface IAttachmentsLesson{
  id:number;
  date_created:string;
  course_id:number;
  module_id:number;
  lesson_id:number;
  name:string;
  description:string;
  type:string;
  material:string;
  status:number;
}





