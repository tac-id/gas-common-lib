/**
 * 10進数(度)から分割60進数(度・分・秒)に変換
 * 
 * @param {Decimal}  deg10   10進数(度)
 * @param {Integer}  deg     度
 * @param {Integer}  min     分
 * @param {Decimal}  sec     秒
 * @param {String}  digitCalcType  丸め処理タイプ
 *                            floor: 切り捨て, ceil: 切り上げ, round(省略時): 四捨五入
 */
function convertDeg10ToDivide60(deg10, deg, min, sec, secDigit, digitCalcType) {
  deg = Math.floor(deg10);
  var tmp = (deg10 - deg) * 60;
  min = Math.floor(tmp);
  sec = (tmp - min) * 60;
  // 秒桁指定がある場合は、丸め処理
  if (secDigit != null) {
    calcSec = calcDigit(sec, secDigit, digitCalcType);
    if (calcSec != null) {
      sec = calcSec;
      // 分/秒の繰り上げ処理
      if (sec >= 60) {
        sec -= 60;
        min += 1;
      }
      if (min >= 60) {
        min -= 60;
        deg += 1;
      }
    }
  }
}

/**
 * 分割60進数(度・分・秒)から10進数(度)に変換
 * 
 * @param {Integer}  deg     度
 * @param {Integer}  min     分
 * @param {Decimal}  sec     秒
 * @param {Decimal}  deg10   10進数(度)
 */
function convertDivide60ToDeg10(deg, min, sec, deg10) {
  deg10 = deg + (min / 60) + (sec / 60 / 60);
}

/**
 * 10進数(度)から60進数(免許申請値形式)に変換
 * 
 * @param {Decimal}  deg10      10進数(度)
 * @param {Decimal}  license60  60進数(免許申請値形式)
 */
function convertDeg10ToLicense60(deg10, license60) {
  var deg;
  var min;
  var sec;
  // 分割60進数(度・分・秒)に変換
  convertDeg10ToDivide60(deg10, deg, min, sec);
  // 60進数(免許申請値形式)に変換
  convertDivide60ToLicense60(deg, min, sec, license60);
}

/**
 * 分割60進数(度・分・秒)から60進数(免許申請値形式)に変換
 * 
 * @param {Integer}  deg        度
 * @param {Integer}  min        分
 * @param {Decimal}  sec        秒
 * @param {Decimal}  license60  60進数(免許申請値形式)
 */
function convertDivide60ToLicense60(deg, min, sec, license60) {
  license60 = deg.toString() + toZeroPadding(min, 2) + toZeroPadding(calcDigit(sec, 0, 'round'), 2);
}
