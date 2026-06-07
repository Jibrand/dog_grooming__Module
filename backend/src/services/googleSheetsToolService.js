import { google } from 'googleapis';
import path from 'path';

// The key file path you provided
const KEY_FILE_PATH = path.resolve(process.cwd(), 'brightsmile-Key.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

let _sheetsClient = null;

async function getSheetsClient() {
  if (!_sheetsClient) {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE_PATH,
      scopes: SCOPES,
    });
    const client = await auth.getClient();
    _sheetsClient = google.sheets({ version: 'v4', auth: client });
  }
  return _sheetsClient;
}

export async function getNextProspect() {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Sheet1';
  
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID environment variable is missing.');
  }

  // Fetch all rows
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:M`,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return null;
  }

  let targetRowIndex = -1;
  let targetRowData = null;

  // Assuming row 0 is header. Find first row with Status (col 11) "NEW" or blank
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const status = (row[11] || '').trim().toUpperCase();
    if (status === 'NEW' || status === '') {
      targetRowIndex = i;
      targetRowData = row;
      break;
    }
  }

  if (targetRowIndex === -1) {
    return null; // No new prospects
  }

  const rowNumber = targetRowIndex + 1;

  // Lock as IN_PROGRESS immediately
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!L${rowNumber}`, // Column L is Status
    valueInputOption: 'RAW',
    requestBody: {
      values: [['IN_PROGRESS']],
    },
  });

  return {
    rowIndex: targetRowIndex,
    niche: targetRowData[0] || '',
    state: targetRowData[1] || '',
    personName: targetRowData[2] || '',
    businessName: targetRowData[3] || '',
    hasSite: targetRowData[4] || '',
    onlineReviews: targetRowData[5] || '',
    phone: targetRowData[6] || '',
    siteUrl: targetRowData[7] || '',
    competitorName: targetRowData[8] || '',
    issue: targetRowData[9] || '',
    email: targetRowData[10] || '',
  };
}

export async function updateStatus({ phone, status, notes, email }) {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

  // Fetch all rows to find the row with the given phone number
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:M`,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    throw new Error('Sheet is empty');
  }

  let targetRowIndex = -1;
  let targetRowData = null;

  for (let i = 1; i < rows.length; i++) {
    const rowPhone = rows[i][6] || '';
    if (rowPhone.trim() === phone.trim()) {
      targetRowIndex = i;
      targetRowData = rows[i];
      break;
    }
  }

  if (targetRowIndex === -1) {
    throw new Error('Phone number not found in sheet');
  }

  const rowNumber = targetRowIndex + 1;
  
  // Pad the array if needed so we can update columns K, L, M
  while (targetRowData.length < 13) targetRowData.push('');

  if (email !== undefined) targetRowData[10] = email; // Col K
  targetRowData[11] = status; // Col L
  if (notes !== undefined) targetRowData[12] = notes; // Col M

  // Update Email, Status, Call Log
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!K${rowNumber}:M${rowNumber}`, 
    valueInputOption: 'RAW',
    requestBody: {
      values: [[targetRowData[10], targetRowData[11], targetRowData[12]]],
    },
  });

  return true;
}
