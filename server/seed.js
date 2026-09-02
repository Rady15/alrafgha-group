const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Vehicle = require('./models/Vehicle');
const Package = require('./models/Package');
const Booking = require('./models/Booking');

const DB = 'mongodb://localhost:27017/alrafgha-group';

const packages = [
  { name: 'سيارة اقتصادية', vehicle_type: 'car', cc_range_min: 800, cc_range_max: 1200, price_per_hour: 50, price_per_km: 5 },
  { name: 'سيارة قياسية', vehicle_type: 'car', cc_range_min: 1200, cc_range_max: 1600, price_per_hour: 80, price_per_km: 8 },
  { name: 'سيارة فاخرة', vehicle_type: 'car', cc_range_min: 1600, cc_range_max: 2500, price_per_hour: 120, price_per_km: 12 },
  { name: 'دراجة اقتصادية', vehicle_type: 'bike', cc_range_min: 100, cc_range_max: 150, price_per_hour: 15, price_per_km: 1.5 },
  { name: 'دراجة قياسية', vehicle_type: 'bike', cc_range_min: 150, cc_range_max: 250, price_per_hour: 25, price_per_km: 2.5 },
  { name: 'دراجة فاخرة', vehicle_type: 'bike', cc_range_min: 250, cc_range_max: 500, price_per_hour: 40, price_per_km: 4 },
];

const customers = [
  { name: 'محمد العتيبي', email: 'amit@alrafgha-group.com', phone: '+966551111001' },
  { name: 'نورة الدوسري', email: 'priya@alrafgha-group.com', phone: '+966552222002' },
  { name: 'خالد القحطاني', email: 'rahul@alrafgha-group.com', phone: '+966553333003' },
];

const vehicles = [
  { name: 'سويفت', model_name: 'سويفت VXI', type: 'car', brand: 'ماروتي سوزوكي', cc_engine: 1197, location: 'الرياض', registration_number: 'WB04AB1001', engine_number: 'ENG-SWIFT-1001', chassis_number: 'CHS-SWIFT-1001', is_featured: true, image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80' },
  { name: 'كرتا', model_name: 'كرتا SX', type: 'car', brand: 'هيونداي', cc_engine: 1497, location: 'جدة', registration_number: 'WB04AB1002', engine_number: 'ENG-CRETA-1002', chassis_number: 'CHS-CRETA-1002', is_featured: true, image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80' },
  { name: 'فورتشنر', model_name: 'فورتشنر ٤×٤', type: 'car', brand: 'تويوتا', cc_engine: 2694, location: 'الدمام', registration_number: 'MH01CD2001', engine_number: 'ENG-FORT-2001', chassis_number: 'CHS-FORT-2001', is_featured: false, image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80' },
  { name: 'سي بي شاين', model_name: 'سي بي شاين SP', type: 'bike', brand: 'هوندا', cc_engine: 125, location: 'الرياض', registration_number: 'WB04AB2001', engine_number: 'ENG-SHINE-2001', chassis_number: 'CHS-SHINE-2001', is_featured: true, image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80' },
  { name: 'كلاسيك ٣٥٠', model_name: 'كلاسيك ٣٥٠', type: 'bike', brand: 'رويال إينفيلد', cc_engine: 349, location: 'مكة', registration_number: 'DL01EF3001', engine_number: 'ENG-RE-3001', chassis_number: 'CHS-RE-3001', is_featured: true, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80' },
  { name: 'بولسار', model_name: 'بولسار ٢٢٠F', type: 'bike', brand: 'باجاج', cc_engine: 220, location: 'المدينة', registration_number: 'KA01GH4001', engine_number: 'ENG-PUL-4001', chassis_number: 'CHS-PUL-4001', is_featured: false, image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80' },
];

const PASSWORD = 'User@123';

async function seed() {
  // Clear collections whose seed keys changed (prevents duplicate packages when names are localized)
  await Package.deleteMany({});
  await Booking.deleteMany({});

  // 1. Packages (upsert by name+vehicle_type)
  for (const p of packages) {
    await Package.findOneAndUpdate(
      { name: p.name, vehicle_type: p.vehicle_type },
      { ...p, description: `${p.name} package`, is_active: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`✅ Packages: ${packages.length} ready`);

  // 2. Customers (upsert by email)
  const customerIds = {};
  const password_hash = await bcrypt.hash(PASSWORD, 12);
  for (const c of customers) {
    const u = await User.findOneAndUpdate(
      { email: c.email },
      { ...c, password_hash, role: 'user', is_verified: true, is_active: true, address: 'المملكة العربية السعودية' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    customerIds[c.email] = u._id;
  }
  console.log(`✅ Customers: ${customers.length} ready (password: ${PASSWORD})`);

  // 3. Vendor
  const vendor = await Vendor.findOneAndUpdate(
    { email: 'vendor@alrafgha-group.com' },
    { name: 'معرض الراحة للتأجير', contact_number: '+966554444004', address: 'الرياض، المملكة العربية السعودية', email_verified: true, is_verified: true },
    { new: true }
  );
  if (!vendor) throw new Error('Vendor vendor@alrafgha-group.com not found. Create it first.');
  const vendorId = vendor._id;

  // 4. Vehicles (upsert by registration_number)
  const vehicleIds = {};
  for (const v of vehicles) {
    const created = await Vehicle.findOneAndUpdate(
      { registration_number: v.registration_number },
      {
        ...v,
        vendor_id: vendorId,
        rc_document: 'https://example.com/rc.pdf',
        insurance_document: 'https://example.com/insurance.pdf',
        images: [v.image],
        availability_status: 'available',
        description: `${v.brand} ${v.name} (${v.model_name}) available for rent in ${v.location}.`,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    vehicleIds[v.registration_number] = created._id;
  }
  console.log(`✅ Vehicles: ${vehicles.length} ready (vendor: vendor@alrafgha-group.com)`);

  // 5. Sample booking (booking_requested) - Amit books the Swift
  const amitId = customerIds['amit@alrafgha-group.com'];
  const swiftId = vehicleIds['WB04AB1001'];
  const economyCar = await Package.findOne({ name: 'سيارة اقتصادية', vehicle_type: 'car' });
  const existing = await Booking.findOne({ user_id: amitId, vehicle_id: swiftId, status: 'booking_requested' });
  if (!existing) {
    const est = economyCar.price_per_hour * 24; // rough estimate
    await Booking.create({
      user_id: amitId,
      vehicle_id: swiftId,
      vendor_id: vendorId,
      package_id: economyCar._id,
      start_location: 'الرياض',
      requested_pickup_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      requested_pickup_time: '10:00',
      estimated_cost: est,
      advance_payment: { amount: Math.round(est * 0.4), status: 'completed', paid_at: new Date() },
      status: 'booking_requested',
      payment_status: 'paid',
    });
    console.log('✅ Sample booking created (Amit -> Swift, status: booking_requested)');
  } else {
    console.log('ℹ️ Sample booking already exists, skipped');
  }

  console.log('\n=== Seed summary ===');
  console.log('Vehicles:', await Vehicle.countDocuments());
  console.log('Users:', await User.countDocuments());
  console.log('Packages:', await Package.countDocuments());
  console.log('Bookings:', await Booking.countDocuments());
}

async function seedLoyaltyTiers() {
  const LoyaltyTier = require('./models/LoyaltyTier');
  const count = await LoyaltyTier.countDocuments();
  if (count === 0) {
    await LoyaltyTier.insertMany([
      { name: 'Bronze', name_ar: 'برونزي', level: 1, min_spending: 0, min_bookings: 0, discount_percent: 5, color: '#CD7F32', icon: '🥉', benefits: ['5% discount on all bookings', 'Earn points on every ride'] },
      { name: 'Silver', name_ar: 'فضي', level: 2, min_spending: 5000, min_bookings: 5, discount_percent: 10, color: '#C0C0C0', icon: '🥈', benefits: ['10% discount on all bookings', 'Priority booking', 'Earn 1.5x points'] },
      { name: 'Gold', name_ar: 'ذهبي', level: 3, min_spending: 15000, min_bookings: 15, discount_percent: 15, color: '#FFD700', icon: '🥇', benefits: ['15% discount on all bookings', 'Free vehicle upgrade when available', 'Priority support', 'Earn 2x points'] },
      { name: 'Platinum', name_ar: 'بلاتيني', level: 4, min_spending: 30000, min_bookings: 30, discount_percent: 20, color: '#E5E4E2', icon: '💎', benefits: ['20% discount on all bookings', 'Free pickup & delivery', 'Dedicated account manager', 'Earn 3x points', 'Exclusive offers'] }
    ]);
    console.log('✅ Loyalty tiers: 4 seeded');
  } else {
    console.log('ℹ️ Loyalty tiers already exist, skipped');
  }
}

async function seedSiteSettings() {
  const SiteSettings = require('./models/SiteSettings');
  const count = await SiteSettings.countDocuments();
  if (count === 0) {
    await SiteSettings.insertMany([
      { key: 'site_name', value: 'Alrafgha Group', group: 'general', label: 'Site Name', label_ar: 'اسم الموقع' },
      { key: 'site_name_ar', value: 'مجموعة الرفغا', group: 'general', label: 'Site Name (Arabic)', label_ar: 'اسم الموقع عربي' },
      { key: 'contact_email', value: 'support@alrafgha-group.com', group: 'contact', label: 'Contact Email', label_ar: 'بريد التواصل' },
      { key: 'contact_phone', value: '+966550000000', group: 'contact', label: 'Contact Phone', label_ar: 'تليفون التواصل' },
      { key: 'contact_address', value: 'Riyadh, Saudi Arabia', group: 'contact', label: 'Address', label_ar: 'العنوان' },
      { key: 'loyalty_points_per_riyal', value: 1, group: 'loyalty', label: 'Points per SAR', label_ar: 'نقاط لكل ريال' },
      { key: 'referral_points', value: 100, group: 'loyalty', label: 'Referral Points', label_ar: 'نقاط الإحالة' },
      { key: 'currency', value: 'SAR', group: 'general', label: 'Currency', label_ar: 'العملة' }
    ]);
    console.log('✅ Site settings: 8 seeded');
  } else {
    console.log('ℹ️ Site settings already exist, skipped');
  }
}

async function seedOffersAndBlog() {
  const Offer = require('./models/Offer');
  const BlogPost = require('./models/BlogPost');
  const User = require('./models/User');

  const offerCount = await Offer.countDocuments();
  if (offerCount === 0) {
    const admin = await User.findOne({ role: 'admin' });
    await Offer.insertMany([
      {
        title: 'Weekend Special',
        description: 'Get 20% off on all car rentals for weekends',
        discount_type: 'percentage',
        discount_value: 20,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        applicable_all_vehicles: true,
        is_active: true,
        created_by: admin?._id
      },
      {
        title: 'First Ride Free KM',
        description: 'SAR 50 off on your first booking',
        discount_type: 'fixed',
        discount_value: 50,
        start_date: new Date(),
        end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        applicable_all_vehicles: true,
        is_active: true,
        created_by: admin?._id
      }
    ]);
    console.log('✅ Offers: 2 seeded');
  } else {
    console.log('ℹ️ Offers already exist, skipped');
  }

  const blogCount = await BlogPost.countDocuments();
  if (blogCount === 0) {
    const admin = await User.findOne({ role: 'admin' });
    await BlogPost.create({
      title: 'Welcome to Alrafgha Group',
      slug: 'welcome-to-alrafgha-group',
      excerpt: 'Discover the best car rental experience in Saudi Arabia with Alrafgha Group.',
      content: '<h2>Welcome!</h2><p>Alrafgha Group is your trusted partner for car and bike rentals across Saudi Arabia. With a wide range of vehicles, transparent pricing, and exceptional customer service, we make every journey effortless.</p><p>Book your next ride today and experience the difference!</p>',
      category: 'Announcements',
      tags: ['welcome', 'rental', 'saudi'],
      author: admin?._id,
      is_published: true,
      published_at: new Date()
    });
    console.log('✅ Blog posts: 1 seeded');
  } else {
    console.log('ℹ️ Blog posts already exist, skipped');
  }
}

mongoose
  .connect(DB)
  .then(() => seed())
  .then(() => seedLoyaltyTiers())
  .then(() => seedSiteSettings())
  .then(() => seedOffersAndBlog())
  .then(() => { console.log('🎉 Seed complete'); process.exit(0); })
  .catch((err) => { console.error('❌ Seed failed:', err); process.exit(1); });
