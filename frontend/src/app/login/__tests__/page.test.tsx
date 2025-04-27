import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from '../page';
import { LoginForm } from '@/components/login/login-form';

// LoginFormコンポーネントをモック
vi.mock('@/components/login/login-form', () => ({
  LoginForm: vi.fn(() => <div data-testid="mocked-login-form" />),
}));

describe('LoginPage', () => {
  it('正しくレンダリングされること', () => {
    render(<LoginPage />);
    
    // ページのタイトルとサブタイトルが表示されていることを確認
    expect(screen.getByText('nico-cal')).toBeInTheDocument();
    expect(screen.getByText('アカウントにログイン')).toBeInTheDocument();
    
    // LoginFormコンポーネントがレンダリングされていることを確認
    expect(screen.getByTestId('mocked-login-form')).toBeInTheDocument();
  });

  it('LoginFormコンポーネントが正しくレンダリングされていること', () => {
    render(<LoginPage />);
    
    // LoginFormコンポーネントが呼び出されていることを確認
    expect(LoginForm).toHaveBeenCalled();
    
    // ログインフォームがコンテナ内に配置されていることを確認
    const container = screen.getByTestId('mocked-login-form').closest('div');
    expect(container).toHaveClass('bg-white');
    expect(container).toHaveClass('p-8');
    expect(container).toHaveClass('rounded-lg');
    expect(container).toHaveClass('shadow-md');
  });

  it('レスポンシブデザインのためのクラスが適用されていること', () => {
    render(<LoginPage />);
    
    // ページのルートコンテナがフルスクリーンかつセンタリングされていることを確認
    const rootContainer = screen.getByText('nico-cal').closest('div')?.parentElement;
    expect(rootContainer).toHaveClass('min-h-screen');
    expect(rootContainer).toHaveClass('flex');
    expect(rootContainer).toHaveClass('flex-col');
    expect(rootContainer).toHaveClass('items-center');
    expect(rootContainer).toHaveClass('justify-center');
    
    // 内部コンテナの幅が制限されていることを確認
    const innerContainer = screen.getByText('nico-cal').closest('div')?.parentElement;
    expect(innerContainer).toHaveClass('w-full');
    expect(innerContainer).toHaveClass('max-w-md');
  });
});
