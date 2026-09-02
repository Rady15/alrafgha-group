require('dotenv').config();
const https = require('https');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const BASE = 'alrafgha-group-production.up.railway.app';
const BID = '6a9854aec8631904328c42f2';
const FPI = 'pi_3UBHQFFfoKvWzGXs0qhpyoEO';

function req(method, path, token) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: BASE, path, method, headers: {} };
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    const r = https.request(opts, (res) => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => { let p; try { p = JSON.parse(b); } catch { p = { raw: b }; } resolve({ status: res.statusCode, body: p }); });
    });
    r.on('error', reject); r.end();
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const pi = await stripe.paymentIntents.retrieve(FPI);
  console.log('Final PI:', pi.id, 'status', pi.status, 'metadata', JSON.stringify(pi.metadata));

  const login = (await req('POST', '/api/v1/auth/login', null, { email: 'amit@alrafgha-group.com', password: 'User@123' })).body.token;
  for (let i = 0; i < 6; i++) {
    await sleep(5000);
    const gb = await req('GET', '/api/v1/bookings/' + BID, login);
    const g = gb.body.data?.booking;
    console.log(`poll ${i + 1}: status=${g?.status} payment_status=${g?.payment_status} final_payment=${JSON.stringify(g?.final_payment)}`);
    if (g?.status === 'completed' && g?.payment_status === 'paid') break;
  }
}
main().catch(e => { console.error('FATAL', e.message); process.exit(1); });
