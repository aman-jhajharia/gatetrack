import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
export interface AuthRequest extends Request {
    user?: IUser;
}
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const adminOnly: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const generateToken: (userId: string) => string;
export declare const generateRefreshToken: (userId: string) => string;
//# sourceMappingURL=auth.d.ts.map