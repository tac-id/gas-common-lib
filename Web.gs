/* *** Web.gs *************************************************************** */

/**
 * Cookieからパラメータオブジェクトを取得
 * 
 * @param {String} cookies           Cookie文字列
 * @param {Array}  paramNameArray    取得するパラメータ名配列
 *
 * @return {Object} パラメータオブジェクト
 */
function getCookieObject(cookies, paramNameArray) {
  var cookieObj = {};
  var cookieItems = cookies.split(';');
  for (var i = 0; i < cookieItems.length; i++) {
    var elem = cookieItem[i].split("=");
    var paramName = elem[0].trim();
    if (paramNameArray == null) {
      // 取得するパラメータ名の指定がない場合はすべて
      cookieObj[paramName] = unescape(elem[1]);
    } else if (paramNameArray.contains(paramName) >= 0) {
      // 取得するパラメータ名の指定がない場合は指定のもののみ
      cookieObj[paramName] = unescape(elem[1]);
    }
  }
  return cookieObj;
}

/* *** Web.gs *************************************************************** */
