/* *** System.gs ************************************************************ */

/**
 * エラーオブジェクトからメッセージを取得
 * 
 * @param {Object} error   Errorオブジェクト
 *
 * @return {String} エラーメッセージ
 */
function getErrorMessage(error) {
  return Utilities.formatString('Error: %s [%s(行:%s)]\nStack:\n%s', error.message, error.fileName, error.lineNumber, error.stack);
}

/**
 * エラーメッセージをログ出力
 * 
 * @param {Object} error   Errorオブジェクト
 */
function outputError(error) {
  var argType = Object.prototype.toString.call(error);
  if (argType == '[object Error]') {
    Logger.log(getErrorMessage(error));
  } else {
    Logger.log(error);
  }
}

/**
 * エラーテスト実行
 * 
 */function testOutputError() {
  try {
    throw new Error('エラーテスト！！');
  } catch(e) {
    // 引数=エラーオブジェクト
    outputError(e);
  }
  // 引数=文字列
  outputError('err');
}

/* *** System.gs ************************************************************ */
