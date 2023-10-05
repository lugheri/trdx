export interface IValidityContract{
  id: number;
  student_id: number;
  course_id: number;
  start_validity: string;
  end_validity: string;
  payment_cycle: string;
  expire: number;
  lifetime: number;
}