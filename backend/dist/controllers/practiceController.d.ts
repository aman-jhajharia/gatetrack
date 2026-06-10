import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getPracticeUnits: (req: Request, res: Response) => Promise<void>;
export declare const createPracticeUnit: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updatePracticeUnit: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deletePracticeUnit: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=practiceController.d.ts.map