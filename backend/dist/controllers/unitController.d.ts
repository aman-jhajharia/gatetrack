import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getUnits: (req: Request, res: Response) => Promise<void>;
export declare const createUnit: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUnit: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteUnit: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=unitController.d.ts.map