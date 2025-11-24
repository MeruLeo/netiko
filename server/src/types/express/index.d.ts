import 'express-serve-static-core';
import userModel from '#src/modules/user/user.model.js';

declare module 'express-serve-static-core' {
  interface Response {
    success: (data?: unknown, message?: string, statusCode?: number) => Response;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: userModel;
    }
  }
}
