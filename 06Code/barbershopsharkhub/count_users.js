const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  try {
    const res = await client.query('SELECT count(*) FROM public.users');
    console.log("Total users in public.users:", res.rows[0].count);
    
    const res2 = await client.query('SELECT count(*) FROM auth.users');
    console.log("Total users in auth.users:", res2.rows[0].count);
  } catch (err) {
    console.error(err);
  }
  await client.end();
}
run();
