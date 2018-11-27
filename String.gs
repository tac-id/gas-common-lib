/* *** String.gs ************************************************************ */

/**
 * 省略文字列を取得
 * 
 * @param {String} src      元の文字列
 * @param {Number} length   省略後の文字数(引数省略時、50文字)
 *
 * @return {String} 省略文字列
 */
function getAbbreviatedString(src, length) {
  var suffix = ' ...';
  if (length === undefined || length === null) {
    length = 50;
  }
  return src.substring(0, length - suffix.length) + suffix;
}

/* *** String.gs ************************************************************ */
