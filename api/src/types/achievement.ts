export interface Achievement {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  date?: Date;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}
