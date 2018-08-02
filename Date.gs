/**
 * フォーマットされた日付文字列を取得(yyyy/MM/dd HH:mm:ss)
 * 
 * @param {Date} date    対象日時
 *
 * @return {String} フォーマットされた日付文字列
 */
function toDateTimeString(date) {
  return [
      date.getFullYear(),
      toZeroPadding(date.getMonth() + 1, 2),
      toZeroPadding(date.getDate(), 2)
    ].join('/') + ' ' + 
    [
      date.getHours(),
      toZeroPadding(date.getMinutes(), 2),
      toZeroPadding(date.getSeconds(), 2)
    ].join(':');
}

/**
 * フォーマットされた日付文字列を取得(yyyy/MM/dd)
 * 
 * @param {Date} date    対象日時
 *
 * @return {String} フォーマットされた日付文字列
 */
function toDateString(date) {
  return [
      date.getFullYear(),
      toZeroPadding(date.getMonth() + 1, 2),
      toZeroPadding(date.getDate(), 2)
    ].join('/');
}

/**
 * SpreadSheet日付形式(シリアル値)から日付オブジェクトを取得
 * 
 * @param {Integer} dateVal シリアル値
 *
 * @return {Date} 日付オブジェクト
 */
function convertSerialToDate(dateVal) {
  // excel_date_no(1900から加算日数)からUnixTime(1970からのmsec)に変換
  return new Date((dateVal - 25569) * 86400000);
}

/**
 * 日時の加算結果を取得
 * 
 * @param {Date}    date   加算ベースとなる日付オブジェクト
 * @param {String}  part   加算する位指定
 *                         年：year, 月：month, 日：day, 時：hour, 分：minute, 秒：second
 * @param {Integer} addVal 加算値(減算はマイナスで指定)
 *
 * @return {Date} 日付オブジェクト(パートが判別外である場合、nullを返す)
 */
function addDateTime(date, part, addVal) {
  var calcDate = new Date(date.getTime());
  var strPart = part != null ? part.toLowerCase() : null;
  switch (strPart) {
    case 'year':
      calcDate.setFullYear(calcDate.getFullYear() + addVal);
      break;
    case 'month':
      calcDate.setMonth(calcDate.getMonth() + addVal);
      break;
    case 'day':
      calcDate.setDate(calcDate.getDate() + addVal);
      break;
    case 'hour':
      calcDate.setHours(calcDate.getHours() + addVal);
      break;
    case 'minute':
      calcDate.setMinutes(calcDate.getMinutes() + addVal);
      break;
    case 'second':
      calcDate.setSeconds(calcDate.getSeconds() + addVal);
      break;
    default:
      // パートが認識できない場合はnull
      calcDate = null;
      break;
  }
  return calcDate;
}

/**
 * ２つの日時の差分を取得
 * 
 * @param {Date}    srcDate   比較元日付オブジェクト
 * @param {Date}    dstDate   比較先日付オブジェクト
 * @param {String}  part      結果として求める位指定
 *                            年：year, 日：day, 時：hour, 分：minute, 秒：second
 * @param {String}  digitCalcType  丸め処理タイプ
 *                            floor: 切り捨て, ceil: 切り上げ, round(省略時): 四捨五入
 *
 * @return {Number} 比較元日付-比較先日付の差分値
 */
function getDateTimeDiff(srcDate, dstDate, part, digitCalcType) {
  // 少数桁計算関数の準備
  var strDigitCalcType = digitCalcType ? digitCalcType.toLowerCase() : 'round';
  var diff = srcDate.getTime() = dstDate.getTime(); //エポックミリ秒
  var strPart = part != null ? part.toLowerCase() : null;
  switch (strPart) {
    case 'year':
      diff = calcDigit(diff/(1000*60*60*24*365), 0, strDigitCalcType);
      break;
    case 'day':
      diff = calcDigit(diff/(1000*60*60*24), 0, strDigitCalcType);
      break;
    case 'hour':
      diff = calcDigit(diff/(1000*60*60), 0, strDigitCalcType);
      break;
    case 'minute':
      diff = calcDigit(diff/(1000*60), 0, strDigitCalcType);
      break;
    case 'second':
      diff = calcDigit(diff/1000, 0, strDigitCalcType);
      break;
    default:
      // パートが認識できない場合はミリ秒
      break;
  }
  return diff;
}

/**
 * 平日(月-金)かどうかを判定
 * ※祝日は考慮なし
 * 
 * @param {Date} date    対象日時
 *
 * @return {Boolean} true:平日(月-金)/false:休日(土日)
 */
function isWeekday(date) {
  var dayOfWeek = date.getDay();
  if (dayOfWeek == 0 || dayOfWeek == 6) return false;
  return true;
}

/* 日本の祝日配列 */
var g_jpHolidays = null;

/**
 * 指定期間の日本の祝日を取得
 * 
 * @param {Date} startDate    開始日時
 * @param {Date} endDate      終了日時
 *
 * @return {Array} 日付配列
 */
function getJapanHolidays(startDate, endDate) {
  var jpCalendar = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com');
  var aryEvents = jpCalendar.getEvents(startDate, endDate);
  
  var aryDates = [];
  for (var i = 0; i < aryEvents.length; i++) {
    aryDates.push(aryEvents[i].getStartTime());
  }
  return aryDates;
}

/**
 * 指定期間の日本の祝日を変数に読み込み
 * 
 * @param {Date} startDate    開始日時
 * @param {Date} endDate      終了日時
 */
function loadJapanHolidays(startDate, endDate) {
  g_jpHolidays = getJapanHolidays(startDate, endDate);
}

/**
 * 日本の祝日かどうかを判定
 * ※曜日は考慮なし
 * ※繰り返す場合は、先にloadJapanHolidaysを呼び出した方がパフォーマンスが上がる
 * 
 * @param {Date} date    対象日時
 *
 * @return {Boolean} true:祝日/false:祝日ではない
 */
function isJapanHoliday(date) {
  if (g_jpHolidays != null) {
    // 対象期間を予め読み込んでいた場合は、そちらを優先
    for (var i = 0, iMax = g_jpHolidays.length; i < iMax; i++) {
      if (compareDatePart(g_jpHolidays[i], date) == true) return true;
    }
    return false;
  } else {
    // 都度確認
    var jpCalendar = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com');
    if (jpCalendar.getEventsForDay(date).length > 0) return true;
    return false;
  }
}

/**
 * 会社固有の休日かどうかを判定
 * 
 * @param {Date} date    対象日時
 *
 * @return {Boolean} true:休日/false:休日ではない
 */
function isCompanyHoliday(date) {
  // 未実装
  return false;
}

/**
 * 営業日かどうかを判定
 * ※会社固有の休日は考慮なし
 * 
 * @param {Date} date    対象日時
 *
 * @return {Boolean} true:営業日/false:営業日ではない
 */
function isBusinessDay(date) {
  if (isWeekday(date) == false) return false;
  if (isJapanHoliday(date) == true) return false;
  if (isCompanyHoliday(date) == true) return false;
  return true;
}

/**
 * 営業日の何日目かを取得
 * ※会社固有の休日は考慮なし
 * 
 * @param {Date} date    対象日時
 *
 * @return {Integer} 日数(対象日時が休日の場合は-1)
 */
function getDaysOfBusinessDays(date) {
  if (isWeekday(date) == false) return -1;
  
  var tmpDate;
  var dayCount = 0;
  for (var i = 1, max = date.getDate(); i <= max; i++) {
    tmpDate = new Date(date.getFullYear(), date.getMonth(), i);
    if (isBusinessDay(tmpDate)) {
      dayCount++;
    }
  }
  return dayCount;
}

/**
 * 指定日時の当月営業日を取得
 * 
 * @param {Date}   date       対象日時
 * @param {String} retType    取得するデータタイプ(num or number: 日/以外: 日付オブジェクト)
 *
 * @return {Array} 営業日配列
 */
function getBusinessDaysOfMonth(date, retType) {
  var dateArray = new Array
  var retIsNum = (
    retType == 'number' 
    || retType == 'num' 
    || retType == 'integer' 
    || retType == 'int'
  ) ? true : false;
  
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // 月末日を取得
  
  var tmpDate;
  for (var i = 1; i <= lastDay; i++) {
    tmpDate = new Date(date.getFullYear(), date.getMonth(), i);
    if (isBusinessDay(tmpDate)) {
      if (retIsNum) dateArray.push(tmpDate.getDate());
      else dateArray.push(tmpDate);
    }
  }
  return dateArray;
}

/**
 * 指定日時の当月最終営業日を取得
 * 
 * @param {Date}   date       対象日時
 * @param {String} retType    取得するデータタイプ(num or number: 日/以外: 日付オブジェクト)
 *
 * @return {Date or Integer} 営業日
 */
function getLastBusinessDayOfMonth(date, retType) {
  var retIsNum = (
    retType == 'number' 
    || retType == 'num' 
    || retType == 'integer' 
    || retType == 'int'
  ) ? true : false;
  
  var businessDays = getBusinessDaysOfMonth(date, retType);
  var lastDay;
  for (var i = 0, iMax = businessDays.length; i < iMax; i++) {
    if (retIsNum == true) {
      if (lastDay == null || lastDay < businessDays[i]) {
        lastDay = businessDays[i];
      }
    } else {
      if (lastDay == null || lastDay.getDate() < businessDays[i].getDate()) {
        lastDay = businessDays[i];
      }
    }
  }
  return lastDay;
}
