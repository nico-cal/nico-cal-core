import { z } from 'zod';

/**
 * ログインフォームのバリデーションスキーマ
 */
export const loginSchema = z.object({
  userId: z
    .string()
    .min(3, { message: 'ユーザーIDは3文字以上で入力してください' })
    .max(20, { message: 'ユーザーIDは20文字以下で入力してください' }),
  password: z
    .string()
    .min(8, { message: 'パスワードは8文字以上で入力してください' })
    .regex(/[a-zA-Z]/, { message: 'パスワードには英字を含める必要があります' })
    .regex(/[0-9]/, { message: 'パスワードには数字を含める必要があります' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;