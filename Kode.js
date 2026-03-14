function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

// FUNGSI UTAMA UNTUK MENERIMA DATA DARI GITHUB
function doPost(e) {
  try {
    var formData = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Logika Nomor Otomatis
    var dataA = sheet.getRange("A:A").getValues();
    var actualDataCount = 0;
    for (var i = 1; i < dataA.length; i++) {
      if (dataA[i][0] !== "" && dataA[i][0] !== null) actualDataCount++;
    }
    var nextNo = actualDataCount + 1;

    // Mapping Activity Code
    var activityMap = {
      "① Brake Down": 1, "② Peventive Maintenance": 2, "③ Reguler Check": 3,
      "④ Improvement / Kaizen": 4, "⑤ Training": 5, "⑥ 5S": 6, "⑦ Others": 7
    };
    var activityValue = activityMap[formData.activity] || formData.activity;

    // Logika Centang & Waktu
    var shift1 = (formData.shift == "1") ? "✓" : "";
    var shift23 = (formData.shift == "2" || formData.shift == "3") ? "✓" : "";
    
    var s = formData.startTime.split(':'), f = formData.finishTime.split(':');
    var totalRepair = (parseInt(f[0])*60 + parseInt(f[1])) - (parseInt(s[0])*60 + parseInt(s[1]));
    totalRepair = totalRepair > 0 ? totalRepair : 0;

    var statusClose = (formData.status == "Close") ? "✓" : "";
    var statusOpen = (formData.status == "Open") ? "✓" : "";

    // Simpan Data
    sheet.appendRow([
      new Date(), nextNo, shift1, shift23, activityValue, formData.noLPPM,
      formData.noMachine, formData.machineLine, formData.problem, formData.rootCause,
      formData.action, formData.countermeasure, formData.namaPart, formData.typePart,
      formData.maker, formData.qty, formData.stock, formData.startTime,
      formData.finishTime, totalRepair, formData.stopLine, statusClose,
      statusOpen, formData.remarks, formData.laporan30, formData.inputICS
    ]);

    return ContentService.createTextOutput("Data Berhasil Disimpan sebagai No. " + nextNo)
                         .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString())
                         .setMimeType(ContentService.MimeType.TEXT);
  }
}
