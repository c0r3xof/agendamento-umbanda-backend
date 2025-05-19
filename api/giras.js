import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getAuth() {
  const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key.replace(/\\n/g, '\n'),
    SCOPES
  );
  return jwtClient;
}

export default async function handler(req, res) {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1O0Zjo4OG3ydGtdlyWtdF3Z9eJp6WrQ2rC8IemNaLngI';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Giras!A2:E',
    });

    const rows = response.data.values || [];
    const giras = rows.map(row => ({
      id: row[0],
      nome: row[1],
      descricao: row[2],
      data: row[3],
      status: row[4],
    }));

    res.status(200).json(giras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
