// Standard API Response Format
export const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Success Response Helpers
export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

// Error Response Helpers
export const sendError = (res, message, statusCode = 400) => {
  return sendResponse(res, statusCode, false, message);
};

export default { sendResponse, sendSuccess, sendError };
