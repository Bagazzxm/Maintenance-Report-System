function doGet() {
    return HtmlService.createHtmlOutputFromFile('Index')
        .setTitle('Maintenance Report System')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  
  function processForm(formData) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // --- LOGIKA NOMOR OTOMATIS BERDASARKAN ISI KOLOM A ---
    var dataA = sheet.getRange("A:A").getValues();
    var actualDataCount = 0;
    for (var i = 1; i < dataA.length; i++) {
      if (dataA[i][0] !== "" && dataA[i][0] !== null) {
        actualDataCount++;
      }
    }
    var nextNo = actualDataCount + 1;
  
    // --- LOGIKA KONVERSI ACTIVITY CODE KE ANGKA ---
    var activityMap = {
      "① Brake Down": 1,
      "② Peventive Maintenance": 2,
      "③ Reguler Check": 3,
      "④ Improvement / Kaizen": 4,
      "⑤ Training": 5,
      "⑥ 5S": 6,
      "⑦ Others": 7
    };
    var activityValue = activityMap[formData.activity] || formData.activity;
  
    // --- LOGIKA CENTANG SHIFT (C & D) ---
    var shift1 = (formData.shift == "1") ? "✓" : "";
    var shift23 = (formData.shift == "2" || formData.shift == "3") ? "✓" : "";
  
    // --- HITUNG DURASI REPAIR (T) ---
    function diffMinutes(start, end) {
      if(!start || !end) return 0;
      var s = start.split(':');
      var e = end.split(':');
      var diff = (parseInt(e[0])*60 + parseInt(e[1])) - (parseInt(s[0])*60 + parseInt(s[1]));
      return diff > 0 ? diff : 0;
    }
    var totalRepair = diffMinutes(formData.startTime, formData.finishTime);
  
    // --- LOGIKA CENTANG STATUS (V & W) ---
    var statusClose = (formData.status == "Close") ? "✓" : "";
    var statusOpen = (formData.status == "Open") ? "✓" : "";
  
    // --- SIMPAN DATA KE KOLOM A-Z ---
    sheet.appendRow([
      new Date(),               // A: Timestamp
      nextNo,                   // B: No (Auto)
      shift1,                   // C: Shift I
      shift23,                  // D: Shift II/III
      activityValue,            // E: Activity Code (Sekarang jadi Angka)
      formData.noLPPM,          // F: No LPPM
      formData.noMachine,       // G: No Machine
      formData.machineLine,     // H: Machine/Line
      formData.problem,         // I: Problem Observed
      formData.rootCause,       // J: Root Cause
      formData.action,          // K: Action Taken
      formData.countermeasure,  // L: Countermeasure
      formData.namaPart,        // M: Nama Part
      formData.typePart,        // N: Type Part
      formData.maker,           // O: Maker
      formData.qty,             // P: QTY Pakai
      formData.stock,           // Q: Stock Sisa
      formData.startTime,       // R: Start Time
      formData.finishTime,      // S: Finish Time
      totalRepair,              // T: Total Repair
      formData.stopLine,        // U: Total Stop Line
      statusClose,              // V: Status Close
      statusOpen,               // W: Status Open
      formData.remarks,         // X: Remarks Section Head
      formData.laporan30,       // Y: Laporan 30m
      formData.inputICS         // Z: Input ICS
    ]);
    
    return "Data Berhasil Disimpan sebagai No. " + nextNo;
  }