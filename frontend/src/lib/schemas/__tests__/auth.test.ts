import { describe, it, expect } from 'vitest';
import { loginSchema } from '../auth';

describe('認証スキーマ', () => {
  describe('loginSchema', () => {
    it('有効なユーザーIDとパスワードを検証できること', () => {
      const validInput = {
        userId: 'testuser',
        password: 'Password123',
      };

      const result = loginSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    describe('ユーザーID検証', () => {
      it('3文字未満のユーザーIDはエラーとなること', () => {
        const invalidInput = {
          userId: 'ab',
          password: 'Password123',
        };

        const result = loginSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
        
        if (!result.success) {
          const formattedErrors = result.error.format();
          expect(formattedErrors.userId?._errors).toContain(
            'ユーザーIDは3文字以上で入力してください'
          );
        }
      });

      it('20文字を超えるユーザーIDはエラーとなること', () => {
        const invalidInput = {
          userId: 'a'.repeat(21),
          password: 'Password123',
        };

        const result = loginSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
        
        if (!result.success) {
          const formattedErrors = result.error.format();
          expect(formattedErrors.userId?._errors).toContain(
            'ユーザーIDは20文字以下で入力してください'
          );
        }
      });
    });

    describe('パスワード検証', () => {
      it('8文字未満のパスワードはエラーとなること', () => {
        const invalidInput = {
          userId: 'testuser',
          password: 'Pass1',
        };

        const result = loginSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
        
        if (!result.success) {
          const formattedErrors = result.error.format();
          expect(formattedErrors.password?._errors).toContain(
            'パスワードは8文字以上で入力してください'
          );
        }
      });

      it('英字を含まないパスワードはエラーとなること', () => {
        const invalidInput = {
          userId: 'testuser',
          password: '12345678',
        };

        const result = loginSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
        
        if (!result.success) {
          const formattedErrors = result.error.format();
          expect(formattedErrors.password?._errors).toContain(
            'パスワードには英字を含める必要があります'
          );
        }
      });

      it('数字を含まないパスワードはエラーとなること', () => {
        const invalidInput = {
          userId: 'testuser',
          password: 'Password',
        };

        const result = loginSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
        
        if (!result.success) {
          const formattedErrors = result.error.format();
          expect(formattedErrors.password?._errors).toContain(
            'パスワードには数字を含める必要があります'
          );
        }
      });
    });

    it('ユーザーIDとパスワードの両方がエラーとなるケース', () => {
      const invalidInput = {
        userId: 'ab',
        password: 'pass',
      };

      const result = loginSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const formattedErrors = result.error.format();
        expect(formattedErrors.userId?._errors).toContain(
          'ユーザーIDは3文字以上で入力してください'
        );
        expect(formattedErrors.password?._errors).toContain(
          'パスワードは8文字以上で入力してください'
        );
      }
    });
  });
});
