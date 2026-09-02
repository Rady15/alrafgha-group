require('dotenv').config();
const https = require('https');
const BASE = 'alrafgha-group-production.up.railway.app';
function req(m, p, t) {
  return new Promise((res, rej) => {
    const o = { hostname: BASE, path: p, method: m, headers: {} };
    if (t) o.headers['Authorization'] = 'Bearer ' + t;
    const r = https.request(o, rr => { let x = ''; rr.on('data', c => x += c); rr.on('end', () => { let j; try { j = JSON.parse(x); } catch { j = { raw: x }; } res({ s: rr.statusCode, b: j }); }); });
    r.on('error', rej); r.end();
  });
}
async function main() {
  const login = await req('POST', '/api/v1/auth/login', null, { email: 'admin@alrafgha-group.com', password: 'Admin@123' });
  console.log('login status:', login.s, 'keys:', Object.keys(login.b || {}).join(','));
  const atok = login.b.token;
  const v = await req('GET', '/api/v1/vehicles/', atok);
  const list = v.b.data?.vehicles || [];
  console.log('total vehicles:', list.length, '| API status', v.s);
  const car = list.find(x => x.type === 'car');
  if (car) {
    console.log('first car name:', car.name);
    console.log('car.vendor_id:', JSON.stringify(car.vendor_id));
  } else {
    console.log('NO CAR FOUND, all vehicles:', list.map(x => x.name).join(', '));
  }
}
main().catch(e => { console.error('FATAL', e.message); process.exit(1); });
