import { Request, Response } from 'express';
import { z } from 'zod';

// Validation schema for diary emotion
const emotionEnum = z.enum(['good', 'normal', 'bad']);

// Validation schema for diary entries
const diarySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  emotion: emotionEnum,
  content: z.string()
});

// Validation schema for date parameter
const dateParamSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) // YYYY-MM-DD format
});

// This is a placeholder. In a real app, you would store data in a database.
interface DiaryEntry {
  userId: string;
  date: string;
  emotion: 'good' | 'normal' | 'bad';
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockDiaries: Record<string, DiaryEntry[]> = {
  'user1': [
    {
      userId: 'user1',
      date: '2025-04-25',
      emotion: 'good',
      content: 'Had a great day!',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

/**
 * Get all diaries for the current user
 */
export const getDiariesHandler = (req: Request, res: Response) => {
  try {
    // In a real app, you would get the userId from the JWT token
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Get diaries from our mock database
    const userDiaries = mockDiaries[userId] || [];
    
    // Optional: Filter by date range if query parameters are provided
    const { startDate, endDate } = req.query;
    let filteredDiaries = [...userDiaries];
    
    if (startDate && typeof startDate === 'string') {
      filteredDiaries = filteredDiaries.filter(diary => diary.date >= startDate);
    }
    
    if (endDate && typeof endDate === 'string') {
      filteredDiaries = filteredDiaries.filter(diary => diary.date <= endDate);
    }

    return res.status(200).json({
      success: true,
      data: filteredDiaries
    });
  } catch (error) {
    console.error('Get diaries error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get a diary by date
 */
export const getDiaryByDateHandler = (req: Request, res: Response) => {
  try {
    // Validate date parameter
    const { date } = dateParamSchema.parse(req.params);
    
    // In a real app, you would get the userId from the JWT token
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Find the diary in our mock database
    const userDiaries = mockDiaries[userId] || [];
    const diary = userDiaries.find(d => d.date === date);
    
    if (!diary) {
      return res.status(404).json({
        success: false,
        message: 'Diary not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: diary
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    console.error('Get diary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create a new diary
 */
export const createDiaryHandler = (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = diarySchema.parse(req.body);
    
    // In a real app, you would get the userId from the JWT token
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Check if a diary already exists for this date
    const userDiaries = mockDiaries[userId] || [];
    const existingDiary = userDiaries.find(d => d.date === validatedData.date);
    
    if (existingDiary) {
      return res.status(409).json({
        success: false,
        message: 'A diary already exists for this date'
      });
    }

    // Create a new diary entry
    const newDiary: DiaryEntry = {
      userId,
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to our mock database
    if (!mockDiaries[userId]) {
      mockDiaries[userId] = [];
    }
    mockDiaries[userId].push(newDiary);

    return res.status(201).json({
      success: true,
      data: newDiary
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    console.error('Create diary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update an existing diary
 */
export const updateDiaryHandler = (req: Request, res: Response) => {
  try {
    // Validate date parameter
    const { date } = dateParamSchema.parse(req.params);
    
    // Validate request body
    const validatedData = diarySchema.parse({
      date,
      ...req.body
    });
    
    // In a real app, you would get the userId from the JWT token
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Find the diary in our mock database
    const userDiaries = mockDiaries[userId] || [];
    const diaryIndex = userDiaries.findIndex(d => d.date === date);
    
    if (diaryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Diary not found'
      });
    }

    // Update the diary
    const updatedDiary: DiaryEntry = {
      ...userDiaries[diaryIndex],
      emotion: validatedData.emotion,
      content: validatedData.content,
      updatedAt: new Date()
    };

    // Update our mock database
    mockDiaries[userId][diaryIndex] = updatedDiary;

    return res.status(200).json({
      success: true,
      data: updatedDiary
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    console.error('Update diary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
