import jwt from 'jsonwebtoken';

export const authenticateToken = (token) => {
  if (!token) {
    throw new Error('Access token required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const getTokenFromHeaders = (headers) => {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  
  return null;
};
