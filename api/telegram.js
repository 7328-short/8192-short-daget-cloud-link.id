import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nfmxeldqboniwmgfoxyg.supabase.co';
const SUPABASE_ANON_KEY = 'Sb_publishable_uo4yIwVq1hAOsWnNByFhwA_vUG0_4D3';
const BOT_TOKEN = '8869523539:AAFe3qm1tzzfhlc9IvQaZX7SW_1ZEuEeKzM';
const CHAT_ID = '7603310096';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, data } = req.body; 

  try {
    // 1. Kirim data ke Telegram
    const textMessage = `Laporan Baru Masuk:\nTipe: ${type}\nData: ${JSON.stringify(data)}`;
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: textMessage
      })
    });

    // 2. Simpan ke Supabase
    const { error } = await supabase
      .from('logs_target')
      .insert([{ type: type, payload: data, created_at: new Date() }]);

    if (error) throw error;

    return res.status(200).json({ success: true, message: 'Data sent & saved!' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
