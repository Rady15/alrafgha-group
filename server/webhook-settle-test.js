require('dotenv').config();
const crypto = require('crypto');
const https = require('https');
const BASE = 'alrafgha-group-production.up.railway.app';
const SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const BID = '6a98584c0a04d9f16f8ff09c';
const FPI = 'pi_FAKE_FINAL_' + Date.now();

function post(path, body, signed) {
  return new Promise((resolve, reject) => {
    const json = JSON.stringify(body);
    const opts = { hostname: BASE, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(json) } };
    if (signed) {
      // Stripe signature: t=timestamp,v1=hmac
      const t = Math.floor(Date.now() / 1000);
      const signedPayload = `${t}.${json}`;
      const sig = crypto.createHmac('sha256', SECRET).update(signedPayload).digest('hex');
      opts.headers['Stripe-Signature'] = `t=${t},v1=${sig}`;
    }
    const r = https.request(opts, (res) => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => { let p; try { p = JSON.parse(b); } catch { p = { raw: b }; } resolve({ status: res.statusCode, body: p }); });
    });
    r.on('error', reject); r.write(json); r.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: BASE, path, method: 'GET', headers: token ? { Authorization: 'Bearer ' + token } : {} };
    const r = https.request(opts, (res) => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => { let p; try { p = JSON.parse(b); } catch { p = { raw: b }; } resolve({ status: res.statusCode, body: p }); });
    });
    r.on('error', reject); r.end();
  });
}

const paymentIntent = {
  id: FPI,
  object: 'payment_intent',
  amount: 197000,
  currency: 'sar',
  status: 'succeeded',
  metadata: { payment_type: 'final', booking_id: BID }
};

const evt = {
  id: 'evt_test_finalsettle_001',
  object: 'event',
  type: 'payment_intent.payment_succeeded',
  data: { object: paymentIntent },
  livemode: false,
  created: Math.floor(Date.now() / 1000)
};

async function main() {
  console.log('webhook secret present:', !!SECRET);
  const r = await post('/api/v1/stripe/webhook', evt, true);
  console.log('WEBHOOK POST (signed):', r.status, JSON.stringify(r.body));
  const login = await post('/api/v1/auth/login', { email: 'admin@alrafgha-group.com', password: 'Admin@123' });
  const atok = login.body.token;
  const b = await get('/api/v1/bookings/' + BID, atok);
  const g = b.body.data?.booking;
  console.log('booking status:', g?.status, '| payment_status:', g?.payment_status, '| final_payment:', JSON.stringify(g?.final_payment));
  console.log('DONE');
}
main().catch(e => { console.error('FATAL', e.message); process.exit(1); });
