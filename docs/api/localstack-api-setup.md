# LocalStack環境でのnico-cal API開発ガイド

このドキュメントでは、LocalStackを使用したnico-calバックエンドAPI開発環境のセットアップと利用方法について説明します。

## 1. 概要

nico-calのバックエンドは、AWS DynamoDBをデータストアとして使用しています。開発環境では、LocalStackを使用してAWSサービス（主にDynamoDB）をローカルで実行し、コストを削減しながら効率的に開発を進めることができます。

## 2. 前提条件

- Docker と Docker Compose がインストールされている
- Node.js v18以上
- AWS SDK for JavaScript/TypeScriptの基本的な理解

## 3. 環境構築手順

### 3.1 LocalStackの起動

以下のコマンドを実行してLocalStackコンテナを起動します：

```bash
# docker-compose.ymlが配置されているディレクトリで実行
npm run localstack:start
# または直接実行
docker-compose up -d
```

### 3.2 DynamoDBテーブルの作成

LocalStackインスタンスが起動したら、必要なDynamoDBテーブルを作成します：

```bash
# DynamoDBテーブルセットアップスクリプトの実行
npm run db:setup
```

これにより、`Users`テーブルと`Diaries`テーブルが作成されます。

### 3.3 APIサーバーの起動

バックエンドAPIサーバー（Express）を起動します：

```bash
# 開発モードで起動
npm run dev
```

これで、ローカル環境で動作するAPIサーバーが`http://localhost:3001`で起動します。

## 4. LocalStack DynamoDBへのアクセス

### 4.1 AWS SDKの設定

LocalStackのDynamoDBにアクセスするには、AWS SDKの設定を以下のように行います：

```typescript
import { DynamoDB } from 'aws-sdk';

// LocalStack用の設定
const dynamodb = new DynamoDB({
  endpoint: 'http://localhost:4566', // LocalStackのエンドポイント
  region: 'us-east-1',               // リージョンは何でも良い
  accessKeyId: 'dummy',              // ダミーの認証情報
  secretAccessKey: 'dummy'
});

// DynamoDB Document Client
const docClient = new DynamoDB.DocumentClient({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
  accessKeyId: 'dummy',
  secretAccessKey: 'dummy'
});
```

### 4.2 テーブル操作の例

以下に主要なDynamoDB操作の例を示します：

#### ユーザー作成

```typescript
async function createUser(userId: string, hashedPassword: string) {
  const params = {
    TableName: 'Users',
    Item: {
      userId,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    ConditionExpression: 'attribute_not_exists(userId)' // 既存のユーザーがない場合のみ作成
  };

  try {
    await docClient.put(params).promise();
    return { success: true };
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      throw new Error('ユーザーIDが既に存在します');
    }
    throw error;
  }
}
```

#### 日記の取得（特定期間）

```typescript
async function getDiariesByPeriod(userId: string, startDate: string, endDate: string) {
  const params = {
    TableName: 'Diaries',
    KeyConditionExpression: 'userId = :uid AND #date BETWEEN :start AND :end',
    ExpressionAttributeNames: {
      '#date': 'date'
    },
    ExpressionAttributeValues: {
      ':uid': userId,
      ':start': startDate,
      ':end': endDate
    }
  };

  const result = await docClient.query(params).promise();
  return result.Items;
}
```

## 5. LocalStackのデータ確認

### 5.1 DynamoDBテーブル一覧の確認

```bash
aws dynamodb list-tables --endpoint-url http://localhost:4566
```

### 5.2 テーブル内のデータ確認

```bash
# Usersテーブルのスキャン（全データ取得）
aws dynamodb scan --table-name Users --endpoint-url http://localhost:4566

# Diariesテーブルのスキャン
aws dynamodb scan --table-name Diaries --endpoint-url http://localhost:4566
```

## 6. テストデータの投入

開発環境で使用するためのテストデータを作成するスクリプトは、`scripts/seed-testdata.js`にあります。

```bash
# テストデータを作成
node scripts/seed-testdata.js
```

これにより、以下のテストデータがDynamoDBに追加されます：

- テストユーザー: `testuser`（パスワード: `P@ssw0rd`）
- 現在月の日記データ（複数の感情状態のデータが含まれる）

## 7. API呼び出しの例

### 7.1 ログイン

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId": "testuser", "password": "P@ssw0rd"}' \
  -c cookies.txt
```

### 7.2 日記一覧の取得

```bash
curl -X GET "http://localhost:3001/api/diaries?startDate=2025-04-01&endDate=2025-04-30" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## 8. トラブルシューティング

### 8.1 LocalStackコンテナが起動しない場合

- Docker Desktopが起動しているか確認
- ポート4566が他のアプリケーションで使用されていないか確認

### 8.2 DynamoDBテーブル作成エラー

エラーの場合は以下を試してください：

```bash
# LocalStackコンテナを再起動
docker-compose down
docker-compose up -d

# 再度テーブル作成を実行
npm run db:setup
```

### 8.3 AWS CLIが見つからない場合

AWS CLIがインストールされていない場合は、公式ドキュメントを参照してインストールしてください。

## 9. 参考リソース

- [LocalStack公式ドキュメント](https://docs.localstack.cloud/)
- [AWS SDK for JavaScript公式ドキュメント](https://docs.aws.amazon.com/sdk-for-javascript/)
- [DynamoDB開発者ガイド](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/)

## 10. 注意事項

- LocalStackはAWSの本番環境と完全に同一ではないため、一部の機能に制限や違いがある場合があります
- 開発・テスト目的のみに使用し、本番環境ではAWSの実際のサービスを利用してください
