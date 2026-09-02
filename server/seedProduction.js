const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Package = require('./models/Package');

const PASSWORD = 'User@123';
const STAFF_PASSWORD = 'Staff@123';

const users = [
    { name: 'Admin',    email: 'admin@alrafgha-group.com',     password: 'Admin@123',  role: 'admin' },
    { name: 'Staff',    email: 'staff@alrafgha-group.com',     password: STAFF_PASSWORD, role: 'office_staff' },
    { name: 'أحمد محمد', email: 'amit@alrafgha-group.com',     password: PASSWORD,    role: 'user' },
    { name: 'سارة علي', email: 'priya@alrafgha-group.com',    password: PASSWORD,    role: 'user' },
    { name: 'خالد عبدالله', email: 'rahul@alrafgha-group.com', password: PASSWORD,  role: 'user' },
];
// NOTE: vendor@alrafgha-group.com is NOT in users[] — it's created via the Vendor model

const packages = [
    { name: 'ال Economy', vehicle_type: 'car',   cc_range_min: 800,  cc_range_max: 1200, price_per_hour: 50,  price_per_km: 5 },
    { name: 'ال Standard', vehicle_type: 'car',  cc_range_min: 1200, cc_range_max: 1600, price_per_hour: 80,  price_per_km: 8 },
    { name: 'ال Premium',  vehicle_type: 'car',  cc_range_min: 1600, cc_range_max: 2500, price_per_hour: 120, price_per_km: 12 },
    { name: 'موتور Economy', vehicle_type: 'bike', cc_range_min: 100, cc_range_max: 150, price_per_hour: 15, price_per_km: 1.5 },
    { name: 'موتور Standard', vehicle_type: 'bike', cc_range_min: 150, cc_range_max: 250, price_per_hour: 25, price_per_km: 2.5 },
    { name: 'موتور Premium', vehicle_type: 'bike', cc_range_min: 250, cc_range_max: 500, price_per_hour: 40, price_per_km: 4 },
];

const vehicles = [
    { name: 'Swift', model_name: 'Swift VXI', type: 'car', brand: 'Suzuki', cc_engine: 1197, location: 'الرياض', registration_number: 'WB04AB1001', engine_number: 'ENG-SWIFT-1001', chassis_number: 'CHS-SWIFT-1001', is_featured: true, image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80' },
    { name: 'Creta', model_name: 'Creta SX', type: 'car', brand: 'Hyundai', cc_engine: 1497, location: 'جدة', registration_number: 'WB04AB1002', engine_number: 'ENG-CRETA-1002', chassis_number: 'CHS-CRETA-1002', is_featured: true, image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80' },
    { name: 'Fortuner', model_name: 'Fortuner Legender', type: 'car', brand: 'Toyota', cc_engine: 2694, location: 'الدمام', registration_number: 'MH01CD2001', engine_number: 'ENG-FORT-2001', chassis_number: 'CHS-FORT-2001', is_featured: false, image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80' },
    { name: 'CB Shine SP', model_name: 'CB Shine SP', type: 'bike', brand: 'Honda', cc_engine: 125, location: 'الرياض', registration_number: 'WB04AB2001', engine_number: 'ENG-SHINE-2001', chassis_number: 'CHS-SHINE-2001', is_featured: true, image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80' },
    { name: 'Royal Enfield', model_name: 'Royal Enfield Classic', type: 'bike', brand: 'Royal Enfield', cc_engine: 349, location: 'جدة', registration_number: 'DL01EF3001', engine_number: 'ENG-RE-3001', chassis_number: 'CHS-RE-3001', is_featured: true, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80' },
    { name: 'Pulsar', model_name: 'Pulsar NS200', type: 'bike', brand: 'Bajaj', cc_engine: 220, location: 'مكة المكرمة', registration_number: 'KA01GH4001', engine_number: 'ENG-PUL-4001', chassis_number: 'CHS-PUL-4001', is_featured: false, image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80' },
];

async function seedProduction(db) {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
        console.log('⚠️  Database already has users, skipping auto-seed.');
        return;
    }

    console.log('🌱 Empty database detected — seeding production data...');

    // Packages
    for (const p of packages) {
        await Package.findOneAndUpdate(
            { name: p.name, vehicle_type: p.vehicle_type },
            { ...p, description: `${p.name} package`, is_active: true },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }
    console.log(`✅ Packages: ${packages.length}`);

    // Users
    for (const u of users) {
        const password_hash = await bcrypt.hash(u.password, 12);
        await User.findOneAndUpdate(
            { email: u.email },
            {
                name: u.name,
                email: u.email,
                password_hash,
                role: u.role,
                is_verified: true,
                is_active: true,
                phone: '+966550000000',
                address: 'الرياض، المملكة العربية السعودية',
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }
    console.log(`✅ Users: ${users.length}`);

    // Vendor (Vendor model record)
    const vendorEmail = 'vendor@alrafgha-group.com';
    const vendorPasswordHash = await bcrypt.hash('Vendor@123', 12);
    await Vendor.findOneAndUpdate(
        { email: vendorEmail },
        {
            name: 'معرض الراحة للتأجير',
            contact_number: '+966554444004',
            email: vendorEmail,
            password_hash: vendorPasswordHash,
            id_type: 'national_id',
            document_url: 'https://example.com/doc.pdf',
            address: 'الرياض، المملكة العربية السعودية',
            is_verified: true,
            email_verified: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`✅ Vendor: ${vendorEmail}`);

    // Vehicles
    const VendorModel = require('./models/Vendor');
    const Vehicle = require('./models/Vehicle');
    const vendorRecord = await VendorModel.findOne({ email: vendorEmail });
    if (vendorRecord) {
        for (const v of vehicles) {
            await Vehicle.findOneAndUpdate(
                { registration_number: v.registration_number },
                {
                    ...v,
                    vendor_id: vendorRecord._id,
                    rc_document: 'https://example.com/rc.pdf',
                    insurance_document: 'https://example.com/insurance.pdf',
                    images: [v.image],
                    availability_status: 'available',
                    description: `${v.brand} ${v.name} (${v.model_name}) available for rent in ${v.location}.`,
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
        console.log(`✅ Vehicles: ${vehicles.length}`);
    }

    // Site Settings
    const SiteSettings = require('./models/SiteSettings');
    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
        await SiteSettings.insertMany([
            { key: 'site_name', value: 'Alrafgha Group', group: 'general', label: 'Site Name', label_ar: 'اسم الموقع' },
            { key: 'contact_email', value: 'support@alrafgha-group.com', group: 'contact', label: 'Contact Email', label_ar: ' البريد الإلكتروني' },
            { key: 'contact_phone', value: '+966550000000', group: 'contact', label: 'Contact Phone', label_ar: 'رقم التواصل' },
            { key: 'contact_address', value: 'Riyadh, Saudi Arabia', group: 'contact', label: 'Address', label_ar: 'العنوان' },
            { key: 'currency', value: 'SAR', group: 'general', label: 'Currency', label_ar: 'العملة' },
        ]);
        console.log('✅ Site settings seeded');
    }

    // Loyalty Tiers
    const LoyaltyTier = require('./models/LoyaltyTier');
    const tierCount = await LoyaltyTier.countDocuments();
    if (tierCount === 0) {
        await LoyaltyTier.insertMany([
            { name: 'Bronze', name_ar: 'برونزي', level: 1, min_spending: 0, min_bookings: 0, discount_percent: 5, color: '#CD7F32', icon: '🥉', benefits: ['5% discount'] },
            { name: 'Silver', name_ar: 'فضي', level: 2, min_spending: 5000, min_bookings: 5, discount_percent: 10, color: '#C0C0C0', icon: '🥈', benefits: ['10% discount'] },
            { name: 'Gold', name_ar: 'ذهبي', level: 3, min_spending: 15000, min_bookings: 15, discount_percent: 15, color: '#FFD700', icon: '🥇', benefits: ['15% discount'] },
            { name: 'Platinum', name_ar: 'بلاتيني', level: 4, min_spending: 30000, min_bookings: 30, discount_percent: 20, color: '#E5E4E2', icon: '💎', benefits: ['20% discount'] },
        ]);
        console.log('✅ Loyalty tiers seeded');
    }

    console.log('\n🎉 Production seed complete! All test users and data are ready.');
    console.log('\n📋 Login credentials:');
    console.log('   Admin:   admin@alrafgha-group.com    / Admin@123');
    console.log('   Staff:   staff@alrafgha-group.com    / Staff@123');
    console.log('   Vendor:  vendor@alrafgha-group.com   / Vendor@123');
    console.log('   User:    amit@alrafgha-group.com     / User@123');
}

module.exports = seedProduction;
