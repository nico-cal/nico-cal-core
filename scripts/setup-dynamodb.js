/**
 * LocalStack上にDynamoDBテーブルを作成するスクリプト
 * 
 * 使用方法:
 * $ node scripts/setup-dynamodb.js
 */

const AWS = require('aws-sdk');

// LocalStackのエンドポイント設定
const dynamoDB = new AWS.DynamoDB({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1', // リージョンはLocalStackでは任意
  accessKeyId: 'dummy',  // ローカル環境では実際のキーは不要
  secretAccessKey: 'dummy'
});

// ユーザーテーブルの作成
const createUserTable = async () => {
  const params = {
    TableName: 'Users',
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' } // パーティションキー
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    const result = await dynamoDB.createTable(params).promise();
    console.log('ユーザーテーブルの作成に成功しました:', result);
    return result;
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('ユーザーテーブルは既に存在します');
    } else {
      console.error('ユーザーテーブルの作成中にエラーが発生しました:', error);
      throw error;
    }
  }
};

// 日記テーブルの作成
const createDiaryTable = async () => {
  const params = {
    TableName: 'Diaries',
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' },  // パーティションキー
      { AttributeName: 'date', KeyType: 'RANGE' }    // ソートキー
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'date', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    const result = await dynamoDB.createTable(params).promise();
    console.log('日記テーブルの作成に成功しました:', result);
    return result;
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('日記テーブルは既に存在します');
    } else {
      console.error('日記テーブルの作成中にエラーが発生しました:', error);
      throw error;
    }
  }
};

// 両方のテーブルを作成
const setupTables = async () => {
  try {
    await createUserTable();
    await createDiaryTable();
    console.log('すべてのテーブルの設定が完了しました');
  } catch (error) {
    console.error('テーブル設定中にエラーが発生しました:', error);
  }
};

// スクリプトの実行
setupTables();
