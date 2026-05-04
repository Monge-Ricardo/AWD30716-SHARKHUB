const { Client } = require('pg');

const client = new Client({
  user: 'postgres.mepuffhlghenorhrtkvo',
  password: 'Rmonge#0867',
  host: 'aws-1-us-west-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('Connected 6543 successfully!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Query result:', res.rows);
    return client.end();
  })
  .catch(err => {
    console.error('Connection 6543 error', err.message);
    client.end();
  });

const clientDirect = new Client({
  user: 'postgres',
  password: 'Rmonge#0867',
  host: 'db.mepuffhlghenorhrtkvo.supabase.co',
  port: 5432,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

clientDirect.connect()
  .then(() => {
    console.log('Connected 5432 successfully!');
    clientDirect.end();
  })
  .catch(err => {
    console.error('Connection 5432 error', err.message);
    clientDirect.end();
  });
