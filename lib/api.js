import axios from 'axios';

const api = axios.create({
  baseURL: 'YOUR_BACKEND_URL',
  withCredentials: true, // این خیلی مهم است برای ارسال کوکی‌ها
});

// اینترسپتور پاسخ (Response Interceptor)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // اگر خطای ۴۰۱ بود و هنوز رفرش را تست نکرده بودیم
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // ۱. درخواست به بک‌اند برای گرفتن توکن جدید
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        
        // ۲. درخواست اصلی را دوباره بفرست
        return api(originalRequest);
      } catch (refreshError) {
        // ۳. اگر رفرش هم شکست خورد، یعنی واقعاً باید لاگین کند
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
