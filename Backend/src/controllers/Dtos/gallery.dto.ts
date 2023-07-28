import {z} from 'zod';
//DTO FROM FOLDERS
export const FolderDTO = z.object({
  name: z.string(),
  description: z.optional(z.string()),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type FolderType = z.infer<typeof FolderDTO>

//Optional values for edit functions
export const FolderPartialDTO = FolderDTO.partial();
export type FolderPartialType = z.infer<typeof FolderPartialDTO>;

//DTO from Filter Gallery
export const FileGalleryDTO = z.object({
  name:z.string(),
  description:z.optional(z.string()).default('Sem Descrição'),
  folder:z.optional(z.string()).default('0'),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type FileGalleryType = z.infer<typeof FileGalleryDTO>;

//New File Gallery
export const GalleryDTO = z.object({ 
  name:z.string(),
  description:z.optional(z.string()).default('Sem Descrição'),
  file:z.string(),
  extension:z.string(),
  size:z.number(),
  folder:z.optional(z.string()).default('0'),
  status: z.optional(z.literal(1).or(z.literal(0))).default(1)
})
export type GalleryType = z.infer<typeof GalleryDTO>;


//Optional values for edit functions
export const FileGalleryPartialDTO = FileGalleryDTO.partial();
export type FileGalleryPartialType = z.infer<typeof FileGalleryPartialDTO>;



export const PaginationGalleryDTO = z.object({
  status: z.optional(z.literal(1).or(z.literal(0))).default(1),
  page: z.optional(z.number()).default(1),
  order: z.optional(z.enum(['ASC','DESC'])).default('ASC'),
  orderedBy: z.optional(z.string()).default('id'),
})
export type PaginationGalleryTypes = z.infer<typeof PaginationGalleryDTO>