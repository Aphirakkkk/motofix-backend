// ─── สร้าง Admin User ───
// รันด้วย:  node createAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ เชื่อมต่อ MongoDB สำเร็จ');

    // ลบ admin เก่าถ้ามี
    await User.deleteOne({ username: 'admin' });

    const admin = await User.create({
      name:     'เจ้าของร้าน',
      username: 'admin',
      password: 'motofix1234',
      role:     'admin',
    });

    console.log('\n🎉 สร้าง Admin สำเร็จ!');
    console.log('─'.repeat(30));
    console.log(`👤 Username : admin`);
    console.log(`🔑 Password : motofix1234`);
    console.log('─'.repeat(30));
    console.log('\n⚠️  เปลี่ยน Password หลัง Login ครั้งแรกด้วยนะครับ!');

  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาด:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();