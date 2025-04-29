'use client';

import Link from 'next/link';
import { useAuth, useRequireAuth } from '@/lib/auth/utils';

/**
 * ホームページ（認証保護あり）
 */
export default function Home() {
  // 認証保護（非認証ユーザーはログインページにリダイレクト）
  const { isLoading } = useRequireAuth();
  const { session, signOut } = useAuth();

  // 認証中はローディング表示
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">nico-cal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session?.user?.id}さん、こんにちは</span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">ようこそ！</h2>
          <p className="mb-4">
            これはnico-calのホームページです。認証された状態でのみアクセスできます。
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="border p-4 rounded-md hover:bg-gray-50">
              <h3 className="font-bold mb-2">カレンダーを見る</h3>
              <p className="text-sm text-gray-600 mb-4">月別カレンダーで日記を確認できます。</p>
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                カレンダーを開く →
              </Link>
            </div>
            <div className="border p-4 rounded-md hover:bg-gray-50">
              <h3 className="font-bold mb-2">今日の日記を書く</h3>
              <p className="text-sm text-gray-600 mb-4">今日の出来事を記録しましょう。</p>
              <Link href="/diary/new" className="text-blue-600 hover:underline">
                日記を書く →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} nico-cal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
