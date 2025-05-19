import { google } from 'googleapis';

export default async function handler(req, res) {
  res.status(200).json({ message: 'API de giras funcionando!' });
}
