import mongoose, { Schema, Document } from 'mongoose';

export interface IExpenseDocument extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpenseDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        'food',
        'transport',
        'utilities',
        'entertainment',
        'healthcare',
        'shopping',
        'education',
        'other',
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

export const Expense = mongoose.model<IExpenseDocument>('Expense', expenseSchema);
