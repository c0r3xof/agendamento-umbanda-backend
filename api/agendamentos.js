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
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { usuarioId, giraId, dataAgendamento, nome, telefone, email } = req.body;

  if (!usuarioId || !giraId || !dataAgendamento || !nome || !telefone || !email) {
    res.status(400).json({ error: 'Campos obrigatórios faltando' });
    return;
  }

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1O0Zjo4OG3ydGtdlyWtdF3Z9eJp6WrQ2rC8IemNaLngI';

    const newRow = [
      '', 
      usuarioId,
      giraId,
      dataAgendamento,
      'Pendente',
      nome,
      telefone,
      email,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Agendamentos!A2:H',
      valueInputOption: 'RAW',
      requestBody: { values: [newRow] },
    });

    res.status(200).json({ message: 'Agendamento criado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
