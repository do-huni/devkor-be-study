import { Request as Req } from 'express';
import { Types } from 'mongoose';

declare module 'express' {
  interface Request extends Req {
    user: {
      email?: string;
    };
  }
}
