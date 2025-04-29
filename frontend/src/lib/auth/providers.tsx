'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

type AuthProvidersProps = {
  children: ReactNode;
};

/**
 * 認証プロバイダーコンポーネント
 * アプリケーション全体に認証コンテキストを提供する
 */
export function AuthProviders({ children }: AuthProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
