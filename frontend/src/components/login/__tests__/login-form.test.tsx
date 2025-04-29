import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginForm } from '../login-form';

// next-authとnext/navigationのモック
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// fetchのモック
global.fetch = vi.fn();

describe('LoginForm', () => {
  // テスト前に毎回モックをリセット
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('正しくレンダリングされること', () => {
    render(<LoginForm />);

    // フォーム要素が存在するか確認
    expect(screen.getByLabelText('ユーザーID')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });
});
