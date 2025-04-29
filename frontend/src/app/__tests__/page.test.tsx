import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';

// Link コンポーネントをモック
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
}));

// 認証フックをモック
vi.mock('@/lib/auth/utils', () => ({
  useRequireAuth: vi.fn().mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
  }),
  useAuth: vi.fn().mockReturnValue({
    session: {
      user: {
        id: 'testuser',
      },
    },
    signOut: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
  }),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('認証済みユーザーに正しくレンダリングされること', () => {
    render(<Home />);

    // ヘッダーが表示されていることを確認
    expect(screen.getByRole('heading', { name: /nico-cal/i })).toBeInTheDocument();
    expect(screen.getByText(/testuser/, { exact: false })).toBeInTheDocument();
    expect(screen.getByText('ログアウト')).toBeInTheDocument();

    // メインコンテンツが表示されていることを確認
    expect(screen.getByText('ようこそ！')).toBeInTheDocument();
    
    // ナビゲーションリンクが表示されていることを確認
    expect(screen.getByText('カレンダーを見る')).toBeInTheDocument();
    expect(screen.getByText('今日の日記を書く')).toBeInTheDocument();
    
    // フッターが表示されていることを確認
    expect(screen.getByText(/nico-cal\. All rights reserved\./, { exact: false })).toBeInTheDocument();
  });
});