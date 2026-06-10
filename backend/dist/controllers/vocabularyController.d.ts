import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getVocabulary: (_req: Request, res: Response) => Promise<void>;
export declare const createVocabulary: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateVocabulary: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteVocabulary: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getVocabularyProgress: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateWordProgress: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=vocabularyController.d.ts.map