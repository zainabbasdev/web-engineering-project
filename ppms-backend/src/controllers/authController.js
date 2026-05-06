import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/enums.js';

export class AuthController {
  // Register new admin
  static async register(req, res, next) {
    try {
      const { name, email, password, pumpName, role } = req.body;

      // Validate input
      if (!name || !email || !password || !pumpName) {
        return sendError(res, 'All fields are required', HTTP_STATUS.BAD_REQUEST);
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return sendError(res, 'Email already registered', HTTP_STATUS.BAD_REQUEST);
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        pumpName,
        role: role || 'admin',
      });

      await user.save();

      // Issue JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
      );

      // Return user without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return sendSuccess(
        res,
        'User registered successfully',
        {
          user: userResponse,
          token,
        },
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return sendError(res, 'Email and password are required', HTTP_STATUS.BAD_REQUEST);
      }

      // Find user and explicitly select password field
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return sendError(res, 'Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return sendError(res, 'Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
      }

      // Issue JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
      );

      // Return user without password
      const userResponse = user.toObject();
      delete userResponse.password;

      return sendSuccess(res, 'Login successful', {
        user: userResponse,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user
  static async getCurrentUser(req, res, next) {
    try {
      const user = await User.findById(req.user.userId);

      if (!user) {
        return sendError(res, 'User not found', HTTP_STATUS.NOT_FOUND);
      }

      return sendSuccess(res, 'User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
