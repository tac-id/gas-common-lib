GsiAccesser = function() {
  this.BaseUrl = 'http://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php';
};

/**
 * 指定位置のGL値を取得
 * 
 * @param {Decimal} lat    緯度(10進数)
 * @param {Decimal} lon    経度(10進数)
 *
 * @return {Decimal} GL値
 */
GsiAccesser.prototype.getGL = function(lat, lon) {
  // アクセス先を設定
  var url = this.BaseUrl + '?lon=' + lon + '&lat=' + lat + '&outtype=JSON';
  // GETリクエスト
  var response = UrlFetchApp.fetch(url);
  // GET結果を取得
  var content = response.getContentText("UTF-8");
  // JSON形式からオブジェクトに変換
  var json = JSON.parse(response.getContentText());
  // 値を返す
  return json != null ? json.elevation : null;
};

/**
 * GL値取得のテスト実行
 * 
 */
function testGsiAccess() {
  // GL取得テスト
  var accesser = new GsiAccesser();
  var gl = accesser.getGL(36.103543, 140.08531);
  Logger.log('テスト実行結果 GL値: "%s"', gl);
}