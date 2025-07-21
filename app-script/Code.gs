// Code.gs per a Google Apps Script Web App
const SHEET_ID = 'TU_SPREADSHEET_ID';  // canvia-ho

function doPost(e) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sh    = ss.getSheetByName('Responses');
  const data  = JSON.parse(e.postData.contents);
  const row   = [new Date(), ...data.answers];
  sh.appendRow(row);
  return ContentService
    .createTextOutput(JSON.stringify({status:'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sh    = ss.getSheetByName('Responses');
  const vals  = sh.getDataRange().getValues();
  const headers = vals[0];
  const entries = vals.slice(1);
  const Qcount = headers.length - 1; 
  const agg = [];
  for (let i = 0; i < Qcount; i++) {
    const counts = {};
    entries.forEach(r => {
      const v = r[i+1];
      counts[v] = (counts[v]||0) + 1;
    });
    agg.push(counts);
  }
  return ContentService
    .createTextOutput(JSON.stringify({
      count: entries.length,
      aggregated: agg
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
