import { Request, Response, NextFunction } from 'express';
import mongoose, { model } from 'mongoose';
import { UserModel } from '../models/User';

interface OwnershipOptions {
  model: mongoose.Model<any>;
  ownerField: string;
  paramId?: string;
}

export const checkOwnership =
  ({ model, ownerField, paramId = 'id' }: OwnershipOptions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resourceId = req.params[paramId];
      const clerkUser = (req as any).auth().userId;

      const user = await UserModel.findOne({ clerkId: clerkUser });

      if (!resourceId || !user) {
        console.log(resourceId);
        console.log(user);
        return res.status(400).json({ message: 'Invalid request' });
      }

      const resource = await model.findById(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      if (
        resource[ownerField].toString() !== user._id.toString() &&
        user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
