require('dotenv').config();
const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
const BASE = 'alrafgha-group-production.up.railway.app';
const SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// 1x1 red PNG (15 bytes) and minimal PDF-like text for tests
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==','base64');
const PDF = Buffer.from('%PDF-1.4 hello pdf test');

function req(method, path, token, body, raw, headers) {
  return new Promise((res, rej) => {
    const d = (body && typeof body === 'object') ? JSON.stringify(body) : body;
    const o = { hostname: BASE, path, method, headers: headers || {} };
    if (d && !raw) { o.headers['Content-Type'] = 'application/json'; o.headers['Content-Length'] = Buffer.byteLength(d); }
    if (raw) { o.headers['Content-Length'] = Buffer.byteLength(d); }
    if (token) o.headers['Authorization'] = 'Bearer ' + token;
    const r = https.request(o, rr => { let x = ''; rr.on('data', c => x += c); rr.on('end', () => { let j; try { j = JSON.parse(x); } catch { j = { raw: x }; } res({ s: rr.statusCode, b: j }); }); });
    r.on('error', rej); if (d) r.write(d); r.end();
  });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const login = async (email, pw) => { for (let i = 0; i < 5; i++) { const r = await req('POST','/api/v1/auth/login',null,{email,password:pw}); if (r.b.token) return r.b; await sleep(3000); } throw new Error('login failed'); };
  const adm = await login('admin@alrafgha-group.com','Admin@123');
  const tok = adm.token;

  // Get a vendor id reference
  const vehicles = await req('GET','/api/v1/vehicles/',tok);
  const car = (vehicles.b.data?.vehicles||[]).find(v=>v.type==='car');
  const vendorId = car?.vendor_id?._id || car?.vendor_id;
  console.log('vendorId:', vendorId);

  // --- ADMIN: Create a vehicle with file upload (FormData via multipart) ---
  const stamp = Date.now().toString().slice(-6);
  const reg = 'UP' + stamp;

  // Build multipart/form-data body
  const boundary = '----FormBoundary' + Date.now();
  const chunks = [];
  const addField = (name, value) => { chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`)); };
  const addFile = (name, filename, buf, mime) => {
      const header = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${filename}"\r\nContent-Type: ${mime}\r\n\r\n`);
      chunks.push(header, buf, Buffer.from('\r\n'));
  };

  addField('vendor_id', vendorId);
  addField('name', 'Hyundai i20 ' + stamp);
  addField('model_name', 'i20');
  addField('type', 'car');
  addField('brand', 'Hyundai');
  addField('registration_number', reg);
  addField('engine_number', 'EN'+stamp);
  addField('chassis_number', 'CH'+stamp);
  addField('cc_engine', '998');
  addField('location', 'Riyadh');
  addField('description', 'E2E test vehicle with upload');
  addFile('rc_document', 'rc.pdf', PDF, 'application/pdf');
  addFile('insurance_document', 'ins.pdf', PDF, 'application/pdf');
  addFile('vehicle_images', 'img1.png', PNG, 'image/png');
  addFile('vehicle_images', 'img2.png', PNG, 'image/png');

  // Upload rc_document
  const rcFormData = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="rc.pdf"\r\nContent-Type: application/pdf\r\n\r\n`);
  const rcBody = Buffer.concat([rcFormData, PDF, Buffer.from(`\r\n--${boundary}--\r\n`)]);
  const rcHdrs = {'Content-Type':'multipart/form-data; boundary='+boundary, 'Content-Length': Buffer.byteLength(rcBody)};
  const rcUp = await req('POST','/api/v1/upload/file',null,rcBody,true,rcHdrs);
  const rcUrl = rcUp.b.data?.url;
  console.log('    rc upload:', rcUp.s, rcUrl);

  // Upload insurance_document
  const insFormData = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="ins.pdf"\r\nContent-Type: application/pdf\r\n\r\n`);
  const insBody = Buffer.concat([insFormData, PDF, Buffer.from(`\r\n--${boundary}--\r\n`)]);
  const insUp = await req('POST','/api/v1/upload/file',null,insBody,true,{'Content-Type':'multipart/form-data; boundary='+boundary, 'Content-Length': Buffer.byteLength(insBody)});
  const insUrl = insUp.b.data?.url;
  console.log('    insurance upload:', insUp.s, insUrl);

  // Upload images (multiple)
  const imgHdr = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="files"; filename="img1.png"\r\nContent-Type: image/png\r\n\r\n`);
  const img2Hdr = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="files"; filename="img2.png"\r\nContent-Type: image/png\r\n\r\n`);
  const imgBody = Buffer.concat([imgHdr, PNG, Buffer.from('\r\n'), img2Hdr, PNG, Buffer.from(`\r\n--${boundary}--\r\n`)]);
  const imgUp = await req('POST','/api/v1/upload/files',null,imgBody,true,{'Content-Type':'multipart/form-data; boundary='+boundary, 'Content-Length': Buffer.byteLength(imgBody)});
  const imgUrls = imgUp.b.data?.files?.map(f => f.url) || [];
  console.log('    images upload:', imgUp.s, JSON.stringify(imgUrls));

  // Create vehicle with JSON (with returned URLs)
  const payload = JSON.stringify({
    vendor_id: vendorId, name: 'Hyundai i20 ' + stamp, model_name: 'i20', type: 'car', brand: 'Hyundai',
    registration_number: reg, engine_number: 'EN'+stamp, chassis_number: 'CH'+stamp, cc_engine: 998,
    location: 'Riyadh', rc_document: rcUrl, insurance_document: insUrl, vehicle_images: imgUrls,
    description: 'E2E test vehicle with upload'
  });
  const hdrs = {'Content-Type':'application/json', 'Content-Length': Buffer.byteLength(payload)};
  const created = await req('POST','/api/v1/vehicles',tok,payload,false,hdrs);
  const nvid = created.b.data?.vehicle?._id;
  if (!nvid) { console.log('ABORT'); return; }

  // Verify vehicle has the upload fields
  const gv = await req('GET','/api/v1/vehicles/'+nvid, tok);
  const v = gv.b.data?.vehicle;
  console.log('    vehicle rc_document:', v?.rc_document || null);
  console.log('    vehicle insurance_document:', v?.insurance_document || null);
  console.log('    vehicle images:', JSON.stringify(v?.vehicle_images || v?.images || null));

  // --- USER books it (advance) ---
  const usr = await login('amit@alrafgha-group.com','User@123');
  const stf = await login('staff@alrafgha-group.com','Staff@123');

  const ai = await req('POST','/api/v1/stripe/create-advance-intent',usr.token,{vehicle_id:nvid});
  const api = ai.b.data?.payment_intent_id;
  if (!api) { console.log('ABORT no advance intent'); return; }
  console.log('\n[2] advance intent:', ai.s, api);

  const { stripe } = require('stripe');
  const s = stripe(process.env.STRIPE_SECRET_KEY);
  await s.paymentIntents.confirm(api, { payment_method_data: { type:'card', card: { token:'tok_visa' } } });
  const vb = await req('POST','/api/v1/stripe/verify-and-book',usr.token,{payment_intent_id:api,vehicle_id:nvid,start_location:'Riyadh',requested_pickup_date:'2026-12-25',requested_pickup_time:'10:00'});
  const bid = vb.b.data?.booking?._id;
  const adv = vb.b.data?.booking?.advance_payment?.amount;
  console.log('    verify-and-book:', vb.s, bid, 'adv', adv);
  if (!bid) return;

  await req('PATCH',`/api/v1/bookings/${bid}/pickup`,stf.token,{actual_pickup_date:'2026-12-25',actual_pickup_time:'10:00',odometer_reading_start:1000,staff_id:usr.data.user.id,vehicle_plate_number:reg,engine_number:'EN'+stamp,chassis_number:'CH'+stamp});
  const ret = await req('PATCH',`/api/v1/bookings/${bid}/return`,stf.token,{actual_return_date:'2026-12-27',actual_return_time:'11:00',odometer_reading_end:1270,vehicle_plate_number:reg,engine_number:'EN'+stamp,chassis_number:'CH'+stamp,vehicle_condition:'perfect',damage_cost:0,staff_id:usr.data.user.id,amount_paid:adv,payment_mode:'online'});
  const rb = ret.b.data?.booking;
  const fcost = rb?.final_cost || 0;
  console.log('    return online-pending:', ret.s, '| pay', rb?.payment_status, '| final_payment', JSON.stringify(rb?.final_payment));

  const fin = await req('POST','/api/v1/stripe/create-final-intent',usr.token,{booking_id:bid,final_amount:fcost,advance_paid:adv});
  const fpi = fin.b.data?.payment_intent_id;
  console.log('    final intent:', fin.s, fpi, 'amt', fin.b.data?.amount);
  if (fpi) await s.paymentIntents.confirm(fpi,{payment_method_data:{type:'card',card:{token:'tok_visa'}}});

  // Send signed webhook for the new booking's final PI
  const piObj = { id: fpi, object: 'payment_intent', amount: fin.b.data.amount * 100, currency: 'sar', status: 'succeeded', metadata: { payment_type: 'final', booking_id: bid } };
  const evt = { id: 'evt_full_'+Date.now(), object:'event', type:'payment_intent.succeeded', data:{object:piObj}, livemode:false, created:Math.floor(Date.now()/1000) };
  const t = Math.floor(Date.now()/1000);
  const sig = crypto.createHmac('sha256',SECRET).update(`${t}.${JSON.stringify(evt)}`).digest('hex');
  const wh = await req('POST','/api/v1/stripe/webhook',null,evt,true,{...{Authorization:'Bearer '+tok},'Content-Type':'application/json','Content-Length':Buffer.byteLength(JSON.stringify(evt)),'Stripe-Signature':`t=${t},v1=${sig}`});
  console.log('    webhook:', wh.s, JSON.stringify(wh.b).substring(0,120));

  // Check settlement
  for (let i = 0; i < 6; i++) {
    await sleep(5000);
    const gb = await req('GET','/api/v1/bookings/'+bid,usr.token);
    const g = gb.b.data?.booking;
    console.log(`   poll ${i+1}: status=${g?.status} pay=${g?.payment_status} fp=${JSON.stringify(g?.final_payment)}`);
    if (g?.status==='completed' && g?.payment_status==='paid') break;
  }

  // Verify vehicle freed
  const ve = await req('GET','/api/v1/vehicles/'+nvid,usr.token);
  console.log('    vehicle availability:', ve.b.data?.vehicle?.availability_status);
  console.log('DONE');
}
main().catch(e => { console.error('FATAL', e.message); console.error(e.stack); process.exit(1); });
