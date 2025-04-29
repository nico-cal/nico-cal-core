import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from '../page';

// LoginFormコンポーネントをモック
vi.mock('@/components/login/login-form', () => ({
  LoginForm: vi.fn(() => <div data-testid="mocked-login-form" />),
}));

// 認証関連ユーティリティのモック
vi.mock('@/lib/auth/utils', () => ({
  useRedirectIfAuthenticated: vi.fn().mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('正しくレンダリングされること', () => {
    render(<LoginPage />);

    // ページのタイトルとサブタイトルが表示されていることを確認
    expect(screen.getByRole('heading', { name: /nico-cal/i })).toBeInTheDocument();
    expect(screen.getByText('アカウントにログイン')).toBeInTheDocument();

    // LoginFormコンポーネントがレンダリングされていることを確認
    expect(screen.getByTestId('mocked-login-form')).toBeInTheDocument();
  });
});