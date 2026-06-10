import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, username, password, role } = req.body;
  if (!name || !email || !username || !password) throw new AppError('All fields are required', 400);

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) throw new AppError('Email or username already exists', 400);

  const user = await User.create({ name, email, username, password, role: role || 'student' });
  res.status(201).json({ success: true, data: user });
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, isActive, password } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  if (name) user.name = name;
  if (email) user.email = email;
  if (typeof isActive === 'boolean') user.isActive = isActive;
  if (password) user.password = password;

  await user.save();
  res.json({ success: true, data: user });
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
};
