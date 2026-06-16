import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../types/express';

export async function getMe(req: AuthRequest, res: Response) {
  const user = await User.findById(req.user!.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  return res.json({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    plan: user.plan,
    createdAt: user.createdAt,
  });
}

export async function updateMe(req: AuthRequest, res: Response) {
  const { name, username, email } = req.body;

  const user = await User.findById(req.user!.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // If username or email changed, ensure no conflict with another account
  if (username && username !== user.username) {
    const exists = await User.findOne({ username, _id: { $ne: user.id } });
    if (exists) return res.status(409).json({ message: 'Username already taken' });
    user.username = username;
  }

  if (email && email !== user.email) {
    const exists = await User.findOne({ email, _id: { $ne: user.id } });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    user.email = email;
  }

  if (name) user.name = name;

  await user.save();

  return res.json({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    plan: user.plan,
    createdAt: user.createdAt,
  });
}

export async function changePassword(req: AuthRequest, res: Response) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: 'currentPassword and newPassword are required' });
  if (newPassword.length < 8)
    return res.status(400).json({ message: 'New password must be at least 8 characters' });

  const user = await User.findById(req.user!.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const valid = await user.comparePassword(currentPassword);
  if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });

  user.password = newPassword;
  await user.save();

  return res.json({ message: 'Password updated successfully' });
}