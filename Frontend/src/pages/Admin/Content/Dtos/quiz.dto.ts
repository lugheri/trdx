export interface IQuestionQuiz{
  id:number;
  quiz_id:number;
  type_question:string;
  question:string;
  order:number;
  question_grade:number;
  public:number;
  status:number;
}

export interface IOptionQuestionQuiz{
  id:number;
  question_id:number;
  answer:string;
  correct_answer:number;
  order:number;
  status:number;
}

export interface ISettingsQuiz{
  id:number;
  quiz_id:number;
  home_title_1:string;
  home_title_2:string;
  home_text:string;
  reproved_title_1:string;
  reproved_title_2:string;
  reproved_text:string;
  approved_title_1:string;
  approved_title_2:string;
  approved_text:string;
  hours_retry_on_fail:number;
  show_modules:number;
  passing_threshold:number;
}