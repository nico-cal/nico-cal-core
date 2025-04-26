# nico-cal DynamoDBアクセスパターン

DynamoDBではアクセスパターンを基にテーブル設計を行うことが重要です。nico-calのユースケースに合わせた主要なアクセスパターンと、それに対応するクエリ方法を説明します。

## テーブル構成

### Usersテーブル
| 属性名 | 型 | 説明 |
|--------|------|--------|
| userId | String | プライマリキー |
| password | String | ハッシュ化されたパスワード |
| createdAt | Timestamp | 作成日時 |
| updatedAt | Timestamp | 更新日時 |

### Diariesテーブル
| 属性名 | 型 | 説明 |
|--------|------|--------|
| userId | String | パーティションキー |
| date | String | ソートキー（YYYY-MM-DD形式） |
| emotion | String | 感情状態（"good", "normal", "bad"） |
| content | String | 日記本文 |
| createdAt | Timestamp | 作成日時 |
| updatedAt | Timestamp | 更新日時 |

## 主要アクセスパターン

### 1. ユーザー認証
ユーザーIDとパスワードを使って認証を行います。

```javascript
// ユーザー取得
const params = {
  TableName: "Users",
  Key: {
    userId: "user123"
  }
};

const result = await dynamoDB.get(params).promise();
// パスワードの検証処理（ハッシュの比較）
```

### 2. 特定日の日記取得
ユーザーIDと日付を指定して、特定の日の日記を取得します。

```javascript
const params = {
  TableName: "Diaries",
  Key: {
    userId: "user123",
    date: "2025-04-27"
  }
};

const result = await dynamoDB.get(params).promise();
```

### 3. 期間指定での日記一覧取得
特定の期間の日記を一覧取得します（例：月間表示）。

```javascript
const params = {
  TableName: "Diaries",
  KeyConditionExpression: "userId = :uid AND #date BETWEEN :start AND :end",
  ExpressionAttributeNames: {
    "#date": "date"
  },
  ExpressionAttributeValues: {
    ":uid": "user123",
    ":start": "2025-04-01",
    ":end": "2025-04-30"
  }
};

const result = await dynamoDB.query(params).promise();
```

### 4. 日記の作成・更新
新規日記の作成や既存日記の更新を行います。

```javascript
// 日記の作成/更新
const params = {
  TableName: "Diaries",
  Item: {
    userId: "user123",
    date: "2025-04-27",
    emotion: "good",
    content: "今日はとても良い日だった。",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

await dynamoDB.put(params).promise();
```

### 5. カレンダービュー用のデータ取得
カレンダー表示のために、感情状態のみを効率的に取得します。

```javascript
const params = {
  TableName: "Diaries",
  KeyConditionExpression: "userId = :uid AND #date BETWEEN :start AND :end",
  ExpressionAttributeNames: {
    "#date": "date"
  },
  ExpressionAttributeValues: {
    ":uid": "user123",
    ":start": "2025-04-01",
    ":end": "2025-04-30"
  },
  ProjectionExpression: "#date, emotion" // 日付と感情状態のみを取得
};

const result = await dynamoDB.query(params).promise();
```

## インデックス設計の検討事項

現在の設計では、ユースケースに対応するために追加のインデックスは必要ありません。しかし、将来的に以下のような機能を追加する場合は、GSI（グローバルセカンダリインデックス）の追加を検討する必要があります：

1. **感情分析レポート機能**: ある感情状態の日記だけを効率的に取得したい場合
2. **タグ付け機能**: 特定のタグが付いた日記を検索したい場合
3. **全文検索機能**: 日記の内容から検索したい場合（DynamoDBだけでは実現が難しいため、Amazon OpenSearchなどの併用も検討）

現在の設計は、日記アプリの基本機能に焦点を当てたシンプルなものですが、ユーザー数や機能の拡張に応じて柔軟に対応できる構成となっています。
