"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteStudentsDTO = exports.RatingLessonDTO = exports.WatchedLessonDTO = exports.NewCommentLessonDTO = exports.CommentLessonDTO = exports.LessonAttachmentDTO = exports.LessonAccessRuleDTO = exports.ModulesLessonModuleDTO = exports.ModulesCourseDTO = exports.SearchCoursesDTO = exports.PaginationCoursesDTO = exports.CoursesPartialDTO = exports.CoursesDTO = void 0;
const zod_1 = require("zod");
//Courses
exports.CoursesDTO = zod_1.z.object({
    date_created: zod_1.z.optional(zod_1.z.string()),
    image: zod_1.z.optional(zod_1.z.number()),
    background_image: zod_1.z.optional(zod_1.z.number()),
    default_thumb: zod_1.z.optional(zod_1.z.number()),
    author: zod_1.z.optional(zod_1.z.string()),
    name: zod_1.z.optional(zod_1.z.string()),
    description: zod_1.z.optional(zod_1.z.string()),
    tags: zod_1.z.optional(zod_1.z.string()),
    community: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
    completed: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(0),
    order: zod_1.z.optional(zod_1.z.number()),
    published: zod_1.z.optional(zod_1.z.number()),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
exports.CoursesPartialDTO = exports.CoursesDTO.partial();
exports.PaginationCoursesDTO = zod_1.z.object({
    published: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
    page: zod_1.z.optional(zod_1.z.number()).default(1),
    order: zod_1.z.optional(zod_1.z.enum(['ASC', 'DESC'])).default('ASC'),
    orderedBy: zod_1.z.optional(zod_1.z.string()).default('id'),
});
exports.SearchCoursesDTO = zod_1.z.object({
    params: zod_1.z.string(),
    value: zod_1.z.string(),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
    page: zod_1.z.optional(zod_1.z.number()).default(1),
    order: zod_1.z.optional(zod_1.z.enum(['ASC', 'DESC'])).default('ASC'),
    orderedBy: zod_1.z.optional(zod_1.z.string()).default('id'),
});
//MODULES
exports.ModulesCourseDTO = zod_1.z.object({
    course_id: zod_1.z.optional(zod_1.z.number()),
    image: zod_1.z.optional(zod_1.z.number()),
    type_module: zod_1.z.optional(zod_1.z.string()),
    module: zod_1.z.optional(zod_1.z.string()),
    description: zod_1.z.optional(zod_1.z.string()),
    order: zod_1.z.optional(zod_1.z.number()),
    visibility: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(0),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
//Lessons
exports.ModulesLessonModuleDTO = zod_1.z.object({
    course_id: zod_1.z.optional(zod_1.z.number()),
    module_id: zod_1.z.optional(zod_1.z.number()),
    date_created: zod_1.z.optional(zod_1.z.string()),
    type_lesson: zod_1.z.optional(zod_1.z.string()),
    max_time: zod_1.z.optional(zod_1.z.string()),
    top_score: zod_1.z.optional(zod_1.z.number()),
    teacher_id: zod_1.z.optional(zod_1.z.number()),
    type_content: zod_1.z.optional(zod_1.z.string()),
    link: zod_1.z.optional(zod_1.z.string()),
    video_platform: zod_1.z.optional(zod_1.z.string()),
    image: zod_1.z.optional(zod_1.z.number()),
    name: zod_1.z.optional(zod_1.z.string()),
    description: zod_1.z.optional(zod_1.z.string()),
    tags: zod_1.z.optional(zod_1.z.string()),
    order: zod_1.z.optional(zod_1.z.number()),
    visibility: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(0),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
//Lesson Access Rules
exports.LessonAccessRuleDTO = zod_1.z.object({
    lesson_id: zod_1.z.optional(zod_1.z.number()),
    rule_access: zod_1.z.optional(zod_1.z.string()),
    days_to_access: zod_1.z.optional(zod_1.z.number()),
    date_of_access: zod_1.z.optional(zod_1.z.string())
});
//Lesson Attachment
exports.LessonAttachmentDTO = zod_1.z.object({
    course_id: zod_1.z.optional(zod_1.z.number()),
    module_id: zod_1.z.optional(zod_1.z.number()),
    lesson_id: zod_1.z.optional(zod_1.z.number()),
    name: zod_1.z.optional(zod_1.z.string()),
    description: zod_1.z.optional(zod_1.z.string()),
    type: zod_1.z.optional(zod_1.z.string()),
    material: zod_1.z.optional(zod_1.z.string()),
    status: zod_1.z.optional(zod_1.z.number())
});
//Comments
exports.CommentLessonDTO = zod_1.z.object({
    date_created: zod_1.z.optional(zod_1.z.string()),
    lesson_id: zod_1.z.optional(zod_1.z.number()),
    student_id: zod_1.z.optional(zod_1.z.number()),
    teacher_id: zod_1.z.optional(zod_1.z.number()),
    answers_comment_id: zod_1.z.optional(zod_1.z.number()).default(0),
    comment: zod_1.z.optional(zod_1.z.string()),
    public: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
    status: zod_1.z.optional(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1)
});
exports.NewCommentLessonDTO = zod_1.z.object({
    lesson_id: zod_1.z.number(),
    student_id: zod_1.z.number(),
    comment: zod_1.z.string(),
});
//Watched
exports.WatchedLessonDTO = zod_1.z.object({
    viewed: zod_1.z.number(zod_1.z.literal(1).or(zod_1.z.literal(0))).default(1),
    student_id: zod_1.z.number(),
    course_id: zod_1.z.number(),
    module_id: zod_1.z.number(),
    lesson_id: zod_1.z.number(),
});
//Rating
exports.RatingLessonDTO = zod_1.z.object({
    score: zod_1.z.number()
});
//Notes
exports.NoteStudentsDTO = zod_1.z.object({
    student_id: zod_1.z.number(),
    course_id: zod_1.z.number(),
    note: zod_1.z.string(),
});
