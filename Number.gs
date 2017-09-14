/**
 * ゼロパディングされた文字列を取得
 * 
 * @param {Integer} val      値
 * @param {Integer} digit    揃える桁
 *
 * @return {String} ゼロパディングされた文字列
 */
function toZeroPadding(val, digit) {
  return ('0' + val).slice(digit * -1);
}

/**
 * 丸めた数値を取得
 * 
 * @param {Decimal} val      値
 * @param {Integer} digit    揃える桁
 * @param {String}  calcType 丸め処理タイプ
 *                           floor: 切り捨て, ceil: 切り上げ, round(省略時): 四捨五入
 *
 * @return {Decimal} 丸め処理された数値
 */
function calcDigit(val, digit, calcType) {
  // 小数点位置の移動
  digit = digit != null ? digit : 0;
  var calcDigit = Math.pow(10, digit);
  var calcVal = val * calcDigit;
  // 丸め処理
  var strCalcType = calcType ? calcType.toLowerCase() : 'round';
  switch (strCalcType) {
    case 'floor':
      calcVal = Math.floor(calcVal);
      break;
    case 'ceil':
      calcVal = Math.ceil(calcVal);
      break;
    default:
      calcVal = Math.round(calcVal);
      break;
  };
  // 小数点位置を戻す
  calcVal = calcVal / calcDigit;
  return calcVal;
}
