import axios from 'axios';

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
  });
};

export const analyzeResumeWithAI = async (file: File): Promise<string> => {
  const base64Image = await convertFileToBase64(file);
  
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('API key not configured. Please check your environment variables.');
  }
  
  const requestData = {
    model: "google/gemini-flash-1.5",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "เขียนเรียงความความด่า resume ยาว 10-15 บรรทัด แบบหยาบคายๆ แบบตรงไปตรงมา ใช้คำพูดแบบเสียดสี เย้ยหยัน ชี้จุดด้อยไม่ต้องสุภาพ (กรุณาใช้ภาษาไทย+ด่าให้สุดๆ ไม่ต้องกลัวเสียความรู้สึก ด่าให้เหมือนตัวละคร Deadpool หรือ Deadpool 2 ที่พูดจาเสียดสีและตรงไปตรงมา)",
          },
          {
            type: "image_url",
            image_url: {
              url: base64Image
            }
          }
        ]
      }
    ],
    max_tokens: 2000,
    temperature: 0.7
  };
  
  const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', requestData, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Resume Roaster',
      'Content-Type': 'application/json'
    },
    timeout: 120000
  });

  if (response.data.choices?.[0]?.message?.content) {
    return response.data.choices[0].message.content;
  } else if (response.data.error) {
    throw new Error(`API Error: ${response.data.error.message || 'Unknown error'}`);
  } else {
    throw new Error('Unexpected response format');
  }
};
