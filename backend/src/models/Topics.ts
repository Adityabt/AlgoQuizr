import { Schema, model, Document } from 'mongoose';

export interface ITopic extends Document {
  slug: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
}

const TopicSchema = new Schema<ITopic>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  questionCount: { type: Number, required: true },
});

export const Topic = model<ITopic>('Topic', TopicSchema);