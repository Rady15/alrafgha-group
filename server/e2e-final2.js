require('dotenv').config();
const https = require('https');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const BASE = 'alrafgha-group-production.up.railway.app';

function req(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = { hostname: BASE, path, method, headers: {} };
    if (data) { opts.headers['Content-Type'] = 'application/json'; opts.headers['Content-Length'] = Buffer.byteLength(data); }
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
  const login = async (email, pw) => (await req('POST', '/api/v1/auth/login', null, { email, password: pw })).body;
  const adm = await login('admin@alrafgha-group.com', 'Admin@123');
  const usr = await login('amit@alrafgha-group.com', 'User@123');
  const stf = await login('staff@alrafgha-group.com', 'Staff@123');
  const userId = usr.data.user.id;

  const vehicles = await req('GET', '/api/v1/vehicles/', adm.token);
  const someCar = (vehicles.body.data?.vehicles || []).find(v => v.type === 'car');
  const vendorId = someCar?.vendor_id?._id || someCar?.vendor_id;
  console.log('vendor_id:', vendorId);

  const stamp = Date.now().toString().slice(-6);
  const reg = 'KIA' + stamp;
  const newCar = await req('POST', '/api/v1/vehicles/', adm.token, {
    vendor_id: vendorId, name: 'Kia Sonet ' + stamp, model_name: 'Sonet', type: 'car', brand: 'Kia',
    registration_number: reg, engine_number: 'EN' + stamp, chassis_number: 'CH' + stamp,
    cc_engine: 998, rc_document: 'rc', insurance_document: 'ins', location: 'Riyadh', availability_status: 'available'
  });
  const nvid = newCar.body.data?.vehicle?._id;
  console.log('\n[1] admin create car:', newCar.status, 'id', nvid);
  if (!nvid) return;

  const ai = await req('POST', '/api/v1/stripe/create-advance-intent', usr.token, { vehicle_id: nvid });
  const api = ai.body.data?.payment_intent_id;
  await stripe.paymentIntents.confirm(api, { payment_method_data: { type: 'card', card: { token: 'tok_visa' } } });
  const vb = await req('POST', '/api/v1/stripe/verify-and-book', usr.token, { payment_intent_id: api, vehicle_id: nvid, start_location: 'Riyadh', requested_pickup_date: '2026-12-20', requested_pickup_time: '10:00' });
  const bid = vb.body.data?.booking?._id;
  const adv = vb.body.data?.booking?.advance_payment?.amount;
  console.log('[2] advance booking:', vb.status, 'bid', bid, 'advance', adv);
  if (!bid) return;

  const pk = await req('PATCH', `/api/v1/bookings/${bid}/pickup`, stf.token, {
    actual_pickup_date: '2026-12-20', actual_pickup_time: '10:00', odometer_reading_start: 1000, staff_id: userId,
    vehicle_plate_number: reg, engine_number: 'EN' + stamp, chassis_number: 'CH' + stamp
  });
  console.log('[3] pickup:', pk.status);

  const ret = await req('PATCH', `/api/v1/bookings/${bid}/return`, stf.token, {
    actual_return_date: '2026-12-22', actual_return_time: '11:00', odometer_reading_end: 1260,
    vehicle_plate_number: reg, engine_number: 'EN' + stamp, chassis_number: 'CH' + stamp,
    vehicle_condition: 'perfect', damage_cost: 0, staff_id: userId, amount_paid: adv, payment_mode: 'online'
  });
  const rb = ret.body.data?.booking;
  const finalCost = rb?.final_cost || 0;
  const due = Math.max(0, Math.round((finalCost - adv) * 100) / 100);
  console.log('[4] return online-pending:', ret.status, '| status', rb?.status, '| payment_status', rb?.payment_status, '| final_payment', JSON.stringify(rb?.final_payment), '| due', due);
  if (ret.status !== 200) return;

  const fin = await req('POST', '/api/v1/stripe/create-final-intent', usr.token, { booking_id: bid, final_amount: finalCost, advance_paid: adv });
  console.log('[5] customer create-final-intent:', fin.status, 'amount', fin.body.data?.amount);
  let fpiId = null;
  if (fin.status === 200 && fin.body.data?.payment_intent_id) {
    fpiId = fin.body.data.payment_intent_id;
    const conf = await stripe.paymentIntents.confirm(fpiId, { payment_method_data: { type: 'card', card: { token: 'tok_visa' } } });
    console.log('   final PI confirm:', conf.status, 'id', fpiId);
  }

  // Poll for webhook settlement (Stripe may take up to ~30s to deliver)
  console.log('\n[6] polling for webhook settlement up to 60s...');
  let settled = false;
  for (let i = 0; i < 12; i++) {
    await sleep(5000);
    const gb = await req('GET', `/api/v1/bookings/${bid}`, usr.token);
    const g = gb.body.data?.booking;
    const ps = g?.payment_status, st = g?.status, fp = g?.final_payment?.status;
    console.log(`   poll ${i + 1}: status=${st} payment_status=${ps} final_payment=${fp}`);
    if (st === 'completed' && ps === 'paid') { settled = true; break; }
  }

  const ve = await req('GET', '/api/v1/vehicles/' + nvid);
  console.log('[7] vehicle availability:', ve.body.data?.vehicle?.availability_status);
  console.log('RESULT: ' + (settled ? 'WEBHOOK SETTLED ✅ E2E CYCLE COMPLETE' : 'WEBHOOK NOT SETTLED ❌') + ' | fpi=' + fpiId);
  console.log('DONE');
}
main().catch(e => { console.error('FATAL', e.message); process.exit(1); });
