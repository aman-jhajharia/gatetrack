import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getRevision: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllRevisions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const upsertRevision: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=revisionController.d.ts.map