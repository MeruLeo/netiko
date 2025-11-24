import { Response, Request, NextFunction } from 'express';
import { logger } from '#src/middlewares/logger.js';

export class SuccessResponse {
  statusCode: number;
  message: string;
  data?: unknown;

  constructor(data: unknown = null, message = 'عملیات با موفقیت انجام شد', statusCode = 200) {
    this.statusCode = statusCode;
    this.message = message;
    if (data !== null) this.data = data;
  }
}

export const successHandler = (_req: Request, res: Response, next: NextFunction) => {
  res.success = (data?: unknown, message = 'The operation was successful.', statusCode = 200) => {
    const response = new SuccessResponse(data, message, statusCode);

    if (process.env.NODE_ENV === 'development') {
      logger.info(`✅ [${statusCode}] ${message}`);
    }

    return res.status(statusCode).json(response);
  };

  next();
};
