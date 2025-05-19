const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./credentials.json");

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

async function acessarPlanilha() {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
}

async function getGiras() {
  await acessarPlanilha();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  return rows.map(row => ({
    id: row.id,
    nome: row.nome,
    data: row.data,
  }));
}

async function addAgendamento({ id, usuario_id, gira_id, data_agendamento, status, telefone }) {
  await acessarPlanilha();
  const sheet = doc.sheetsByIndex[1];
  await sheet.addRow({ id, usuario_id, gira_id, data_agendamento, status, telefone });
}

module.exports = { getGiras, addAgendamento };
