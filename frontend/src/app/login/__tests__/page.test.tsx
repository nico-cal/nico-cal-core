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
});