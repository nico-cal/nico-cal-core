/**
 * nico-cal テストデータ生成スクリプト
 * 
 * LocalStack上のDynamoDBにテスト用データを登録します。
 * 開発環境での初期データとして使用します。
 */

const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

// LocalStackのエンドポイント設定
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
  accessKeyId: 'dummy',
  secretAccessKey: 'dummy'
});

// テストユーザー情報
const TEST_USER = {
  userId: 'testuser',
  password: 'P@ssw0rd', // 実際のシステムではハッシュ化されます
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// テスト用日記データを生成する関数
function generateTestDiaries(userId, year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const diaries = [];
  
  // 感情状態のリスト（良い・普通・悪い）
  const emotions = ['good', 'normal', 'bad'];
  
  // 日記のサンプルコンテンツ
  const sampleContents = {
    'good': [
      '今日はとても良い一日だった。仕事も順調に進み、天気も良かった。',
      '久しぶりに友人と会って楽しい時間を過ごした。気分がリフレッシュした。',
      '長い間取り組んでいたプロジェクトが完了した。達成感がある。'
    ],
    'normal': [
      '普通の一日。特に変わったことはなかった。',
      'いつも通りの日常。少し疲れているが悪くはない。',
      '平凡な一日だったが、それはそれで良い。'
    ],
    'bad': [
      '今日はあまり調子が良くなかった。少し休息が必要かもしれない。',
      '予想外のトラブルが発生して対応に追われた。疲れた。',
      '体調がすぐれず、早めに休んだ。明日は回復するといいな。'
    ]
  };
  
  // 月の日記データを生成
  for (let day = 1; day <= daysInMonth; day++) {
    // ランダムに日記を作成するかどうか決定（80%の確率で作成）
    if (Math.random() < 0.8) {
      // ランダムに感情状態を選択
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      // 選択した感情に対応するサンプルコンテンツからランダムに選択
      const content = sampleContents[emotion][Math.floor(Math.random() * sampleContents[emotion].length)];
      
      // 日付の整形（例: 2025-04-01）
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // 作成日時と更新日時（過去のランダムな時間）
      const timestamp = new Date(year, month - 1, day, 
        Math.floor(Math.random() * 12) + 12, // 12時〜23時
        Math.floor(Math.random() * 60)
      ).toISOString();
      
      diaries.push({
        userId,
        date,
        emotion,
        content,
        createdAt: timestamp,
        updatedAt: timestamp
      });
    }
  }
  
  return diaries;
}

// テストユーザーを作成する関数
async function createTestUser() {
  // パスワードのハッシュ化
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(TEST_USER.password, salt);
  
  const params = {
    TableName: 'Users',
    Item: {
      ...TEST_USER,
      password: hashedPassword
    },
    ConditionExpression: 'attribute_not_exists(userId)'
  };
  
  try {
    await dynamoDB.put(params).promise();
    console.log(`テストユーザー '${TEST_USER.userId}' を作成しました`);
    return true;
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      console.log(`テストユーザー '${TEST_USER.userId}' は既に存在します`);
      return true;
    }
    console.error('テストユーザー作成中にエラーが発生しました:', error);
    return false;
  }
}

// テスト日記データを作成する関数
async function createTestDiaries() {
  // 現在の年月を取得
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  // テスト日記データを生成
  const diaries = generateTestDiaries(TEST_USER.userId, currentYear, currentMonth);
  
  console.log(`${diaries.length}件のテスト日記データを作成します...`);
  
  // バッチ処理で25件ずつ登録（DynamoDBのバッチ操作上限は25件）
  const batchSize = 25;
  for (let i = 0; i < diaries.length; i += batchSize) {
    const batch = diaries.slice(i, i + batchSize);
    
    const params = {
      RequestItems: {
        'Diaries': batch.map(diary => ({
          PutRequest: {
            Item: diary
          }
        }))
      }
    };
    
    try {
      await dynamoDB.batchWrite(params).promise();
      console.log(`${i + 1}〜${Math.min(i + batchSize, diaries.length)}件目のデータを登録しました`);
    } catch (error) {
      console.error('日記データ登録中にエラーが発生しました:', error);
      return false;
    }
  }
  
  return true;
}

// メイン処理
async function seedTestData() {
  console.log('テストデータの作成を開始します...');
  
  // テーブルの存在確認
  try {
    const tables = await new AWS.DynamoDB({
      endpoint: 'http://localhost:4566',
      region: 'us-east-1',
      accessKeyId: 'dummy',
      secretAccessKey: 'dummy'
    }).listTables().promise();
    
    if (!tables.TableNames.includes('Users') || !tables.TableNames.includes('Diaries')) {
      console.error('Users テーブルまたは Diaries テーブルが存在しません。');
      console.error('先に npm run db:setup を実行してテーブルを作成してください。');
      process.exit(1);
    }
    
    // テストユーザーの作成
    const userCreated = await createTestUser();
    if (!userCreated) {
      console.error('テストユーザーの作成に失敗しました。');
      process.exit(1);
    }
    
    // テスト日記データの作成
    const diariesCreated = await createTestDiaries();
    if (!diariesCreated) {
      console.error('テスト日記データの作成に失敗しました。');
      process.exit(1);
    }
    
    console.log('テストデータの作成が完了しました！');
    console.log(`テストユーザー: ${TEST_USER.userId}`);
    console.log(`パスワード: ${TEST_USER.password}`);
    
  } catch (error) {
    console.error('テストデータ作成中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
seedTestData();
