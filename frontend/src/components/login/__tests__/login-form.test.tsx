import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { LoginForm } from "../login-form";
import * as nextNavigation from "next/navigation";

// Response型の定義
interface MockResponse {
  ok: boolean;
  json: () => Promise<Record<string, unknown>>;
}

// モジュールのモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}));

// fetchのモック
global.fetch = vi.fn();

describe("LoginForm", () => {
  // テスト前に毎回モックをリセット
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("正しくレンダリングされること", () => {
    render(<LoginForm />);

    // フォーム要素が存在するか確認
    expect(screen.getByLabelText("ユーザーID")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ログイン" }),
    ).toBeInTheDocument();
  });

  it("入力値が無効な場合にバリデーションエラーを表示すること", async () => {
    render(<LoginForm />);

    // 無効なデータを入力
    fireEvent.input(screen.getByLabelText("ユーザーID"), {
      target: { value: "ab" },
    });
    fireEvent.input(screen.getByLabelText("パスワード"), {
      target: { value: "pass" },
    });

    // フォーム送信（actでラップ）
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    });

    // バリデーションエラーメッセージが表示されることを確認
    expect(
      screen.getByText("ユーザーIDは3文字以上で入力してください"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("パスワードは8文字以上で入力してください"),
    ).toBeInTheDocument();

    // アクセシビリティ属性が正しく設定されていること
    expect(screen.getByLabelText("ユーザーID")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("パスワード")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("有効なデータでフォーム送信が成功した場合リダイレクトすること", async () => {
    // useRouterのモック関数を取得
    const mockRouter = {
      push: vi.fn(),
      refresh: vi.fn(),
    };

    // useRouterのモック関数を設定
    vi.mocked(nextNavigation.useRouter).mockReturnValue(mockRouter as unknown);

    // fetchのレスポンスをモック
    (global.fetch as unknown as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<LoginForm />);

    // 有効なデータを入力
    fireEvent.input(screen.getByLabelText("ユーザーID"), {
      target: { value: "testuser" },
    });
    fireEvent.input(screen.getByLabelText("パスワード"), {
      target: { value: "Password123" },
    });

    // フォーム送信（actでラップ）
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    });

    // APIが正しい引数で呼ばれたことを確認
    expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "testuser",
        password: "Password123",
      }),
      credentials: "include",
    });

    // リダイレクトが行われたことを確認
    expect(mockRouter.push).toHaveBeenCalledWith("/");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("API呼び出しが失敗した場合にエラーメッセージを表示すること", async () => {
    // fetchのエラーレスポンスをモック
    (global.fetch as unknown as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({ message: "ユーザーIDまたはパスワードが違います" }),
    });

    render(<LoginForm />);

    // データを入力
    fireEvent.input(screen.getByLabelText("ユーザーID"), {
      target: { value: "testuser" },
    });
    fireEvent.input(screen.getByLabelText("パスワード"), {
      target: { value: "Password123" },
    });

    // フォーム送信（actでラップ）
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    });

    // エラーメッセージが表示されることを確認
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("ログインに失敗しました");
  });

  it("ネットワークエラーが発生した場合にデフォルトエラーメッセージを表示すること", async () => {
    // fetchのエラーをモック
    (global.fetch as unknown as jest.Mock).mockRejectedValueOnce(
      new Error("ログインに失敗しました"),
    );

    render(<LoginForm />);

    // データを入力
    fireEvent.input(screen.getByLabelText("ユーザーID"), {
      target: { value: "testuser" },
    });
    fireEvent.input(screen.getByLabelText("パスワード"), {
      target: { value: "Password123" },
    });

    // フォーム送信（actでラップ）
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    });

    // デフォルトエラーメッセージが表示されることを確認
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("ログインに失敗しました");
  });

  it("送信中は入力とボタンが無効化されること", async () => {
    // モックプロミス作成のためのモック関数
    let resolvePromise: (value: MockResponse) => void;
    const mockPromise = new Promise<MockResponse>((resolve) => {
      resolvePromise = resolve;
    });

    // fetchのレスポンスを遅延させるモック
    (global.fetch as unknown as jest.Mock).mockImplementationOnce(
      () => mockPromise,
    );

    render(<LoginForm />);

    // データを入力
    fireEvent.input(screen.getByLabelText("ユーザーID"), {
      target: { value: "testuser" },
    });
    fireEvent.input(screen.getByLabelText("パスワード"), {
      target: { value: "Password123" },
    });

    // フォーム送信（actでラップ）
    const submitButton = screen.getByRole("button", { name: "ログイン" });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // ボタンのテキストが変更されたことを確認
    expect(submitButton).toHaveTextContent("ログイン中...");

    // ローディング状態の確認
    const userIdInput = screen.getByLabelText("ユーザーID");
    const passwordInput = screen.getByLabelText("パスワード");

    expect(userIdInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");

    // モックの解決（actでラップ）
    await act(async () => {
      resolvePromise({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
  });
});
