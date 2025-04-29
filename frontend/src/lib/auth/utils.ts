'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useCallback, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { LoginFormValues } from '@/lib/schemas/auth';

/**
 * カスタム認証フック
 * セッション情報と認証状態を取得するためのフック
 * @returns セッション情報と認証状態
 */
export function useAuth() {
  const { data: session, status, update } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  // セッション更新メソッド
  const refreshSession = useCallback(async () => {
    await update();
  }, [update]);

  return {
    session,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    refreshSession,
  };
}

/**
 * ログイン処理を行うためのフック
 * フォームデータを用いてログイン処理を実行する
 * @returns ログイン関連の関数と状態
 */
export function useLogin() {
  const router = useRouter();

  const login = useCallback(
    async (credentials: LoginFormValues) => {
      try {
        const result = await signIn('credentials', {
          userId: credentials.userId,
          password: credentials.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        if (result?.ok) {
          router.push('/');
          router.refresh();
          return { success: true };
        }

        return { success: false, error: '認証に失敗しました' };
      } catch (error) {
        console.error('ログインエラー:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : '認証処理中にエラーが発生しました',
        };
      }
    },
    [router]
  );

  return { login };
}

/**
 * 認証が必要なコンポーネントで使用するためのフック
 * 非認証ユーザーをログインページにリダイレクトする
 * @param options リダイレクト先などのオプション
 */
export function useRequireAuth(options?: { redirectTo?: string }) {
  const { isAuthenticated, isLoading } = useAuth();
  const redirectPath = options?.redirectTo || '/login';

  useEffect(() => {
    // 認証状態が確定し、認証されていない場合はリダイレクト
    if (!isLoading && !isAuthenticated) {
      redirect(redirectPath);
    }
  }, [isAuthenticated, isLoading, redirectPath]);

  return { isAuthenticated, isLoading };
}

/**
 * 既に認証済みのユーザーをリダイレクトするためのフック
 * @param options リダイレクト先などのオプション
 */
export function useRedirectIfAuthenticated(options?: { redirectTo?: string }) {
  const { isAuthenticated, isLoading } = useAuth();
  const redirectPath = options?.redirectTo || '/';

  useEffect(() => {
    // 認証状態が確定し、認証されている場合はリダイレクト
    if (!isLoading && isAuthenticated) {
      redirect(redirectPath);
    }
  }, [isAuthenticated, isLoading, redirectPath]);

  return { isAuthenticated, isLoading };
}

/**
 * アクセストークンを取得するためのフック
 * @returns アクセストークンと更新関数
 */
export function useAccessToken() {
  const { session, refreshSession } = useAuth();
  return { 
    accessToken: session?.accessToken,
    refreshToken: refreshSession 
  };
}

/**
 * ログアウト処理を行うためのフック
 * @returns ログアウト関数
 */
export function useLogout() {
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await signOut({ callbackUrl: '/login' });
      return { success: true };
    } catch (error) {
      console.error('ログアウトエラー:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'ログアウト処理中にエラーが発生しました' 
      };
    }
  }, []);

  return { logout };
}
