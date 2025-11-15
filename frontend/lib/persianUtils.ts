// Persian/Jalali date conversion and number formatting utilities

/**
 * Converts English numerals to Persian numerals
 */
export function toPersianNum(num: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const numStr = num.toString();
  return numStr.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

/**
 * Converts a Gregorian date to Jalali (Persian) date
 */
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  let jy, jm, jd;
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1]);
  jy = -1595 + (33 * ~~(days / 12053));
  days %= 12053;
  jy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  if (days < 186) {
    jm = 1 + ~~(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + ~~((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

/**
 * Converts a Jalali (Persian) date to Gregorian date
 */
export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  jy += 1595;
  let days = -355668 + (365 * jy) + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4)
    + jd + (jm < 7 ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);

  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;

  if (days > 36524) {
    gy += 100 * Math.floor((--days) / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }

  gy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  const gd = days + 1;

  const gregorianMonthLengths = [
    0,
    31,
    ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ];

  let gm = 0;
  let dayCounter = gd;
  for (gm = 1; gm <= 12 && dayCounter > gregorianMonthLengths[gm]; gm++) {
    dayCounter -= gregorianMonthLengths[gm];
  }

  return [gy, gm, dayCounter];
}

/**
 * Gets Persian month names
 */
const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const persianWeekDays = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
];

/**
 * Formats a date to Persian format
 */
export function formatPersianDate(date: Date, format: string = 'yyyy/mm/dd'): string {
  const gregorianDate = new Date(date);
  const [jy, jm, jd] = gregorianToJalali(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth() + 1,
    gregorianDate.getDate()
  );

  // Calculate Persian day of week (adjust for Persian calendar)
  const gregorianDay = gregorianDate.getDay();
  // Persian week starts on Saturday (0), Gregorian starts on Sunday (0)
  const persianDayIndex = (gregorianDay + 1) % 7;

  let formatted = format;
  formatted = formatted.replace(/yyyy/g, toPersianNum(jy.toString()));
  formatted = formatted.replace(/MMM(?!M)/g, persianMonths[jm - 1].substring(0, 3));
  formatted = formatted.replace(/MMMM/g, persianMonths[jm - 1]);
  formatted = formatted.replace(/mm/g, jm < 10 ? toPersianNum('0' + jm) : toPersianNum(jm.toString()));
  formatted = formatted.replace(/dd/g, jd < 10 ? toPersianNum('0' + jd) : toPersianNum(jd.toString()));
  formatted = formatted.replace(/EEEE/g, persianWeekDays[persianDayIndex]);
  
  return formatted;
}

/**
 * Formats a number with Persian numerals and adds ریال
 */
export function formatPersianCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const numStr = Math.floor(num).toString();
  // Add thousand separators manually
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${toPersianNum(parts.join('.'))} ریال`;
}

/**
 * Formats a number with Persian numerals and adds تومان
 */
export function formatPersianCurrencyTomans(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const numStr = Math.floor(num).toString();
  // Add thousand separators manually
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${toPersianNum(parts.join('.'))} تومان`;
}

/**
 * Formats a number with Persian numerals
 */
export function formatPersianNumber(num: number | string): string {
  const numStr = typeof num === 'string' ? num : num.toString();
  return toPersianNum(numStr);
}

/**
 * Formats time string with Persian numerals (e.g., "11:00" -> "۱۱:۰۰")
 */
export function formatPersianTime(time: string): string {
  return toPersianNum(time);
}

/**
 * Gets Persian translation for industry (now industry is already in Persian in DB)
 */
export function getPersianIndustry(industry: string): string {
  // Industry is already in Persian in database, so just return it
  return industry;
}

