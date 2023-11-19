import {z} from 'zod';
//Courses
export const CoursesDTO = z.object({
  date_created:z.optional(z.string()),
  image:z.optional(z.number()),
  background_image:z.optional(z.number()),
  default_thumb:z.optional(z.number()),
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
  published: z.optional(z.literal(1).or(z.literal(0))).default(1),
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

//MODULES
export const ModulesCourseDTO = z.object({
  course_id:z.optional(z.number()),
  image:z.optional(z.number()),
  type_module:z.optional(z.string()),
  module:z.optional(z.string()),
  description:z.optional(z.string()),
  order:z.optional(z.number()),
  visibility:z.optional(z.literal(1).or(z.literal(0))).default(0),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type ModulesCourseType = z.infer<typeof ModulesCourseDTO>;

//Lessons
export const ModulesLessonModuleDTO = z.object({
  course_id:z.optional(z.number()),
  module_id:z.optional(z.number()),
  date_created:z.optional(z.string()),
  type_lesson:z.optional(z.string()),
  max_time:z.optional(z.string()),
  top_score:z.optional(z.number()),
  teacher_id:z.optional(z.number()),
  type_content:z.optional(z.string()),
  link:z.optional(z.string()),
  video_platform:z.optional(z.string()),
  image:z.optional(z.number()),
  name:z.optional(z.string()),
  description:z.optional(z.string()),
  tags:z.optional(z.string()),
  order:z.optional(z.number()),
  visibility:z.optional(z.literal(1).or(z.literal(0))).default(0),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type ModulesLessonModuleType = z.infer<typeof ModulesLessonModuleDTO>;



//Comments
export const CommentLessonDTO = z.object({
  date_created:z.optional(z.string()),
  lesson_id:z.optional(z.number()),
  student_id:z.optional(z.number()),
  teacher_id:z.optional(z.number()),
  answers_comment_id:z.optional(z.number()).default(0),
  comment:z.optional(z.string()),
  public:z.optional(z.literal(1).or(z.literal(0))).default(1),
  status:z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type CommentLessonType = z.infer<typeof CommentLessonDTO>



export const NewCommentLessonDTO = z.object({
  lesson_id:z.number(),
  student_id:z.number(),
  comment:z.string(),
})
export type NewCommentLessonType = z.infer<typeof NewCommentLessonDTO>



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

//Notes
export const NoteStudentsDTO = z.object({
  student_id:z.number(),
  course_id:z.number(),
  note:z.string(),
})
export type NoteStudentsType = z.infer<typeof NoteStudentsDTO>

