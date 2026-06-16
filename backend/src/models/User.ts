import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  plan: 'Free' | 'Pro';
  createdAt: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name:               { type: String, required: true, trim: true },
    username:           { type: String, required: true, unique: true, trim: true, lowercase: true },
    email:              { type: String, required: true, unique: true, trim: true, lowercase: true },
    password:           { type: String, required: true },
    plan:               { type: String, enum: ['Free', 'Pro'], default: 'Free' },
    resetToken:         { type: String },
    resetTokenExpiry:   { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>('User', UserSchema);