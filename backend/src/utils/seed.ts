import 'dotenv/config';
import connectDB from '../config/db';
import User from '../models/User';
import Subject from '../models/Subject';

const SUBJECTS = [
  { name: 'Discrete Mathematics', code: 'DM', order: 1 },
  { name: 'Engineering Mathematics', code: 'EM', order: 2 },
  { name: 'Theory of Computation', code: 'TOC', order: 3 },
  { name: 'Digital Logic', code: 'DL', order: 4 },
  { name: 'Computer Organization and Architecture', code: 'COA', order: 5 },
  { name: 'C Programming', code: 'CP', order: 6 },
  { name: 'Data Structures', code: 'DS', order: 7 },
  { name: 'Algorithms', code: 'ALGO', order: 8 },
  { name: 'Compiler Design', code: 'CD', order: 9 },
  { name: 'Operating Systems', code: 'OS', order: 10 },
  { name: 'DBMS', code: 'DBMS', order: 11 },
  { name: 'Computer Networks', code: 'CN', order: 12 },
  { name: 'General Aptitude', code: 'GA', order: 13 },
];

const seed = async (): Promise<void> => {
  await connectDB();
  console.log('🌱 Starting seed...');

  // Create admin
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gpms.com';
  const adminName = process.env.ADMIN_NAME || 'System Admin';

  const existingAdmin = await User.findOne({ username: adminUsername });
  if (!existingAdmin) {
    await User.create({ name: adminName, email: adminEmail, username: adminUsername, password: adminPassword, role: 'admin' });
    console.log(`✅ Admin created: ${adminUsername} / ${adminPassword}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminUsername}`);
  }

  // Seed subjects
  for (const sub of SUBJECTS) {
    const existing = await Subject.findOne({ code: sub.code });
    if (!existing) {
      await Subject.create(sub);
      console.log(`✅ Subject created: ${sub.name}`);
    } else {
      console.log(`ℹ️  Subject exists: ${sub.name}`);
    }
  }

  console.log('🎉 Seed complete!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
