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
  const login = async (email, pw) => {
    const r = await req('POST', '/api/v1/auth/login', null, { email, password: pw });
    return { token: r.body.token, status: r.status, user: r.body.data?.user };
  };

  const adm = await login('admin@alrafgha-group.com', 'Admin@123');
  const usr = await login('amit@alrafgha-group.com', 'User@123');
  const stf = await login('staff@alrafgha-group.com', 'Staff@123');
  const userId = usr.user.id;
  console.log('logins -> admin:', adm.status, 'staff:', stf.status, 'user:', usr.status);

  // Get a vendor_id + package reference from an existing car
  const vehicles = await req('GET', '/api/v1/vehicles/', adm.token);
  const vehiclesList = vehicles.body.data?.vehicles || [];
  const someCar = vehiclesList.find(v => v.type === 'car');
  const vendorId = someCar?.vendor_id?._id || someCar?.vendor_id;
  console.log('existing car:', someCar?.name, '| vendor_id:', vendorId, '| cc:', someCar?.cc_engine);
  if (!vendorId) { console.log('NO vendor_id reference'); return; }

  // --- 1) ADMIN creates a brand-new car ---
  const stamp = Date.now().toString().slice(-6);
  const reg = 'NEW' + stamp;
  const newCar = await req('POST', '/api/v1/vehicles/', adm.token, {
    vendor_id: vendorId,
    name: 'Kia Picanto ' + stamp,
    model_name: 'Picanto',
    type: 'car',
    brand: 'Kia',
    registration_number: reg,
    engine_number: 'ENG' + stamp,
    chassis_number: 'CHS' + stamp,
    cc_engine: 998,
    rc_document: 'rc-placeholder',
    insurance_document: 'ins-placeholder',
    location: 'Riyadh',
    description: 'Cycle test vehicle',
    availability_status: 'available'
  });
  console.log('\n[1] ADMIN create vehicle:', newCar.status, newCar.body.message || newCar.body.error || '');
  const nvid = newCar.body.data?.vehicle?._id;
  if (!nvid) { console.log('VEHICLE NOT CREATED'); return; }
  console.log('   new vehicle id:', nvid, '| availability:', newCar.body.data?.vehicle?.availability_status);

  // --- 2) USER books it (advance Stripe) ---
  const ai = await req('POST', '/api/v1/stripe/create-advance-intent', usr.token, { vehicle_id: nvid });
  const api = ai.body.data?.payment_intent_id;
  console.log('\n[2] create advance intent:', ai.status, 'PI', api, 'amount', ai.body.data?.amount);
  if (!api) return;
  await stripe.paymentIntents.confirm(api, { payment_method_data: { type: 'card', card: { token: 'tok_visa' } } });
  const vb = await req('POST', '/api/v1/stripe/verify-and-book', usr.token, { payment_intent_id: api, vehicle_id: nvid, start_location: 'Riyadh', requested_pickup_date: '2026-12-10', requested_pickup_time: '10:00' });
  const bid = vb.body.data?.booking?._id;
  const adv = vb.body.data?.booking?.advance_payment?.amount;
  console.log('   verify-and-book:', vb.status, 'bid', bid, 'advance', adv);
  if (!bid) { console.log('BOOKING FAILED'); return; }

  // --- 3) STAFF confirms pickup ---
  const pk = await req('PATCH', `/api/v1/bookings/${bid}/pickup`, stf.token, {
    actual_pickup_date: '2026-12-10', actual_pickup_time: '10:00',
    odometer_reading_start: 1000,
    staff_id: userId,
    vehicle_plate_number: reg, engine_number: 'ENG' + stamp, chassis_number: 'CHS' + stamp
  });
  console.log('[3] confirm pickup:', pk.status, pk.body.message || pk.body.error || '');

  // --- 4) STAFF confirms return with online mode (customer pays remaining online) ---
  const ret = await req('PATCH', `/api/v1/bookings/${bid}/return`, stf.token, {
    actual_return_date: '2026-12-12', actual_return_time: '11:00',
    odometer_reading_end: 1250, vehicle_plate_number: reg,
    engine_number: 'ENG' + stamp, chassis_number: 'CHS' + stamp,
    vehicle_condition: 'perfect', damage_cost: 0,
    staff_id: userId, amount_paid: adv, payment_mode: 'online'
  });
  const rb = ret.body.data?.booking;
  console.log('\n[4] confirm return (online pending):', ret.status, ret.body.message || ret.body.error || '');
  console.log('    status:', rb?.status, '| payment_status:', rb?.payment_status, '| final_cost:', rb?.final_cost, '| final_payment:', JSON.stringify(rb?.final_payment));
  if (ret.status !== 200) return;
  const finalCost = rb?.final_cost || 0;
  const due = Math.max(0, Math.round((finalCost - adv) * 100) / 100);

  // --- 5) CUSTOMER pays remaining online ---
  const fin = await req('POST', '/api/v1/stripe/create-final-intent', usr.token, { booking_id: bid, final_amount: finalCost, advance_paid: adv });
  console.log('\n[5] customer create-final-intent:', fin.status, 'amount', fin.body.data?.amount, '(due', due + ')');
  if (fin.status === 200 && fin.body.data?.payment_intent_id) {
    const conf = await stripe.paymentIntents.confirm(fin.body.data.payment_intent_id, { payment_method_data: { type: 'card', card: { token: 'tok_visa' } } });
    console.log('    final PI confirm:', conf.status, 'received', conf.amount_received);
    await sleep(3500);
  }

  // --- 6) Verify settled ---
  const gb = await req('GET', `/api/v1/bookings/${bid}`, usr.token);
  const g = gb.body.data?.booking;
  console.log('\n[6] after customer online payment -> status:', g?.status, '| payment_status:', g?.payment_status, '| final_payment:', JSON.stringify(g?.final_payment));

  // --- 7) Vehicle freed ---
  const ve = await req('GET', '/api/v1/vehicles/' + nvid);
  console.log('[7] vehicle availability:', ve.body.data?.vehicle?.availability_status);

  console.log('\nRESULT: ' + ((g?.status === 'completed' && g?.payment_status === 'paid') ? 'E2E CYCLE COMPLETE ✅' : 'CHECK') );
  console.log('DONE');
}
main().catch(e => { console.error('FATAL', e.message); process.exit(1); });
