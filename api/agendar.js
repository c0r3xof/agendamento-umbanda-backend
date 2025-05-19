import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const sheets = google.sheets("v4");

async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.SERVICE_ACCOUNT),
    scopes: SCOPES,
  });
  return auth.getClient();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { nome, telefone, data } = req.body;

  if (!nome || !telefone || !data) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const authClient = await authenticate();

    await sheets.spreadsheets.values.append({
      auth: authClient,
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Agendamentos!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[nome, telefone, data]],
      },
    });

    return res.status(200).json({ message: "Agendamento realizado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao salvar agendamento" });
  }
}
