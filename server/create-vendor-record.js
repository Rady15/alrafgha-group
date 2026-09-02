const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Vendor = require('./models/Vendor');

const DB = 'mongodb://localhost:27017/alrafgha-group';

mongoose
  .connect(DB)
  .then(async () => {
    const email = 'vendor@alrafgha-group.com';
    const existing = await Vendor.findOne({ email });
    if (existing) {
      console.log('Vendor record already exists:', existing.email);
      process.exit(0);
    }
    const password_hash = await bcrypt.hash('Vendor@123', 12);
    await Vendor.create({
      name: 'معرض الراحة للتأجير',
      contact_number: '+966554444004',
      email,
      id_type: 'pan_card',
      document_url: 'https://example.com/doc.pdf',
      address: 'الرياض، المملكة العربية السعودية',
      password_hash,
      is_verified: true,
      email_verified: true,
    });
    console.log('Created Vendor record ->', email);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
