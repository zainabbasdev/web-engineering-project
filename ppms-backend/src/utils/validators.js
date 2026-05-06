// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate CNIC format (12345-1234567-1)
export const isValidCNIC = (cnic) => {
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
  return cnicRegex.test(cnic);
};

// Validate positive number
export const isValidPositiveNumber = (num) => {
  return !isNaN(num) && Number(num) >= 0;
};

// Validate date
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

export default {
  isValidEmail,
  isValidCNIC,
  isValidPositiveNumber,
  isValidDate,
};
