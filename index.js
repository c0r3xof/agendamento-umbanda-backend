require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getGiras, addAgendamento } = require("./sheets");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/giras", async (req, res) => {
  try {
    const giras = await getGiras();
    res.json(giras);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar giras" });
  }
});

app.post("/agendamento", async (req, res) => {
  const { id, usuario_id, gira_id, data_agendamento, status } = req.body;

  if (!id || !usuario_id || !gira_id || !data_agendamento || !status) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    await addAgendamento({ id, usuario_id, gira_id, data_agendamento, status });
    res.json({ message: "Agendamento criado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
