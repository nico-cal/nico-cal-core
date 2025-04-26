# nico-cal

シンプルなデザインを特徴とする個人向け日記サービス

## 概要

nico-calは、シンプルなデザインを特徴とする個人向け日記サービスです。ユーザーは日々の出来事や感情を記録し、カレンダー形式で過去の記録を振り返ることができます。

## 特徴

- シンプルで使いやすいUI
- 日々の感情を「良い」「普通」「悪い」で記録
- カレンダー形式で過去の記録を振り返り
- 個人のプライバシーを重視（日記の外部公開機能なし）

## 技術スタック

### フロントエンド

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript, React
- **状態管理**: React Hooks
- **バリデーション**: Zod
- **認証**: next-auth
- **テスト**: vitest
- **コード品質**: ESLint, Prettier
- **フォーム処理**: React Hook Form
- **UIコンポーネント**: shadcn (複雑なUIコンポーネント用)

### バックエンド

- **フレームワーク**: Express
- **言語**: JavaScript/TypeScript
- **バリデーション**: Zod
- **データベース**: AWS DynamoDB
- **ローカル開発環境**: LocalStack
- **テスト**: vitest
- **コード品質**: ESLint, Prettier

## システムアーキテクチャ

nico-calはフロントエンドとバックエンドに分かれた構成を採用しています。

```
[ユーザー] ⟷ [フロントエンド(Next.js)] ⟷ [バックエンド(Express)] ⟷ [データベース(DynamoDB)]
```

## 認証・セキュリティ

- **認証方式**: ID/パスワード認証 + JWT
- **トークン管理**: JWTをHTTP Onlyクッキーとして保存
- **パスワード管理**: パスワードはハッシュ化して保存

## デプロイ

- **フロントエンド**: Vercel
- **バックエンド**: 未定 (AWS EC2, AWS Lambda, または他のサーバーレスプラットフォームを検討)
- **データベース**: AWS DynamoDB

## 将来の拡張性

現在は基本的な日記機能に焦点を当てていますが、将来的には以下の機能の追加も検討しています：

- 画像のアップロード機能
- 日記のタグ付け
- 検索機能
- テーマ切り替え（ダークモード/ライトモード）
- 気分分析レポート（月間・年間統計）

## プロジェクトドキュメント

詳細な設計ドキュメントは `docs` ディレクトリに保存されています：

- [ER図](docs/er-diagram.mmd) - テーブル間の関連性を示すMermaid形式のER図
- [DynamoDBテーブル設計](docs/dynamodb-table-design.svg) - テーブル構造の視覚的な表現
- [DynamoDBアクセスパターン](docs/dynamodb-access-patterns.md) - 主要なアクセスパターンとクエリ例
- [APIドキュメント](docs/api-documentation.md) - バックエンドAPIの詳細仕様
- [LocalStack開発ガイド](docs/localstack-api-setup.md) - ローカル開発環境のセットアップと利用方法
- [ユースケース図](docs/use-case-diagram.svg) - システムのユースケース図
- [ユースケース記述](docs/use-case-descriptions.md) - 詳細なユースケース記述
- [ワイヤーフレーム](docs/wireframes.md) - 画面設計とUI詳細

## 開発環境のセットアップ

### 前提条件

- Node.js (v18以上)
- Docker
- Docker Compose

### LocalStack によるAWSサービスのローカル実行

nico-calでは、LocalStackを使用してAWSサービス（DynamoDB等）をローカル環境で実行します。これにより：

1. 開発コストの削減（AWSの本番環境利用料が発生しない）
2. ネットワーク遅延なしの高速な開発
3. 開発環境と本番環境の一貫性確保

#### LocalStackの起動方法

```bash
# Docker Composeを使用してLocalStackを起動
docker compose up -d
```

#### 対応するAWSサービス

- DynamoDB: データの保存
- S3: 将来的な画像保存用（現在は未実装）
- Cognito: 将来的な認証基盤（現在はJWT独自実装）

## 開発ガイドライン

- TypeScriptの型定義を厳密に行う（anyは使用禁止）
- コードの変更はPull Requestを通して行う
- コミット前に単体テストを実行する

## ライセンス

このプロジェクトは独自ライセンスの下で提供されています。詳細はライセンスファイルをご確認ください。
