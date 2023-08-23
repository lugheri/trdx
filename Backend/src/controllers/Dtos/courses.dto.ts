import {z} from 'zod';

export const CoursesDTO = z.object({
  date_created:z.optional(z.string()),
  image:z.optional(z.number()),
  author:z.optional(z.string()),
  name:z.optional(z.string()),
  description:z.optional(z.string()),
  tags:z.optional(z.string()),
  community:z.optional(z.literal(1).or(z.literal(0))).default(1),
  completed:z.optional(z.literal(1).or(z.literal(0))).default(0),
  order:z.optional(z.number()),
  published:z.optional(z.number()),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type CoursesType = z.infer<typeof CoursesDTO>;

export const CoursesPartialDTO = CoursesDTO.partial();
export type CoursesPartialType = z.infer<typeof CoursesPartialDTO>;

export const PaginationCoursesDTO = z.object({
  status: z.optional(z.literal(1).or(z.literal(0))).default(1),
  page: z.optional(z.number()).default(1),
  order: z.optional(z.enum(['ASC','DESC'])).default('ASC'),
  orderedBy: z.optional(z.string()).default('id'),
})
export type PaginationCoursesType = z.infer<typeof PaginationCoursesDTO>

export const SearchCoursesDTO = z.object({
  params: z.string(),
  value:z.string(),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1),
  page: z.optional(z.number()).default(1),
  order: z.optional(z.enum(['ASC','DESC'])).default('ASC'),
  orderedBy: z.optional(z.string()).default('id'),
})
export type SearchCoursesType = z.infer<typeof SearchCoursesDTO>

//Watched
export const WatchedLessonDTO = z.object({
  viewed: z.number(z.literal(1).or(z.literal(0))).default(1),
  student_id: z.number(),
  course_id: z.number(),
  module_id: z.number(),
  lesson_id: z.number(),
})
export type WatchedLessonType = z.infer<typeof WatchedLessonDTO>

//Rating
export const RatingLessonDTO = z.object({
  score: z.number()
})
export type RatingLessonType = z.infer<typeof RatingLessonDTO>

export const NewCommentLessonDTO = z.object({
  lesson_id:z.number(),
  student_id:z.number(),
  comment:z.string(),
})
export type NewCommentLessonType = z.infer<typeof NewCommentLessonDTO>