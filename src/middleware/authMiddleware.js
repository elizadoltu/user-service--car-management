import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const publicKey = process.env.PUBLIC_KEY_PATH.replace(/\\n/g, '\n');

const getErrorMessage = (error) => {
    const messages = {
        'TokenExpiredError': 'Token expired',
        'JsonWebTokenError': 'Invalid token',
        'NotBeforeError': 'Token not active'
    };
    return messages[error.name] || 'Authorization failed';
};

const getErrorCode = (error) => {
    const codes = {
        'TokenExpiredError': 'token_expired',
        'JsonWebTokenError': 'invalid_token',
        'NotBeforeError': 'token_inactive'
    };
    return codes[error.name] || 'authentication_failed';
};

export const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid authorization format' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
        });

        if (!decoded.sub || !decoded.role) {
            return res.status(401).json({ message: 'Malformed token' });
        }

        req.user = {
            id: decoded.sub,
            username: decoded.username,
            role: decoded.role
        };

        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;
        const message = {
            TokenExpiredError: 'Token expired',
            JsonWebTokenError: 'Invalid token',
            NotBeforeError: 'Token not active'
        }[error.name] || 'Authentication failed';
        
        res.status(statusCode).json({ message });
    }
};

export const authorizeadmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};