import { Schema, model, Document } from 'mongoose';

export interface IQuestion extends Document {
  topicSlug: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const QuestionSchema = new Schema<IQuestion>({
  topicSlug: { type: String, required: true, index: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: Number, required: true },
  explanation: { type: String, required: true },
});

export const Question = model<IQuestion>('Question', QuestionSchema);