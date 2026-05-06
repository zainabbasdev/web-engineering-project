import { HTTP_STATUS } from '../constants/enums.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation Error',
      errors: messages,
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Mongoose Cast Error
  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // Default error
  return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
