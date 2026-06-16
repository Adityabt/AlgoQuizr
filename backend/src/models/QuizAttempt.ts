import { Schema, model, Document, Types } from 'mongoose';

export interface IQuizAttempt extends Document {
  user: Types.ObjectId;
  topic: string;
  score: number;
  total: number;
  createdAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export const QuizAttempt = model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);