import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Expense } from '../models/Expense';

dotenv.config();

const DEMO_USER = {
  email: 'demo@expense.app',
  password: 'Demo@123',
  name: 'Demo User'
};

const DEMO_EXPENSES = [
  { amount: 450, category: 'food', description: 'Grocery shopping', date: new Date('2025-12-15') },
  { amount: 120, category: 'transport', description: 'Uber ride', date: new Date('2025-12-16') },
  { amount: 800, category: 'utilities', description: 'Electricity bill', date: new Date('2025-12-10') },
  { amount: 350, category: 'entertainment', description: 'Movie tickets', date: new Date('2025-12-17') },
  { amount: 2500, category: 'healthcare', description: 'Medical checkup', date: new Date('2025-12-12') },
  { amount: 1200, category: 'shopping', description: 'Clothing', date: new Date('2025-12-14') },
  { amount: 3000, category: 'education', description: 'Online course', date: new Date('2025-12-08') },
  { amount: 200, category: 'food', description: 'Restaurant dinner', date: new Date('2025-12-18') },
  { amount: 80, category: 'transport', description: 'Fuel', date: new Date('2025-12-19') },
  { amount: 150, category: 'other', description: 'Miscellaneous', date: new Date('2025-12-11') }
];

async function seedDemo() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';
    await mongoose.connect(mongoUri);

    console.log('Connected to database');

    let demoUser = await User.findOne({ email: DEMO_USER.email });

    if (demoUser) {
      console.log('Demo user already exists');
      await Expense.deleteMany({ user: demoUser._id });
      console.log('Cleared existing demo expenses');
    } else {
      demoUser = await User.create(DEMO_USER);
      console.log('Created demo user');
    }

    const expensesWithUser = DEMO_EXPENSES.map(expense => ({
      ...expense,
      user: demoUser._id
    }));

    await Expense.insertMany(expensesWithUser);
    console.log('Created demo expenses');

    console.log(`\nDemo account credentials:`);
    console.log(`Email: ${DEMO_USER.email}`);
    console.log(`Password: ${DEMO_USER.password}`);

    await mongoose.disconnect();
    console.log('\nDatabase seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDemo();
