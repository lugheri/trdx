import {z} from 'zod';

export const QuizQuestionDTO = z.object({
  quiz_id:z.optional(z.number()),
  type_question:z.optional(z.string()),
  question:z.optional(z.string()),
  order:z.optional(z.number()),
  question_grade:z.optional(z.number()),
  public:z.optional(z.number()),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type QuizQuestionType = z.infer<typeof QuizQuestionDTO>;

export const QuizQuestionOptionsDTO = z.object({
  question_id:z.optional(z.number()),
  answer:z.optional(z.string()),
  correct_answer:z.optional(z.number()),
  order:z.optional(z.number()),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type QuizQuestionOptionsType = z.infer<typeof QuizQuestionOptionsDTO>;

export const QuizQuestionSettingsDTO = z.object({
  quiz_id:z.optional(z.number()),
  home_title_1:z.optional(z.string()),
  home_title_2:z.optional(z.string()),
  home_text:z.optional(z.string()),
  reproved_title_1:z.optional(z.string()),
  reproved_title_2:z.optional(z.string()),
  reproved_text:z.optional(z.string()),
  approved_title_1:z.optional(z.string()),
  approved_title_2:z.optional(z.string()),
  approved_text:z.optional(z.string()),
  hours_retry_on_fail:z.optional(z.number()).default(0),
  show_modules:z.optional(z.number()).default(0),
  passing_threshold:z.optional(z.number()).default(0)})
export type QuizQuestionSettingsType = z.infer<typeof QuizQuestionSettingsDTO>;