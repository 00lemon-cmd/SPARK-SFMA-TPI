/**
 * SFMA v26.5 BACKEND ENGINE (WEB APP, DUAL REPORTING, & PDF EXPORT)
 */

function doGet() {
  return HtmlService.createTemplateFromFile('Sidebar')
    .evaluate()
    .setTitle('SFMA Clinical Intake App')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('SFMA Tools')
    .addItem('Launch SFMA Web App (Sidebar mode)', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createTemplateFromFile('Sidebar').evaluate()
    .setTitle('SFMA v26.5 Assistant')
    .setWidth(450);
  SpreadsheetApp.getUi().showSidebar(html);
}

function saveAssessment(clientName, results) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('SFMA Input') || ss.insertSheet('SFMA Input');
  const timestamp = new Date();
  const rows = results.map(r => [timestamp, clientName, r.phase, r.pattern, r.test, r.score, r.diag || ""]);
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 7).setValues(rows);
}

/**
 * MASTER PROCESSOR: Saves data, flushes to sheet, generates reports, and returns PDF links.
 */
function processAssessment(clientName, results) {
  saveAssessment(clientName, results);
  
  // Force Google to finish writing the data before generating reports
  SpreadsheetApp.flush(); 
  
  return generateDualReports();
}

function generateDualReports() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const inputSheet = ss.getSheetByName('SFMA Input');
  const masterList = ss.getSheetByName('Master List');
  
  if (!inputSheet || !masterList) throw new Error("Missing 'SFMA Input' or 'Master List' tab.");

  const data = inputSheet.getDataRange().getValues();
  const latestClient = data[data.length - 1][1];
  const latestTimestamp = data[data.length - 1][0];
  const sessionData = data.filter(row => row[1] === latestClient && row[0].toString() === latestTimestamp.toString());
  const libraryData = masterList.getDataRange().getValues();

  const dateStr = Utilities.formatDate(new Date(), "GMT+10", "ddMMM_HHmm");
  const shortName = latestClient.substring(0, 8);

  // ==========================================
  // SHEET 1: THE CLINICAL AUDIT 
  // ==========================================
  const auditSheet = ss.insertSheet(`Audit_${shortName}_${dateStr}`);
  
  auditSheet.setColumnWidth(1, 400); 
  auditSheet.setColumnWidth(2, 100); 
  auditSheet.setColumnWidth(3, 450); 
  
  auditSheet.getRange("A1:C1").merge().setValue(`SFMA CLINICAL MOVEMENT AUDIT`)
    .setBackground("#2d3436").setFontColor("white").setFontSize(16).setFontWeight("bold").setVerticalAlignment("middle").setHorizontalAlignment("center");
  auditSheet.getRange("A2").setValue(`PATIENT: ${latestClient}`).setFontWeight("bold");
  auditSheet.getRange("C2").setValue(`DATE: ${Utilities.formatDate(new Date(), "GMT+10", "dd MMM yyyy")}`).setFontWeight("bold").setHorizontalAlignment("right");
  auditSheet.setRowHeight(1, 45);

  let auditRow = 4;
  auditSheet.getRange(auditRow, 1, 1, 3).merge().setValue("PART I: GLOBAL MOVEMENT STATUS (TOP TIER)")
    .setBackground("#636e72").setFontColor("#00cec9").setFontWeight("bold").setHorizontalAlignment("center");
  auditRow++;

  let ttData = sessionData.filter(r => r[2] === "TOP TIER");
  ttData.forEach(row => {
    auditSheet.getRange(auditRow, 1).setValue(row[3]).setBackground("#f5f6fa").setFontWeight("bold").setBorder(true, true, true, true, false, false, "#dcdde1", SpreadsheetApp.BorderStyle.SOLID);
    
    let score = row[5];
    let scoreCell = auditSheet.getRange(auditRow, 2).setValue(score).setFontWeight("bold").setHorizontalAlignment("center").setBorder(true, true, true, true, false, false, "#dcdde1", SpreadsheetApp.BorderStyle.SOLID);
    
    if (score === "FN") scoreCell.setBackground("#00b894").setFontColor("white"); 
    else if (score.includes("P")) scoreCell.setBackground("#d63031").setFontColor("white"); 
    else scoreCell.setBackground("#fdcb6e").setFontColor("#2d3436"); 
    
    auditSheet.setRowHeight(auditRow, 25); 
    auditRow++;
  });

  auditRow++; 

  auditSheet.getRange(auditRow, 1, 1, 3).merge().setValue("PART II: CLINICAL BREAKOUT CHAINS")
    .setBackground("#636e72").setFontColor("#00cec9").setFontWeight("bold").setHorizontalAlignment("center");
  auditRow++;

  let boData = sessionData.filter(r => r[2] === "BREAKOUT");
  let currentPattern = "";

  boData.forEach(row => {
    let pattern = row[3];
    let test = row[4];
    let score = row[5];
    let diag = row[6];

    if (pattern !== currentPattern) {
      currentPattern = pattern;
      auditSheet.getRange(auditRow, 1, 1, 3).merge().setValue(`${currentPattern.toUpperCase()} SEQUENCE`)
        .setBackground("#b2bec3").setFontColor("#2d3436").setFontWeight("bold");
      auditSheet.setRowHeight(auditRow, 30);
      auditRow++;
    }

    auditSheet.getRange(auditRow, 1).setValue("   ↳ " + test).setFontStyle("italic"); 
    
    let scoreCell = auditSheet.getRange(auditRow, 2).setValue(score).setFontWeight("bold").setHorizontalAlignment("center");
    if (score === "FN") scoreCell.setFontColor("#00b894");
    else if (score.includes("P")) scoreCell.setFontColor("#d63031");
    else scoreCell.setFontColor("#e1b12c"); 

    if (diag) {
      auditSheet.getRange(auditRow, 3).setValue(diag).setFontColor(diag.includes("MD") ? "#d35400" : "#2980b9").setFontWeight("bold");
    }
    
    auditSheet.getRange(auditRow, 1, 1, 3).setBorder(null, null, true, null, null, null, "#ecf0f1", SpreadsheetApp.BorderStyle.SOLID);
    auditSheet.setRowHeight(auditRow, 28);
    auditRow++;
  });

  // ==========================================
  // SHEET 2: THE IN-HOUSE PROGRAM 
  // ==========================================
  const programSheet = ss.insertSheet(`Program_${shortName}_${dateStr}`);
  
  programSheet.setColumnWidth(1, 350); 
  programSheet.setColumnWidth(2, 250); 
  programSheet.setColumnWidth(3, 400); 
  
  programSheet.getRange("A1:C1").merge().setValue(`IN-HOUSE CLINICAL PROGRAM`)
    .setBackground("#16a085").setFontColor("white").setFontSize(16).setFontWeight("bold").setVerticalAlignment("middle").setHorizontalAlignment("center");
  programSheet.getRange("A2").setValue(`PATIENT: ${latestClient}`).setFontWeight("bold");
  programSheet.getRange("C2").setValue(`DATE: ${Utilities.formatDate(new Date(), "GMT+10", "dd MMM yyyy")}`).setFontWeight("bold").setHorizontalAlignment("right");
  programSheet.setRowHeight(1, 45);

  const PATTERN_MAP = {
    "Cervical": ["Cervical", "Neck", "OA", "C1-C2"],
    "UE Pattern": ["Upper Extremity", "Pattern 1", "Pattern 2", "Shoulder", "Elbow"],
    "Flexion": ["Multi-Segmental Flexion", "Flexion", "SLR", "Forward Bend"],
    "Extension": ["Multi-Segmental Extension", "Extension", "Hip Extension", "FABER", "Thomas", "Backward Bend"],
    "Rotation": ["Multi-Segmental Rotation", "Rotation", "Thoracic Rotation", "Tibial Rotation", "ER Flow", "IR Flow"],
    "SLS": ["Single Leg Stance", "SLS", "Hurdle Step", "Inline Lunge", "Ankle", "Vestibular", "CTSIB"],
    "Deep Squat": ["Deep Squat", "Overhead Squat", "Symmetrical Stance", "Soleus", "Hip IR", "Hip ER"]
  };

  let progRow = 4;
  programSheet.getRange(progRow, 1, 1, 3).merge().setValue("RECOMMENDED EXERCISES (BASED ON TERMINAL DIAGNOSES)")
    .setBackground("#34495e").setFontColor("white").setFontWeight("bold").setHorizontalAlignment("center");
  progRow++;
  
  programSheet.getRange(progRow, 1).setValue("Terminal Diagnosis").setBackground("#f1f2f6").setFontWeight("bold");
  programSheet.getRange(progRow, 2).setValue("Recommended Exercise").setBackground("#f1f2f6").setFontWeight("bold");
  programSheet.getRange(progRow, 3).setValue("Clinical Instructions").setBackground("#f1f2f6").setFontWeight("bold");
  progRow++;

  sessionData.forEach(row => {
    if (row[2] === "BREAKOUT") {
      const diag = row[6];
      if (!diag) return; 

      const activeBO = row[3];
      const type = diag.includes("MD") ? "MD" : "SMCD";
      
      let mappedPatterns = [];
      for (let key in PATTERN_MAP) { 
        if (activeBO.includes(key) || diag.includes(key)) { mappedPatterns = PATTERN_MAP[key]; break; } 
      }

      let matches = libraryData.filter(libRow => libRow[3] === type && mappedPatterns.some(p => libRow[4].includes(p)));
      
      if (matches.length > 0) {
        let match = matches[0]; 
        let side = row[4].endsWith(" L") ? " [LEFT]" : (row[4].endsWith(" R") ? " [RIGHT]" : "");
        
        programSheet.getRange(progRow, 1).setValue(diag + side).setFontWeight("bold").setWrap(true);
        programSheet.getRange(progRow, 2).setValue(match[0]).setFontWeight("bold").setWrap(true);
        programSheet.getRange(progRow, 3).setValue(match[1]).setFontStyle("italic").setWrap(true);
        programSheet.getRange(progRow, 1, 1, 3).setBorder(null, null, true, null, null, null, "#bdc3c7", SpreadsheetApp.BorderStyle.SOLID);
        progRow++;
      }
    }
  });

  programSheet.setRowHeights(5, Math.max(1, progRow - 5), 50);
  
  // ==========================================
  // GENERATE PDF EXPORT URLS
  // ==========================================
  const ssId = ss.getId();
  const pdfParams = "&exportFormat=pdf&format=pdf&size=A4&portrait=true&fitw=true&gridlines=false&printtitle=false&sheetnames=false&pagenum=false";
  
  return {
    auditUrl: `https://docs.google.com/spreadsheets/d/${ssId}/export?gid=${auditSheet.getSheetId()}${pdfParams}`,
    programUrl: `https://docs.google.com/spreadsheets/d/${ssId}/export?gid=${programSheet.getSheetId()}${pdfParams}`
  };
}
