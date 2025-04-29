import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../login-form';

// auth/utilsのモック
vi.mock('@/lib/auth/utils', () => ({
  useLogin: () => ({
    login: vi.fn().mockImplementation((data) => {
      // 成功の場合
      if (data.userId === 'testuser' && data.password === 'Password123') {
        return Promise.resolve({ success: true });
      }
      // 失敗の場合
      return Promise.resolve({
        success: false,
        error: '認証に失敗しました',
      });
    }),
  }),
}));

// zodのバリデーションエラーメッセージがテストできるようにするためのモック
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => (data) => {
    const errors = {};
    if (!data.userId || data.userId.length < 3) {
      errors.userId = { message: 'ユーザーIDは3文字以上で入力してください' };
    }
    if (!data.password || data.password.length < 8) {
      errors.password = { message: 'パスワードは8文字以上で入力してください' };
    }
    return { errors, values: data };
  },
}));

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

  it('バリデーションエラーが表示されること', async () => {
    render(<LoginForm />);

    // フォームを送信
    const submitButton = screen.getByRole('button', { name: 'ログイン' });
    fireEvent.click(submitButton);

    // バリデーションエラーが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('ユーザーIDは3文字以上で入力してください')).toBeInTheDocument();
      expect(screen.getByText('パスワードは8文字以上で入力してください')).toBeInTheDocument();
    });
  });

  it('認証失敗時にエラーメッセージが表示されること', async () => {
    render(<LoginForm />);

    // 無効な認証情報を入力
    fireEvent.change(screen.getByLabelText('ユーザーID'), {
      target: { value: 'invaliduser' },
    });
    fireEvent.change(screen.getByLabelText('パスワード'), {
      target: { value: 'invalidpassword' },
    });

    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('認証に失敗しました')).toBeInTheDocument();
    });
  });
});
