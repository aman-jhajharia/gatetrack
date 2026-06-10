import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getSubjects: (_req: Request, res: Response) => Promise<void>;
export declare const createSubject: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateSubject: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteSubject: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=subjectController.d.ts.map