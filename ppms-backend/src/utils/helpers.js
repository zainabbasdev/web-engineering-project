// Calculate pagination metadata
export const getPaginationParams = (query, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, parseInt(query.limit) || defaultLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Format pagination response
export const formatPaginatedResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Safe async handler for routes
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Delay for testing (use with caution)
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  getPaginationParams,
  formatPaginatedResponse,
  asyncHandler,
  delay,
};
