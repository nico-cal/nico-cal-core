/**
 * 日付に関するユーティリティ関数
 */

/**
 * 指定した年月の日数を取得
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 指定した年月の最初の日の曜日を取得（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * 指定した年月の全ての日付を2次元配列として取得（週ごとに配列化）
 */
export function getCalendarDays(year: number, month: number): (Date | null)[][] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // カレンダーの行（週）
  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];
  
  // 月の最初の日の前に空白を挿入
  for (let i = 0; i < firstDayOfMonth; i++) {
    currentWeek.push(null);
  }
  
  // 月の日付を挿入
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(new Date(year, month, day));
    
    // 土曜日（6）または月の最後の日の場合、新しい週を開始
    if (currentWeek.length === 7 || day === daysInMonth) {
      // 週の最後に空白を挿入（最後の週が7日未満の場合）
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  return weeks;
}

/**
 * 日付をYYYY-MM-DD形式の文字列に変換
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM-DD形式の文字列をDateオブジェクトに変換
 */
export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * 日付を「○月○日（曜日）」形式でフォーマット
 */
export function formatDateToJapanese(date: Date): string {
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${month}月${day}日（${dayOfWeek}）`;
}

/**
 * 年月を「○年○月」形式でフォーマット
 */
export function formatYearMonth(year: number, month: number): string {
  return `${year}年${month + 1}月`;
}
