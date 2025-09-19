/**
 * Date utility functions for consistent date handling across the application
 */

/**
 * Parse various date formats and return a valid Date object
 * @param {string} dateString - Date string in various formats
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    let date;
    
    // Handle DD/MM/YY HH:MM format (like "18/09/25 10:51")
    if (/^\d{2}\/\d{2}\/\d{2}\s+\d{2}:\d{2}$/.test(dateString)) {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      
      // Convert 2-digit year to 4-digit year (assuming 2000s)
      const fullYear = parseInt(year) + 2000;
      
      // Create date in correct format (YYYY, MM-1, DD, HH, MM)
      date = new Date(fullYear, parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    }
    // Handle DD/MM/YY format without time
    else if (/^\d{2}\/\d{2}\/\d{2}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      const fullYear = parseInt(year) + 2000;
      date = new Date(fullYear, parseInt(month) - 1, parseInt(day));
    }
    // Handle DD/MM/YYYY format
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    // Handle other formats (ISO, etc.)
    else {
      date = new Date(dateString);
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return null;
  }
};

/**
 * Format date as MM/DD/YY
 * @param {string|Date} input - Date string or Date object
 * @returns {string} - Formatted date string or 'N/A' if invalid
 */
export const formatDateToMMDDYY = (input) => {
  let date;
  
  if (typeof input === 'string') {
    date = parseDate(input);
  } else if (input instanceof Date) {
    date = input;
  } else {
    return 'N/A';
  }
  
  if (!date || isNaN(date.getTime())) {
    return 'N/A';
  }
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear() % 100).padStart(2, '0');
  
  return `${month}/${day}/${year}`;
};

/**
 * Format date as DD/MM/YYYY
 * @param {string|Date} input - Date string or Date object
 * @returns {string} - Formatted date string or 'N/A' if invalid
 */
export const formatDateToDDMMYYYY = (input) => {
  let date;
  
  if (typeof input === 'string') {
    date = parseDate(input);
  } else if (input instanceof Date) {
    date = input;
  } else {
    return 'N/A';
  }
  
  if (!date || isNaN(date.getTime())) {
    return 'N/A';
  }
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format date as a localized string
 * @param {string|Date} input - Date string or Date object
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} - Formatted date string or 'N/A' if invalid
 */
export const formatDateLocalized = (input, locale = 'en-US') => {
  let date;
  
  if (typeof input === 'string') {
    date = parseDate(input);
  } else if (input instanceof Date) {
    date = input;
  } else {
    return 'N/A';
  }
  
  if (!date || isNaN(date.getTime())) {
    return 'N/A';
  }
  
  return date.toLocaleDateString(locale);
};

/**
 * Check if a date string is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidDateString = (dateString) => {
  const date = parseDate(dateString);
  return date !== null && !isNaN(date.getTime());
};