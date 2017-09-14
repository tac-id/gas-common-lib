/**
 * 返信不可メールを送信
 * 
 * @param {Array}  toSendList   To宛先配列
 * @param {String} subject      件名
 * @param {String} body         本文
 * @param {Array}  ccSendList   Cc宛先配列
 */
function sendNoticeMail(toSendList, subject, body, ccSendList) {
  if (toSendList == null) {
    toSendList = [ Session.getActiveUser().getEmail() ];
  }
  if (subject == null && body == null) {
    subject = "テストメール";
    var now = new Date();
    body = "本メールはテストで送信されました。";
    body += "\n送信日時：" + toDateTimeString(now);
  } else {
    body += "\n\n※本メールは自動で送信されたメールです。";
  }
  var ccAddr = '';
  if (ccSendList != null && ccSendList.length > 0) {
    ccAddr = ccSendList.join(',');
  }
  
  MailApp.sendEmail(
      toSendList, 
      subject, 
      body,
      {
        noReply: true,
        cc: ccAddr
      }
    );
}
