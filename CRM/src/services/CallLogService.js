import axios from "axios";

// DateTime = [year, month, day, hour, minute]

/**
 * @param {Date} date
 * @returns {number[]} DateTime
 */
export const dateToDateTime = (date) => {
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
};

/**
 * @param {number[]} dateTime
 * @returns {Date}
 */
export const dateTimeToDate = (dateTime) => {
  if (!Array.isArray(dateTime) || dateTime.length < 3) {
    console.error("Invalid DateTime format:", dateTime);
    return new Date();
  }

  const [year, month, day, hour = 0, minute = 0] = dateTime;
  return new Date(year, month - 1, day, hour, minute);
};

/**
 * @param {number[] | string | Date} dateTime
 * @returns {string}
 */
export const formatDateTime = (dateTime) => {
  try {
    let date;

    if (Array.isArray(dateTime)) {
      date = dateTimeToDate(dateTime);
    } else if (dateTime instanceof Date) {
      date = dateTime;
    } else if (typeof dateTime === "string") {
      date = new Date(dateTime);
    } else {
      return "Invalid date format";
    }

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleString();
  } catch (err) {
    console.error("Error formatting date:", err);
    return "Error formatting date";
  }
};

/**
 * @returns {number[]} DateTime
 */
export const getCurrentDateTime = () => {
  return dateToDateTime(new Date());
};

/**
 * @param {string} dateString
 * @returns {number[]} DateTime
 */
export const dateStringToDateTime = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error("Invalid date string:", dateString);
    return getCurrentDateTime();
  }
  return dateToDateTime(date);
};

const BASE_URL = "http://localhost:8080/api/call-logs";

const CallLogService = {
  // Get all call logs
  getAllCallLogs: async () => {
    try {
      console.log("Fetching all call logs");
      const response = await axios.get(BASE_URL);
      console.log("Call logs response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all call logs:", error);
      return [];
    }
  },

  // Get call logs by customer ID
  getCallLogsByCustomerId: async (customerId) => {
    if (!customerId) {
      console.error("Customer ID is required");
      return [];
    }

    try {
      console.log(`Fetching call logs for customer ID: ${customerId}`);
      const response = await axios.get(`${BASE_URL}/customer/${customerId}`);
      console.log("Customer call logs response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching call logs for customer ID ${customerId}:`,
        error
      );
      return [];
    }
  },

  // Get call logs by customer email
  getCallLogsByCustomerEmail: async (email) => {
    if (!email) {
      console.error("Customer email is required");
      return [];
    }

    try {
      console.log(`Fetching call logs for customer email: ${email}`);
      const response = await axios.get(
        `${BASE_URL}/customer/email/${encodeURIComponent(email)}`
      );
      console.log("Customer call logs by email response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching call logs for customer email ${email}:`,
        error
      );
      return [];
    }
  },

  // Get call logs by customer name
  getCallLogsByCustomerName: async (customerName) => {
    if (!customerName) {
      console.error("Customer name is required");
      return [];
    }

    try {
      console.log("Fetching all call logs to filter by customer name");
      const response = await axios.get(BASE_URL);
      const allLogs = response.data;

      const filteredLogs = allLogs.filter(
        (log) =>
          log.customerName &&
          log.customerName.toLowerCase() === customerName.toLowerCase()
      );

      console.log(
        `Found ${filteredLogs.length} logs for customer name: ${customerName}`
      );
      return filteredLogs;
    } catch (error) {
      console.error(
        `Error fetching call logs for customer name ${customerName}:`,
        error
      );
      return [];
    }
  },

  // Create a call log
  createCallLog: async (callLog) => {
    try {
      console.log("Creating call log:", callLog);

      if (typeof callLog.dateTime === "string") {
        const date = new Date(callLog.dateTime);
        callLog = {
          ...callLog,
          dateTime: dateToDateTime(date),
        };
      }

      const response = await axios.post(BASE_URL, callLog);
      console.log("Created call log response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating call log:", error);
      throw error;
    }
  },

  // Update a call log
  updateCallLog: async (id, callLog) => {
    try {
      console.log(`Updating call log ID ${id}:`, callLog);

      if (typeof callLog.dateTime === "string") {
        const date = new Date(callLog.dateTime);
        callLog = {
          ...callLog,
          dateTime: dateToDateTime(date),
        };
      }

      const response = await axios.put(`${BASE_URL}/${id}`, callLog);
      console.log("Updated call log response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating call log ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a call log
  deleteCallLog: async (id) => {
    try {
      console.log(`Deleting call log ID: ${id}`);
      await axios.delete(`${BASE_URL}/${id}`);
      console.log(`Call log ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting call log ID ${id}:`, error);
      throw error;
    }
  },
};

export default CallLogService;
