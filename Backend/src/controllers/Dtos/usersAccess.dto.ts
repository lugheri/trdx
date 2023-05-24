import { z } from "zod";

export const UserAccessDTO = z.object({
  username: z.string().email('Nome de usuário inválido'),
  password: z.string().min(5,'A senha deve ter mais de 5 dígitos'),
});

export type UserAccessType = z.infer<typeof UserAccessDTO>;
