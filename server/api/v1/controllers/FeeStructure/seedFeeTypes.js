const mongoose = require('mongoose');
const FeeType = require('../../../../models/feeTypeModel');

mongoose.connect('mongodb+srv://nodejscharu076:Charu%404699@novaerp.d8zjulu.mongodb.net/?retryWrites=true&w=majority&appName=NovaERP');

const feeTypes = [
  { name: 'Admission Fee', category: 'Academic' },
  { name: 'Tuition Fee', category: 'Academic' },
  { name: 'Term Fee', category: 'Academic' },
  { name: 'Development Fee', category: 'Academic' },
  { name: 'Transport Fee', category: 'Transport' },
  { name: 'Excursion Fee', category: 'Activity', isOptional: true },
  { name: 'Activity Fee', category: 'Activity' },
  { name: 'Library Fee', category: 'Material' },
  { name: 'Lab Fee', category: 'Material' },
  { name: 'Digital Content Fee', category: 'Material' },
  { name: 'Examination Fee', category: 'Exam' },
  { name: 'Assessment Fee', category: 'Exam' },
  { name: 'ID Card Fee', category: 'Misc' },
  { name: 'Uniform Fee', category: 'Misc', isOptional: true },
  { name: 'Caution Deposit', category: 'Misc' },
  { name: 'Late Fee', category: 'Misc' },
  { name: 'Meal Fee', category: 'Optional', isOptional: true },
  { name: 'Daycare Fee', category: 'Optional', isOptional: true },
  { name: 'Coaching Fee', category: 'Optional', isOptional: true }
];

async function seed() {
  await FeeType.deleteMany({});
  await FeeType.insertMany(feeTypes);
  console.log('Fee types seeded!');
  process.exit();
}

seed();
