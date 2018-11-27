/* *** Mailer.gs ************************************************************ */

// 1度の検索に取得するメール数(最大500通まで指定可能)
var MAIL_SEARCH_COUNT = 50;

/**
 * メールを送信
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
        cc: ccAddr
      }
    );
}

/**
 * 返信不可メールを送信
 * 
 * @param {Array}  toSendList   To宛先配列
 * @param {String} subject      件名
 * @param {String} body         本文
 * @param {Array}  ccSendList   Cc宛先配列
 */
function sendNoticeNoReplyMail(toSendList, subject, body, ccSendList) {
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

/**
 * GMailから指定条件のメールスレッドを検索
 * 
 * @param {String}  query メールクエリ式
 * @param {String}  order スレッド内最終メール受信日時での順序(asc: 昇順, desc: 降順)
 * 
 * @return {Array[GmailThread]} メールスレッドオブジェクト配列
 */
function searchMailThread(query, order) {
  /* Gmailから特定条件のスレッドを検索しメールを取り出す */
  var myThreads; //スレッド配列
  myThreads = GmailApp.search(query, 0, MAIL_SEARCH_COUNT); //条件にマッチしたスレッドを取得
  if (order == "asc") {
    myThreads.sort(function(a, b) {
      var aDate = a.getLastMessageDate();
      var bDate = b.getLastMessageDate();
      if (aDate < bDate) return -1;
      if (aDate > bDate) return 1;
      return 0;
    });
  }
  return myThreads;
}

/**
 * GMailから指定条件のメールを検索
 * 
 * @param {String}  query メールクエリ式
 * @param {String}  order メール受信日時での順序(asc: 昇順, desc: 降順)
 * 
 * @return {Array[GmailMessage]} メールオブジェクト配列
 */
function searchMail(query, order) {
  /* Gmailから特定条件のスレッドを検索しメールを取り出す */
  var myThreads; //スレッド配列
  var myMsgs; //メール配列(二次元配列)
 
  myThreads = searchMailThread(query);
  myMsgs = GmailApp.getMessagesForThreads(myThreads); //スレッドからメールを取得する
  if (order == "asc") {
    myMsgs.sort(function(a, b) {
      var aDate = a.getDate();
      var bDate = b.getDate();
      if (aDate < bDate) return -1;
      if (aDate > bDate) return 1;
      return 0;
    });
  } else if (order == "desc") {
    myMsgs.sort(function(a, b) {
      var aDate = a.getDate();
      var bDate = b.getDate();
      if (aDate < bDate) return 1;
      if (aDate > bDate) return -1;
      return 0;
    });
  }
  return myMsgs;
}

/**
 * GMailから指定件名を含むメールスレッドを検索
 * 
 * @param {String}  searchSubject 検索するメール件名
 * @param {String}  afterDate     検索する期間の開始日(指定した日付以降のメールを対象)
 * 
 * @return {Array[GmailThread]} メールオブジェクト配列
 */
function searchMailThreadByTitle(searchSubject, afterDate) {
  /* Gmailから特定条件のスレッドを検索しメールを取り出す */
  var strQuery = 'subject:(' + searchSubject + ')'; // メール件名
  if (afterDate != null) {
    strQuery += ' after:' + toDateString(afterDate, '-');  // 期間開始日
  }
  return searchMailThread(strQuery);
}

/**
 * GMailから指定件名を含むメールを検索
 * 
 * @param {String}  searchSubject 検索するメール件名
 * @param {String}  afterDate     検索する期間の開始日(指定した日付以降のメールを対象)
 * 
 * @return {Array[GmailMessage]} メールオブジェクト配列
 */
function searchMailByTitle(searchSubject, afterDate) {
  /* Gmailから特定条件のスレッドを検索しメールを取り出す */
  var strQuery = 'subject:(' + searchSubject + ')'; // メール件名
  if (afterDate != null) {
    strQuery += ' after:' + toDateString(afterDate, '-');  // 期間開始日
  }
  return searchMail(strQuery);
}

/**
 * GMailから指定添付ファイル名を含むメールを検索
 * 
 * @param {String}  searchFileName 検索する添付ファイル名
 * @param {String}  afterDate     検索する期間の開始日(指定した日付以降のメールを対象)
 * 
 * @return {Array[GmailMessage]} メールオブジェクト配列
 */
function searchMailByAttachmentFileName(searchFileName, afterDate) {
  var strQuery = 'has:attachment filename:' + searchFileName;
  if (afterDate != null) {
    strQuery += ' after:' + toDateString(afterDate, '-');  // 期間開始日
  }
  return searchMail(strQuery);
}

/**
 * GMailから指定添付ファイル名の添付ファイルを検索
 * 
 * @param {String}  searchFileName 検索する添付ファイル名
 * @param {String}  afterDate     検索する期間の開始日(指定した日付以降のメールを対象)
 * 
 * @return {Array[GmailMessage]} 添付ファイルオブジェクト配列
 */
function searchAttachments(searchFileName, afterDate) {
  var myMsgs = searchMailByAttachmentFileName(searchFileName, afterDate);
  var myAttachments = [];
  myMsgs.forEach(function(e) {
    var tempAttachments = e.getAttachments();
    if (tempAttachments.length > 0) {
      tempAttachments.forEach(function(f) {
        var fileName = f.getName();
        if (fileName.indexOf(searchFileName) > -1) {
          myAttachments.push(f);
        }
      });
    }
  });
  return myAttachments;
}

/**
 * 文字列から指定文字列にはさまれた文字列を取得
 * 
 * @param {String}  str 対象文字列
 * @param {String}  pre 開始文字列
 * @param {String}  suf 終了文字列
 * 
 * @return {String} はさまれた文字列
 */
function fetchData(str, pre, suf) {
  var reg = new RegExp(pre + '.*?' + suf);
  if (reg.test(str)) {
    var data = str.match(reg)[0]
      .replace(pre, '')
      .replace(suf, '');
    return data;  
  }
  return "";
}

/* *** Mailer.gs ************************************************************ */
