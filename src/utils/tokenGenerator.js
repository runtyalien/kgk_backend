import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const generateAccessToken = () => {
  return randomBytes(32).toString('hex');
};

export const generateUniqueResourceId = () => {
  return uuidv4();
};