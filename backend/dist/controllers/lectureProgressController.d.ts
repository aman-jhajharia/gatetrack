import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getLectureProgress: (req: AuthRequest, res: Response) => Promise<void>;
export declare const upsertLectureProgress: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProgressSummary: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=lectureProgressController.d.ts.map