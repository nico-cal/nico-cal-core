/**
 * 感情状態の種類
 */
export type EmotionType = 'good' | 'normal' | 'bad';

/**
 * 日記データの型定義
 */
export interface DiaryEntry {
  userId: string;
  date: string; // YYYY-MM-DD形式
  emotion: EmotionType;
  content: string;
  createdAt: string; // ISO 8601形式
  updatedAt: string; // ISO 8601形式
}

/**
 * 日記作成・更新用のフォームの値
 */
export interface DiaryFormValues {
  date: string;
  emotion: EmotionType;
  content: string;
}

/**
 * 月別のカレンダーデータ
 */
export interface CalendarData {
  year: number;
  month: number;
  days: (DiaryDate | null)[][];
}

/**
 * カレンダー日付の情報
 */
export interface DiaryDate {
  date: Date;
  dateString: string; // YYYY-MM-DD形式
  emotion?: EmotionType;
  isToday: boolean;
}
