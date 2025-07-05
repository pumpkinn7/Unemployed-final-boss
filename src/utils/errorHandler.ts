export const handleApiError = (err: any): string => {
  console.error('Full error object:', err);
  
  // Log detailed API errors to console only
  if (err.response?.status === 401) {
    console.error('API Error: API key ไม่ถูกต้องหรือหมดอายุ กรุณาตรวจสอบ API key ใหม่ที่ https://openrouter.ai/keys');
    return 'API_ERROR'; // Special code for API errors
  } else if (err.response?.status === 403) {
    console.error('API Error: API key ไม่มีสิทธิ์เข้าถึงหรือ credits หมด กรุณาตรวจสอบ account balance');
    return 'API_ERROR';
  } else if (err.response?.status === 429) {
    console.error('API Error: ใช้งานเกินขีดจำกัด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง');
    return 'API_ERROR';
  } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
    return 'ข้อผิดพลาด: หมดเวลาการเชื่อมต่อ AI ใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง';
  } else if (err.response?.status === 413 || err.response?.data?.error?.message?.includes('size')) {
    return 'ข้อผิดพลาด: ไฟล์รูปภาพใหญ่เกินไป กรุณาลดขนาดไฟล์หรือบีบอัดรูปภาพ';
  } else if (err.response?.status === 400) {
    const errorMsg = err.response?.data?.error?.message || '';
    if (errorMsg.includes('image') || errorMsg.includes('format')) {
      return 'ข้อผิดพลาด: รูปภาพไม่ชัดเจนหรือรูปแบบไฟล์ไม่รองรับ กรุณาใช้รูป PNG/JPG ที่คมชัด';
    } else {
      return `ข้อผิดพลาดในการส่งข้อมูล: ${errorMsg || 'รูปแบบข้อมูลไม่ถูกต้อง'}`;
    }
  } else if (err.response?.status === 500) {
    return 'ข้อผิดพลาด: เซิร์ฟเวอร์ AI มีปัญหา กรุณาลองใหม่อีกครั้งใน 1-2 นาที';
  } else if (err.response?.status === 502 || err.response?.status === 503) {
    return 'ข้อผิดพลาด: บริการ AI ไม่พร้อมใช้งานชั่วคราว กรุณาลองใหม่อีกครั้ง';
  } else if (!navigator.onLine) {
    return 'ข้อผิดพลาด: ไม่มีการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อ';
  } else {
    const errorMessage = err.response?.data?.error?.message || err.message || 'ไม่ทราบสาเหตุ';
    return `ข้อผิดพลาดที่ไม่คาดคิด: ${errorMessage} (Status: ${err.response?.status || 'Unknown'})`;
  }
};
