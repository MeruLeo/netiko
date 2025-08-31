import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  origions: {
    local: string;
    product: string;
  };
  clerk: {
    publishKey: string;
    secretKey: string;
  };
}

const config: Config = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.nodeEnv || 'development',
  mongodbUri: process.env.MONGODB_URI!,
  origions: {
    local: 'http://localhost:3000',
    product: 'https://google.com',
  },
  clerk: {
    publishKey: process.env.CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
  },
};

export default config;
