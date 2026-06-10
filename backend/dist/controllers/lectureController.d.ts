import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getLectures: (req: Request, res: Response) => Promise<void>;
export declare const createLecture: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateLecture: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteLecture: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=lectureController.d.ts.map