require('dotenv').config();
const crypto = require('crypto');
const https = require('https');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const BASE = 'alrafgha-group-production.up.railway.app';
const SECRET = process.env.STRIPE_WEBHOOK_SECRET;

function req(method, path, token, body, raw) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = { hostname: BASE, path, method, headers: {} };
    if (data && !raw) { opts.headers['Content-Type'] = 'application/json'; opts.headers['Content-Length'] = Buffer.byteLength(data); }
    if (raw) {
      // Stripe-style signed webhook body
      const json = data;
      const t = Math.floor(Date.now() / 1000);
      const sig = crypto.createHmac('sha256', SECRET).update(`${t}.${json}`).digest('hex');
      opts.headers['Content-Type'] = 'application/json';
      opts.headers['Content-Length'] = Buffer.byteLength(json);
      opts.headers['Stripe-Signature'] = `t=${t},v1=${sig}`;
    }
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    const r = https.request(opts, (res) => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => { let p; try { p = JSON.parse(b); } catch { p = { raw: b }; } resolve({ status: res.statusCode, body: p }); });
    });
    r.on('error', reject); if (data) r.write(data); r.end();
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const login = async (email, pw) => {
    for (let i = 0; i < 5; i++) {
      const r = await req('POST', '/api/v1/auth/login', null, { email, password: pw });
      if (r.body.token) return r.body;
      await sleep(3000);
    }
    throw new Error('login failed for ' + email);
  };
  const adm = await login('admin@alrafgha-group.com', 'Admin@123');
  const usr = await login('amit@alrafgha-group.com', 'User@123');
  const stf = await login('staff@alrafgha-group.com', 'Staff@123');
  const userId = usr.data.user.id;

  const vehicles = await req('GET', '/api/v1/vehicles/', adm.token);
  const vc = (vehicles.body.data?.vehicles || []).find(v => v.type === 'car')?.vendor_id;
  const vendorId = vc?._id || vc;
  console.log('vendorId:', vendorId);
  if (!vendorId) { console.log('ABORT no vendorId'); return; }

  const stamp = Date.now().toString().slice(-6);
  const reg = 'WB' + stamp;
  const nc = await req('POST', '/api/v1/vehicles/', adm.token, {
    vendor_id: vendorId, name: 'Hyundai i10 ' + stamp, model_name: 'i10', type: 'car', brand: 'Hyundai',
    registration_number: reg, engine_number: 'EN' + stamp, chassis_number: 'CH' + stamp,
    cc_engine: 998, rc_document: 'rc', insurance_document: 'ins', location: 'Riyadh', availability_status: 'available'
  });
  const nvid = nc.body.data?.vehicle?._id;
  console.log('[1] admin create car:', nc.status, nvid, JSON.stringify(nc.body.message || nc.body.error || '').substring(0, 200));
  if (!nvid) { console.log('ABORT vehicle not created'); return; }

  const ai = await req('POST', '/api/v1/stripe/create-advance-intent', usr.token, { vehicle_id: nvid });
  const api = ai.body.data?.payment_intent_id;
  await stripe.paymentIntents.confirm(api, { payment_method_data: { type: 'card', card: { token: 'tok_visa' } } });
  const vb = await req('POST', '/api/v1/stripe/verify-and-book', usr.token, { payment_intent_id: api, vehicle_id: nvid, start_location: 'Riyadh', requested_pickup_date: '2026-12-25', requested_pickup_time: '10:00' });
  const bid = vb.body.data?.booking?._id;
  const adv = vb.body.data?.booking?.advance_payment?.amount;
  console.log('[2] advance booking:', vb.status, bid, 'adv', adv);

  await req('PATCH', `/api/v1/bookings/${bid}/pickup`, stf.token, {
    actual_pickup_date: '2026-12-25', actual_pickup_time: '10:00', odometer_reading_start: 1000, staff_id: userId,
    vehicle_plate_number: reg, engine_number: 'EN' + stamp, chassis_number: 'CH' + stamp
  });
  const ret = await req('PATCH', `/api/v1/bookings/${bid}/return`, stf.token, {
    actual_return_date: '2026-12-27', actual_return_time: '11:00', odometer_reading_end: 1270,
    vehicle_plate_number: reg, engine_number: 'EN' + stamp, chassis_number: 'CH' + stamp,
    vehicle_condition: 'perfect', damage_cost: 0, staff_id: userId, amount_paid: adv, payment_mode: 'online'
  });
  const rb = ret.body.data?.booking;
  const fcost = rb?.final_cost || 0;
  console.log('[3] return online-pending:', ret.status, '| status', rb?.status, '| pay', rb?.payment_status, '| fp', JSON.stringify(rb?.final_payment));

  const fin = await req('POST', '/api/v1/stripe/create-final-intent', usr.token, { booking_id: bid, final_amount: fcost, advance_paid: adv });
  const fpi = fin.body.data?.payment_intent_id;
  console.log('[4] final intent:', fin.status, fpi, 'amt', fin.body.data?.amount);
  if (fpi) await stripe.paymentIntents.confirm(fpi, { payment_method_data: { type: 'card', card: { token: 'tok_visa' } } });

  // --- Send signed webhook event for this NEW booking's final PI ---
  const paymentIntent = {
    id: fpi, object: 'payment_intent', amount: fin.body.data.amount * 100, currency: 'sar', status: 'succeeded',
    metadata: { payment_type: 'final', booking_id: bid }
  };
  const evt = { id: 'evt_new_' + Date.now(), object: 'event', type: 'payment_intent.succeeded', data: { object: paymentIntent }, livemode: false, created: Math.floor(Date.now() / 1000) };
  const wh = await req('POST', '/api/v1/stripe/webhook', null, evt, true);
  console.log('[5] signed webhook response:', wh.status, JSON.stringify(wh.body));

  // Also probe with a clearly-default type to compare handler behavior
  const evt2 = { id: 'evt_default_' + Date.now(), object: 'event', type: 'charge.refunded', data: { object: {} }, livemode: false, created: Math.floor(Date.now() / 1000) };
  const wh2 = await req('POST', '/api/v1/stripe/webhook', null, evt2, true);
  console.log('[6] default-type webhook response:', wh2.status, JSON.stringify(wh2.body));

  // Check booking
  const b = await req('GET', `/api/v1/bookings/${bid}`, usr.token);
  const g = b.body.data?.booking;
  console.log('[7] booking: status', g?.status, '| pay', g?.payment_status, '| fp', JSON.stringify(g?.final_payment));
  console.log('DONE bid=' + bid + ' fpi=' + fpi);
}
main().catch(e => { console.error('FATAL', e.message); process.exit(1); });
