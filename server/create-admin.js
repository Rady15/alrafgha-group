const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const DB = 'mongodb://localhost:27017/alrafgha-group';

const email = process.argv[2] || 'admin@alrafgha-group.com';
const password = process.argv[3] || 'Admin@123';
const name = process.argv[4] || 'Admin';
const role = process.argv[5] || 'admin';

mongoose
  .connect(DB)
  .then(async () => {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('User already exists:', existing.email, '| role:', existing.role);
      process.exit(0);
    }
    const password_hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password_hash,
      role,
      is_active: true,
      is_verified: true,
    });
    console.log(`Created ${role} -> ${user.email} / ${password}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
