import { Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Validation schema for login
const loginSchema = z.object({
  userId: z.string().min(3),
  password: z.string().min(8)
});

// This is just a placeholder. In a real app, you would fetch the user from a database.
const mockUsers = {
  'user1': {
    userId: 'user1',
    // In a real app, this would be a hashed password
    password: 'password123'
  }
};

/**
 * Handle user login
 */
export const loginHandler = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);
    const { userId, password } = validatedData;

    // In a real app, you would fetch the user from a database
    // and compare passwords securely
    const user = mockUsers[userId];
    
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token (you would need jsonwebtoken package)
    // This is a placeholder. In a real app, you would use a secret from environment variables.
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Set token as HTTP Only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Handle user logout
 */
export const logoutHandler = (req: Request, res: Response) => {
  // Clear the JWT cookie
  res.clearCookie('token');
  
  return res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};
