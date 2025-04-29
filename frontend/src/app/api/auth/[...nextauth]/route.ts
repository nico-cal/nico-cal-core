import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/options';

/**
 * NextAuth APIハンドラ
 * すべての認証関連のAPIリクエストを処理する
 * - /api/auth/signin
 * - /api/auth/session
 * - /api/auth/signout
 * など
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
