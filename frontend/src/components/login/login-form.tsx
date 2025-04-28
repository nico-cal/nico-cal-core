import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/schemas/auth";
import { useRouter } from "next/navigation";

/**
 * ログインフォームコンポーネント
 * Next.jsのApp Routerに最適化されたログインフォーム
 */
export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  /**
   * ログイン処理
   * 認証APIを呼び出し、結果に応じてリダイレクトまたはエラー表示を行う
   */
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        // 認証情報を含めることでCookieを送信
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ログインに失敗しました");
      }

      // ログイン成功時の処理
      // Next.jsのルーターを使用してクライアントサイドナビゲーションを実行
      router.push("/");
      router.refresh(); // 認証状態の変更を反映するためにページをリフレッシュ
    } catch {
      // エラーメッセージを統一して「ログインに失敗しました」を表示
      setError("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="userId" className="block text-sm font-medium">
            ユーザーID
          </label>
          <input
            id="userId"
            type="text"
            autoComplete="username"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("userId")}
            disabled={isLoading}
            aria-invalid={errors.userId ? "true" : "false"}
            aria-describedby={errors.userId ? "userId-error" : undefined}
          />
          {errors.userId && (
            <p id="userId-error" className="text-sm text-red-500">
              {errors.userId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("password")}
            disabled={isLoading}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && (
          <div
            className="p-3 text-sm text-white bg-red-500 rounded-md"
            role="alert"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}
