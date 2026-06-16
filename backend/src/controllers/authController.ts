import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { signToken } from '../config/jwt';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function register(req: Request, res: Response) {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing)
      return res.status(409).json({ message: 'Email or username already in use' });
    const user = await User.create({ name, username, email, password });
    const token = signToken(user.id);
    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, username: user.username, email: user.email, plan: user.plan, createdAt: user.createdAt },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });
    const match = await user.comparePassword(password);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password' });
    const token = signToken(user.id);
    return res.json({
      token,
      user: { id: user.id, name: user.name, username: user.username, email: user.email, plan: user.plan, createdAt: user.createdAt },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user)
      return res.json({ message: 'If that email exists, a reset link has been sent.' });

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: 'AlgoQuizr <onboarding@resend.dev>',
      to: user.email,
      subject: 'Reset your AlgoQuizr password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:2rem;">
          <h2 style="color:#8b5cf6;">Reset your password</h2>
          <p>Hi ${user.name},</p>
          <p>Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetUrl}"
            style="display:inline-block;margin:1.5rem 0;padding:0.75rem 1.5rem;
            background:#8b5cf6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
            Reset Password
          </a>
          <p style="color:#888;font-size:0.85rem;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ message: 'Token and new password are required' });
    if (newPassword.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetToken: hashed,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({ message: 'Password reset successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
}