import express from 'express';
import { 
  getDiariesHandler, 
  getDiaryByDateHandler, 
  createDiaryHandler, 
  updateDiaryHandler 
} from '../controllers/diary.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Apply auth middleware to all diary routes
router.use(authMiddleware);

// Diary routes
router.get('/', getDiariesHandler);
router.get('/:date', getDiaryByDateHandler);
router.post('/', createDiaryHandler);
router.put('/:date', updateDiaryHandler);

export { router as diaryRoutes };
