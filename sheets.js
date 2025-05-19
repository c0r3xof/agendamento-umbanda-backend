const { google } = require("googleapis");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

async function getGiras() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Giras!A2:F",
  });

  const rows = response.data.values || [];
  return rows.map(([id, nome, descricao, data, tipo, status]) => ({
    id,
    nome,
    descricao,
    data,
    tipo,
    status,
  }));
}

async function addAgendamento(agendamento) {
  const values = [
    [
      agendamento.id,
      agendamento.usuario_id,
      agendamento.gira_id,
      agendamento.data_agendamento,
      agendamento.status,
    ],
  ];

  const resource = { values };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Agendamentos!A:E",
    valueInputOption: "USER_ENTERED",
    resource,
  });
}

module.exports = {
  getGiras,
  addAgendamento,
};
