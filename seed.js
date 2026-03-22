// ─── SEED DATA SCRIPT ───
// รันด้วย:  node seed.js

require('dotenv').config();
const mongoose = require('mongoose');

const Customer = require('./models/Customer');
const Part     = require('./models/Part');
const Job      = require('./models/Job');
const Invoice  = require('./models/Invoice');

// ── DATA ──────────────────────────────────────────────────

const customers = [
  { name: 'สมชาย ใจดี',      phone: '081-234-5678', bikes: [{ plate: 'กทบ 1234', model: 'Honda Wave 125i' }] },
  { name: 'มานี รักดี',       phone: '089-876-5432', bikes: [{ plate: 'นศ 5678',  model: 'Yamaha NMAX 155' }] },
  { name: 'วิชัย แข็งแรง',    phone: '087-111-2222', bikes: [{ plate: 'สข 9012',  model: 'Honda PCX 160' }] },
  { name: 'นิดา สดใส',        phone: '086-333-4444', bikes: [{ plate: 'ชม 3456',  model: 'Suzuki Smash 115' }] },
  { name: 'ประยุทธ มั่นคง',   phone: '085-555-6666', bikes: [{ plate: 'ภก 7890',  model: 'Kawasaki Z250' }] },
  { name: 'สุรีย์ ฝันหวาน',   phone: '084-777-8888', bikes: [{ plate: 'พท 1122',  model: 'Honda Click 125i' }] },
];

const parts = [
  { name: 'น้ำมันเครื่อง 10W-40',   category: 'น้ำมัน',      qty: 2,  minQty: 10, unit: 'ลิตร',  price: 180 },
  { name: 'ผ้าเบรคหน้า Honda',       category: 'เบรค',        qty: 1,  minQty: 5,  unit: 'ชิ้น',  price: 250 },
  { name: 'หัวเทียน NGK',            category: 'เครื่องยนต์', qty: 8,  minQty: 10, unit: 'อัน',   price: 120 },
  { name: 'โซ่ 428H',                category: 'ส่งกำลัง',    qty: 15, minQty: 5,  unit: 'เส้น',  price: 350 },
  { name: 'ยาง Michelin 100/80',     category: 'ยาง',          qty: 4,  minQty: 2,  unit: 'เส้น',  price: 950 },
  { name: 'ไส้กรองอากาศ',            category: 'กรอง',         qty: 6,  minQty: 3,  unit: 'ชิ้น',  price: 180 },
  { name: 'น้ำมันเกียร์',             category: 'น้ำมัน',      qty: 10, minQty: 5,  unit: 'ลิตร',  price: 120 },
  { name: 'ผ้าเบรคหลัง Yamaha',      category: 'เบรค',        qty: 3,  minQty: 5,  unit: 'ชิ้น',  price: 220 },
];

// ── MAIN ──────────────────────────────────────────────────

async function seed() {
  try {
    console.log('🔌 กำลังเชื่อมต่อ MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ เชื่อมต่อสำเร็จ');

    // ── ล้างข้อมูลเก่า ──
    console.log('\n🗑️  ลบข้อมูลเก่า...');
    await Promise.all([
      Customer.deleteMany({}),
      Part.deleteMany({}),
      Job.deleteMany({}),
      Invoice.deleteMany({}),
    ]);
    console.log('✅ ลบข้อมูลเก่าเสร็จ');

    // ── ใส่ลูกค้า ──
    console.log('\n👥 ใส่ข้อมูลลูกค้า...');
    const savedCustomers = await Customer.insertMany(customers);
    console.log(`✅ ใส่ลูกค้า ${savedCustomers.length} คน`);

    // ── ใส่อะไหล่ ──
    console.log('\n🔧 ใส่ข้อมูลอะไหล่...');
    const savedParts = await Part.insertMany(parts);
    console.log(`✅ ใส่อะไหล่ ${savedParts.length} รายการ`);

    // ── ใส่งานซ่อม ──
    console.log('\n📋 ใส่ข้อมูลงานซ่อม...');

    const jobsData = [
      { customer: savedCustomers[0]._id, plate: 'กทบ 1234', model: 'Honda Wave 125i',  detail: 'เปลี่ยนโซ่ + น้ำมันเครื่อง',         status: 'progress', price: 850  },
      { customer: savedCustomers[1]._id, plate: 'นศ 5678',  model: 'Yamaha NMAX 155',  detail: 'ตรวจเช็กเครื่องยนต์ ระบบไฟ',          status: 'waiting',  price: 500  },
      { customer: savedCustomers[2]._id, plate: 'สข 9012',  model: 'Honda PCX 160',    detail: 'เปลี่ยนยางหน้า-หลัง Michelin',         status: 'done',     price: 1200 },
      { customer: savedCustomers[3]._id, plate: 'ชม 3456',  model: 'Suzuki Smash 115', detail: 'ซ่อมไฟหน้า + เปลี่ยนแบตเตอรี่',       status: 'done',     price: 680  },
      { customer: savedCustomers[4]._id, plate: 'ภก 7890',  model: 'Kawasaki Z250',    detail: 'เซอร์วิสใหญ่ + เปลี่ยนหัวเทียน',      status: 'waiting',  price: 1500 },
      { customer: savedCustomers[5]._id, plate: 'พท 1122',  model: 'Honda Click 125i', detail: 'เปลี่ยนผ้าเบรคหน้า-หลัง',              status: 'done',     price: 450  },
      { customer: savedCustomers[0]._id, plate: 'กทบ 1234', model: 'Honda Wave 125i',  detail: 'เปลี่ยนไส้กรองอากาศ + ล้างคาร์บู',    status: 'done',     price: 380  },
      { customer: savedCustomers[2]._id, plate: 'สข 9012',  model: 'Honda PCX 160',    detail: 'ตรวจเช็กระบบเบรค + เติมน้ำมันเกียร์', status: 'done',     price: 320  },
    ];

    // บันทึกทีละรายการเพื่อให้ pre-save hook (jobId) ทำงาน
    const savedJobs = [];
    for (const jobData of jobsData) {
      const job = await Job.create(jobData);
      savedJobs.push(job);
      process.stdout.write('.');
    }
    console.log(`\n✅ ใส่งานซ่อม ${savedJobs.length} รายการ`);

    // ── ใส่ใบแจ้งหนี้ (เฉพาะงานที่ done) ──
    console.log('\n🧾 ใส่ใบแจ้งหนี้...');
    const doneJobs = savedJobs.filter(j => j.status === 'done');
    const invoicesData = doneJobs.map(job => ({
      job:      job._id,
      customer: job.customer,
      amount:   job.price,
      paid:     true,
      paidAt:   new Date(),
    }));

    const savedInvoices = [];
    for (const invData of invoicesData) {
      const inv = await Invoice.create(invData);
      savedInvoices.push(inv);
      process.stdout.write('.');
    }
    console.log(`\n✅ ใส่ใบแจ้งหนี้ ${savedInvoices.length} รายการ`);

    // ── สรุป ──
    console.log('\n' + '─'.repeat(40));
    console.log('🎉 Seed Data เสร็จสมบูรณ์!');
    console.log('─'.repeat(40));
    console.log(`👥 ลูกค้า       : ${savedCustomers.length} คน`);
    console.log(`🔧 อะไหล่       : ${savedParts.length} รายการ`);
    console.log(`📋 งานซ่อม      : ${savedJobs.length} รายการ`);
    console.log(`🧾 ใบแจ้งหนี้   : ${savedInvoices.length} รายการ`);
    console.log('─'.repeat(40));
    console.log('\n👉 เปิด http://localhost:5000/api/dashboard/stats ดูผลได้เลยครับ');

  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาด:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 ปิดการเชื่อมต่อ MongoDB แล้ว');
    process.exit(0);
  }
}

seed();
