import { Request, Response } from 'express';
import { User } from '../models/User';
import { signToken } from '../config/jwt';

export async function register(req: Request, res: Response) {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'Email or username already in use' });
    }

    const user = await User.create({ name, username, email, password });
    const token = signToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
}