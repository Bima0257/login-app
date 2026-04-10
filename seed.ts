import { db } from './lib/db';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    const password = await bcrypt.hash('tidakadapassword', 10);

    await db.query(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      ['bima@gmail.com', 'admin', password],
    );

    console.log('✅ Seeder berhasil: user dibuat');
    process.exit();
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
}

seed();
