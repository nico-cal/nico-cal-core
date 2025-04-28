import { Metadata } from 'next';
import { LoginForm } from '@/components/login/login-form';

export const metadata: Metadata = {
  title: 'ログイン - nico-cal',
  description: 'nico-calへログインしてください',
};

/**
 * ログインページ
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">nico-cal</h1>
          <p className="mt-2 text-gray-600">アカウントにログイン</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
