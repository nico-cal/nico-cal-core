import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginSchema } from '@/lib/schemas/auth';

// ユーザー型定義の拡張
declare module 'next-auth' {
  interface User {
    userId: string;
    accessToken: string;
  }
}

// セッション型定義の拡張
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    };
    accessToken: string;
  }
}

// JWT型定義の拡張
declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    accessToken: string;
  }
}

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
          if (!credentials) {
            throw new Error('認証情報が提供されていません');
          }

          const validatedCredentials = loginSchema.safeParse(credentials);
          
          if (!validatedCredentials.success) {
            console.error('バリデーションエラー:', validatedCredentials.error);
            return null;
          }

          // APIエンドポイントに認証リクエストを送信
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(validatedCredentials.data),
            // 認証リクエストのタイムアウト設定
            cache: 'no-store'
          });

          if (!response.ok) {
            // エラーレスポンスの処理
            const errorData = await response.json().catch(() => ({}));
            console.error('認証APIエラー:', { status: response.status, data: errorData });
            return null;
          }

          const user = await response.json();
          return user;
        } catch (error) {
          console.error('認証プロセスエラー:', error);
          return null;
        }
      },
    }),
  ],

  // セッション設定
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30日間
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
        // ユーザー情報がある場合はトークンに保存
        token.userId = user.userId;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    // セッションコールバック
    async session({ session, token }) {
      if (token) {
        // トークン情報をセッションに反映
        session.user = {
          id: token.userId,
        };
        session.accessToken = token.accessToken;
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

  // セキュリティ設定
  secret: process.env.NEXTAUTH_SECRET,
  
  // デバッグモード（開発環境のみ）
  debug: process.env.NODE_ENV === 'development',
};
