import apiClient from './axiosInstance';

export const attendanceApi = {
  
  checkIn: async () => {
    const response = await apiClient.post('/attendance/checkin');
    return response.data;
  },

  checkOut: async () => {
    const response = await apiClient.post('/attendance/checkout');
    return response.data;
  },

  getTodayStatus: async () => {
    const response = await apiClient.get('/attendance/today');
    return response.data;
  },

  getMyHistory: async () => {
    const response = await apiClient.get('/attendance/my-history');
    return response.data;
  },

  getMySummary: async () => {
    const response = await apiClient.get('/attendance/my-summary');
    return response.data;
  },
  getAllRecords: async (filters) => {
    const response = await apiClient.get('/attendance/all', 
        {
            params: filters
        }
    );
    return response.data;
  },

 getTeamSummary: async () => {
    const response = await apiClient.get('/attendance/summary'); 
    return response.data;
  },

  exportReports: async () => {
    const response = await apiClient.get('/attendance/export', {
      responseType: 'blob',
    });
    return response.data;
  },

  getSingleEmployeeAttendance: async (userId) => {
    const response = await apiClient.get(`/attendance/employee/${userId}`);
    return response.data;
  },

  getTodayPresence: async () => {
    const response = await apiClient.get('/attendance/today-status');
    return response.data; 
  },

  exportAttendance: async () => {
    const response = await apiClient.get('/attendance/export', { 
      responseType: 'blob' 
    });
    return response.data;
    },
    getTodayStatus: async () => {
        const response = await apiClient.get('/attendance/today');
        return response.data;
    },
};