// Save data to sessionStorage
export const setSessionData = (key, value) => {
    try {
      const jsonData = JSON.stringify(value); 
      sessionStorage.setItem(key, jsonData);
    } catch (error) {
      console.error("Error saving to sessionStorage:", error);
    }
  };
  
  // Retrieve data from sessionStorage
  export const getSessionData = (key) => {
    try {
      const jsonData = sessionStorage.getItem(key); 
      return jsonData ? JSON.parse(jsonData) : null; 
    } catch (error) {
      console.error("Error retrieving from sessionStorage:", error);
      return null;
    }
  };
  
  // Remove data from sessionStorage
  export const removeSessionData = (key) => {
    try {
      sessionStorage.removeItem(key); 
    } catch (error) {
      console.error("Error removing from sessionStorage:", error);
    }
  };
  
  // Clear all data from sessionStorage
  export const clearSessionData = () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  };
  