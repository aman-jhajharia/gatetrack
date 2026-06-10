import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken, generateRefreshToken, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) throw new AppError('Please provide username and password', 400);

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user || !user.isActive) throw new AppError('Invalid credentials', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  const token = generateToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  res.json({
    success: true,
    token,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ success: true, user: req.user });
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) throw new AppError('Please provide current and new password', 400);

  const user = await User.findById(req.user!._id);
  if (!user) throw new AppError('User not found', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect', 401);

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
};
