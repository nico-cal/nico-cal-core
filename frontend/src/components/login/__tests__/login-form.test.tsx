import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../login-form';
import * as authSchema from '@/lib/schemas/auth';

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

  it('入力値が無効な場合にバリデーションエラーを表示すること', async () => {
    render(<LoginForm />);
    
    // 無効なデータを入力
    fireEvent.input(screen.getByLabelText('ユーザーID'), { target: { value: 'ab' } });
    fireEvent.input(screen.getByLabelText('パスワード'), { target: { value: 'pass' } });
    
    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // バリデーションエラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('ユーザーIDは3文字以上で入力してください')).toBeInTheDocument();
      expect(screen.getByText('パスワードは8文字以上で入力してください')).toBeInTheDocument();
    });
  });

  it('有効なデータでフォーム送信が成功した場合リダイレクトすること', async () => {
    // windowのlocation.hrefをモック
    const locationAssignMock = vi.fn();
    delete window.location;
    window.location = { href: '' } as any;
    Object.defineProperty(window.location, 'href', {
      set: locationAssignMock,
    });
    
    // fetchのレスポンスをモック
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });
    
    render(<LoginForm />);
    
    // 有効なデータを入力
    fireEvent.input(screen.getByLabelText('ユーザーID'), { target: { value: 'testuser' } });
    fireEvent.input(screen.getByLabelText('パスワード'), { target: { value: 'Password123' } });
    
    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // APIが正しい引数で呼ばれたことを確認
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'testuser',
          password: 'Password123',
        }),
      });
    });
    
    // リダイレクトが行われたことを確認
    await waitFor(() => {
      expect(locationAssignMock).toHaveBeenCalledWith('/');
    });
  });

  it('API呼び出しが失敗した場合にエラーメッセージを表示すること', async () => {
    // fetchのエラーレスポンスをモック
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'ユーザーIDまたはパスワードが違います' }),
    });
    
    render(<LoginForm />);
    
    // データを入力
    fireEvent.input(screen.getByLabelText('ユーザーID'), { target: { value: 'testuser' } });
    fireEvent.input(screen.getByLabelText('パスワード'), { target: { value: 'Password123' } });
    
    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('ユーザーIDまたはパスワードが違います')).toBeInTheDocument();
    });
  });

  it('ネットワークエラーが発生した場合にデフォルトエラーメッセージを表示すること', async () => {
    // fetchのエラーをモック
    (global.fetch as any).mockRejectedValueOnce(new Error('Network Error'));
    
    render(<LoginForm />);
    
    // データを入力
    fireEvent.input(screen.getByLabelText('ユーザーID'), { target: { value: 'testuser' } });
    fireEvent.input(screen.getByLabelText('パスワード'), { target: { value: 'Password123' } });
    
    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // デフォルトエラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('ログインに失敗しました')).toBeInTheDocument();
    });
  });

  it('送信中は入力とボタンが無効化されること', async () => {
    // fetchのレスポンスを遅延させるモック
    let resolvePromise: (value: any) => void;
    const mockPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    (global.fetch as any).mockImplementationOnce(() => mockPromise);
    
    render(<LoginForm />);
    
    // データを入力
    fireEvent.input(screen.getByLabelText('ユーザーID'), { target: { value: 'testuser' } });
    fireEvent.input(screen.getByLabelText('パスワード'), { target: { value: 'Password123' } });
    
    // フォーム送信
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    
    // ローディング状態の確認
    const userIdInput = screen.getByLabelText('ユーザーID');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン中...' });
    
    expect(userIdInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    
    // モックの解決
    resolvePromise!({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
});
