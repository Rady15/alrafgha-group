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
  const login = async (email, pw) => (await req('POST', '/api/v1/auth/login', null, { email, password: pw })).body.token;

  const utok = await login('amit@alrafgha-group.com', 'User@123');
  const stok = await login('staff@alrafgha-group.com', 'Staff@123');
  const atok = await login('admin@alrafgha-group.com', 'Admin@123');
  const userId = (await req('POST', '/api/v1/auth/login', null, { email: 'amit@alrafgha-group.com', password: 'User@123' })).body.data.user.id;

  // vehicle
  const vehicles = await req('GET', '/api/v1/vehicles/');
  const car = (vehicles.body.data?.vehicles || []).find(v => v.availability_status === 'available' && v.type === 'car');
  if (!car) { console.log('NO AVAILABLE CAR'); return; }
  const vid = car._id;
  console.log('vehicle:', car.name, vid, 'cc', car.cc_engine);

  // 1) ADVANCE booking by user
  const ai = await req('POST', '/api/v1/stripe/create-advance-intent', utok, { vehicle_id: vid });
  const api = ai.body.data.payment_intent_id;
  await stripe.paymentIntents.confirm(api, { payment_method_data: { type: 'card', card: { token: 'tok_visa' } } });
  const vb = await req('POST', '/api/v1/stripe/verify-and-book', utok, { payment_intent_id: api, vehicle_id: vid, start_location: 'Riyadh', requested_pickup_date: '2026-12-01', requested_pickup_time: '10:00' });
  const bid = vb.body.data?.booking?._id;
  const adv = vb.body.data?.booking?.advance_payment?.amount;
  console.log('\n[1] advance booking:', vb.status, 'bid', bid, 'advance', adv);
  if (!bid) return;

  // 2) STAFF confirms pickup
  const pk = await req('GET', '/api/v1/bookings/requests', stok);
  const pickup = await req('PATCH', `/api/v1/bookings/${bid}/pickup`, stok, {
    actual_pickup_date: '2026-12-01', actual_pickup_time: '10:00',
    odometer_reading_start: car.odometer_reading || 1000, staff_id: userId,
    vehicle_plate_number: car.registration_number, engine_number: car.engine_number, chassis_number: car.chassis_number
  });
  console.log('[2] confirm pickup:', pickup.status, pickup.body.message || pickup.body.error || '');

  // 3) STAFF confirms RETURN with online mode (customer pays remaining online)
  const odomEnd = (car.odometer_reading || 1000) + 200;
  const ret = await req('PATCH', `/api/v1/bookings/${bid}/return`, stok, {
    actual_return_date: '2026-12-02', actual_return_time: '11:00',
    odometer_reading_end: odomEnd, vehicle_plate_number: car.registration_number,
    engine_number: car.engine_number, chassis_number: car.chassis_number,
    vehicle_condition: 'perfect', damage_cost: 0, staff_id: userId,
    amount_paid: adv, payment_mode: 'online'
  });
  const rb = ret.body.data?.booking;
  console.log('\n[3] confirm return (online pending):', ret.status);
  console.log('    status:', rb?.status, '| payment_status:', rb?.payment_status, '| final_cost:', rb?.final_cost, '| final_payment:', JSON.stringify(rb?.final_payment));

  if (ret.status !== 200) { console.log('RETURN FAILED:', ret.body.message || ret.body.error); return; }
  const finalCost = rb?.final_cost;

  // 4) CUSTOMER pays remaining online (create-final-intent + confirm)
  const due = Math.max(0, finalCost - adv);
  const fin = await req('POST', '/api/v1/stripe/create-final-intent', utok, { booking_id: bid, final_amount: finalCost, advance_paid: adv });
  console.log('\n[4] customer create-final-intent:', fin.status, 'amount', fin.body.data?.amount, '(due', due + ')');
  if (fin.status === 200 && fin.body.data?.payment_intent_id) {
    const fpi = fin.body.data.payment_intent_id;
    const conf = await stripe.paymentIntents.confirm(fpi, { payment_method_data: { type: 'card', card: { token: 'tok_visa' } } });
    console.log('    final PI confirm:', conf.status, 'received', conf.amount_received);
    await sleep(3000);
  }

  // 5) Verify booking settled
  const gb = await req('GET', `/api/v1/bookings/${bid}`, utok);
  const g = gb.body.data?.booking;
  console.log('\n[5] after customer online payment: status', g?.status, '| payment_status', g?.payment_status, '| final_payment', JSON.stringify(g?.final_payment));

  // 6) vehicle freed
  const ve = await req('GET', '/api/v1/vehicles/' + vid);
  console.log('[6] vehicle availability:', ve.body.data?.vehicle?.availability_status);
  console.log('DONE');
}
main().catch(e => { console.error('FATAL', e.message); process.exit(1); });
