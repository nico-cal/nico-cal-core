import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginSchema } from '@/lib/schemas/auth';

/**
 * NextAuth認証オプション設定
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // 認証情報プロバイダー（ユーザーID/パスワード認証）
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        userId: { label: 'ユーザーID', type: 'text' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // 入力値のバリデーション
          const validatedCredentials = loginSchema.parse(credentials);

          // APIエンドポイントに認証リクエストを送信
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedCredentials),
          });

          if (!response.ok) {
            return null;
          }

          const user = await response.json();
          return user;
        } catch (error) {
          console.error('認証エラー:', error);
          return null;
        }
      },
    }),
  ],

  // セッション設定
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30日
  },

  // JWT設定
  jwt: {
    maxAge: 60 * 60, // 1時間
  },

  // コールバック
  callbacks: {
    // JWTコールバック
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.userId;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // セッションコールバック
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.userId as string,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  // ページ設定
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },

  // デバッグモード（開発環境のみ）
  debug: process.env.NODE_ENV === 'development',
};
