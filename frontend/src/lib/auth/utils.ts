'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

/**
 * カスタム認証フック
 * セッション情報と認証状態を取得するためのフック
 * @returns セッション情報と認証状態
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  return {
    session,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
  };
}

/**
 * 認証が必要なコンポーネントで使用するためのフック
 * 非認証ユーザーをログインページにリダイレクトする
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  // 認証状態が確定し、認証されていない場合はリダイレクト
  if (!isLoading && !isAuthenticated) {
    redirect('/login');
  }

  return { isAuthenticated, isLoading };
}

/**
 * 既に認証済みのユーザーをリダイレクトするためのフック
 */
export function useRedirectIfAuthenticated() {
  const { isAuthenticated, isLoading } = useAuth();

  // 認証状態が確定し、認証されている場合はリダイレクト
  if (!isLoading && isAuthenticated) {
    redirect('/');
  }

  return { isAuthenticated, isLoading };
}

/**
 * アクセストークンを取得するためのフック
 * @returns アクセストークン
 */
export function useAccessToken() {
  const { session } = useAuth();
  return session?.accessToken;
}
