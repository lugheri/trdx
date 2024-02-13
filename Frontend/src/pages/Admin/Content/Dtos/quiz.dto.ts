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