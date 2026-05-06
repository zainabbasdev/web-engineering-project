import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import User model
import { User } from './src/models/User.js';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('✓ Cleared existing users');

    // Create admin user
    const email = 'zainabbas@gmail.com';
    const password = 'Admin@123';

    const adminUser = new User({
      name: 'Zain Abbas',
      email: email,
      password: password,
      pumpName: 'Hassan Petroleum',
      role: 'admin',
    });

    await adminUser.save();
    console.log(`✓ Created admin user: ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role: admin`);

    // Create test users
    const managerPassword = 'Manager@123';
    
    const manager = new User({
      name: 'Awais Akbar',
      email: 'awaisakbar@gmail.com',
      password: managerPassword,
      pumpName: 'Hassan Petroleum',
      role: 'manager',
    });

    await manager.save();
    console.log(`\n✓ Created manager user: manager@example.com`);
    console.log(`  Password: ${managerPassword}`);
    console.log(`  Role: manager`);

    const accountantPassword = 'Accountant@123';
    
    const accountant = new User({
      name: 'Fahad Hussain',
      email: 'fahad@gmail.com',
      password: accountantPassword,
      pumpName: 'Hassan Petroleum',
      role: 'accountant',
    });

    await accountant.save();
    console.log(`\n✓ Created accountant user: accountant@example.com`);
    console.log(`  Password: ${accountantPassword}`);
    console.log(`  Role: accountant`);

    console.log('\n✓ Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:      zainabbas@gmail.com / Admin@123');
    console.log('Manager:    awaisakbar@gmail.com / Manager@123');
    console.log('Accountant: fahad@gmail.com / Accountant@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('✗ Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
