import axios from 'axios';
import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import ResultModal from './components/ResultModal';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setResult('');
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB max
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Ensure proper base64 format for API
        resolve(result);
      };
      reader.onerror = reject;
    });
  };

  const analyzeResume = async () => {
    if (!file || !imagePreview) return;

    setLoading(true);
    setError('');

    try {
      const base64Image = await convertFileToBase64(file);
      
      const apiKey = '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';
      
      console.log('Sending request to OpenRouter API...');
      
      const requestData = {
        model: "google/gemini-flash-1.5",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "กรุณาวิเคราะห์ resume ในรูปภาพนี้แล้วให้คำวิจารณ์แบบหยาบคายๆ ด่ายาวๆ เป็นภาษาไทย ใช้คำพูดแบบเสียดสี เย้ยหยัน ชี้จุดด้อย และให้คำแนะนำปรับปรุงแบบตรงไปตรงมา ไม่ต้องสุภาพ"
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
        timeout: 120000 // Increased timeout to 2 minutes
      });

      console.log('API Response:', response.data);

      if (response.data.choices?.[0]?.message?.content) {
        setResult(response.data.choices[0].message.content);
        setShowModal(true);
      } else if (response.data.error) {
        console.error('API Error in response:', response.data.error);
        setError(`ข้อผิดพลาดจาก API: ${response.data.error.message || 'ไม่ทราบสาเหตุ'}`);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('ข้อผิดพลาด: ไม่สามารถรับผลลัพธ์จาก AI ได้ รูปแบบการตอบกลับไม่ถูกต้อง');
      }
    } catch (err: any) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('ข้อผิดพลาด: หมดเวลาการเชื่อมต่อ AI ใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง');
      } else if (err.response?.status === 401) {
        setError('ข้อผิดพลาด: API key ไม่ถูกต้องหรือหมดอายุ กรุณาตรวจสอบ API key ใหม่ที่ https://openrouter.ai/keys');
      } else if (err.response?.status === 403) {
        setError('ข้อผิดพลาด: API key ไม่มีสิทธิ์เข้าถึงหรือ credits หมด กรุณาตรวจสอบ account balance');
      } else if (err.response?.status === 413 || err.response?.data?.error?.message?.includes('size')) {
        setError('ข้อผิดพลาด: ไฟล์รูปภาพใหญ่เกินไป กรุณาลดขนาดไฟล์หรือบีบอัดรูปภาพ');
      } else if (err.response?.status === 429) {
        setError('ข้อผิดพลาด: ใช้งานเกินขีดจำกัด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง');
      } else if (err.response?.status === 400) {
        const errorMsg = err.response?.data?.error?.message || '';
        if (errorMsg.includes('image') || errorMsg.includes('format')) {
          setError('ข้อผิดพลาด: รูปภาพไม่ชัดเจนหรือรูปแบบไฟล์ไม่รองรับ กรุณาใช้รูป PNG/JPG ที่คมชัด');
        } else {
          setError(`ข้อผิดพลาดในการส่งข้อมูล: ${errorMsg || 'รูปแบบข้อมูลไม่ถูกต้อง'}`);
        }
      } else if (err.response?.status === 500) {
        setError('ข้อผิดพลาด: เซิร์ฟเวอร์ AI มีปัญหา กรุณาลองใหม่อีกครั้งใน 1-2 นาที');
      } else if (err.response?.status === 502 || err.response?.status === 503) {
        setError('ข้อผิดพลาด: บริการ AI ไม่พร้อมใช้งานชั่วคราว กรุณาลองใหม่อีกครั้ง');
      } else if (!navigator.onLine) {
        setError('ข้อผิดพลาด: ไม่มีการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบการเชื่อมต่อ');
      } else {
        const errorMessage = err.response?.data?.error?.message || err.message || 'ไม่ทราบสาเหตุ';
        setError(`ข้อผิดพลาดที่ไม่คาดคิด: ${errorMessage} (Status: ${err.response?.status || 'Unknown'})`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="text-center">
              <h2>🔥 Resume Roaster 🔥</h2>
              <p className="mb-0">เว็บรีวิว resume แบบหยาบคายๆ</p>
            </Card.Header>
            <Card.Body>
              <div 
                {...getRootProps()} 
                className={`border border-dashed rounded p-4 text-center mb-3 ${isDragActive ? 'border-primary bg-light' : 'border-secondary'}`}
                style={{ cursor: 'pointer' }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>วางไฟล์ตรงนี้...</p>
                ) : (
                  <div>
                    <p>ลากไฟล์รูปภาพ resume มาวางที่นี่</p>
                    <p className="text-muted">รองรับไฟล์: PNG, JPG, JPEG (ไม่เกิน 5MB)</p>
                  </div>
                )}
              </div>

              {file && imagePreview && (
                <Alert variant="info">
                  <strong>ไฟล์ที่เลือก:</strong> {file.name}
                  <div className="mt-3">
                    <img 
                      src={imagePreview} 
                      alt="Resume preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                </Alert>
              )}

              <div className="text-center">
                <Button 
                  variant="danger" 
                  size="lg"
                  onClick={analyzeResume}
                  disabled={!file || loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      กำลังวิเคราะห์...
                    </>
                  ) : (
                    '🚀 ด่ากันเลย!'
                  )}
                </Button>
              </div>

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}

              {result && (
                <div className="text-center mt-3">
                  <Button 
                    variant="success" 
                    onClick={() => setShowModal(true)}
                  >
                    🗯️ ดูผลการวิเคราะห์
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ResultModal 
        show={showModal}
        onHide={handleCloseModal}
        result={result}
      />
    </Container>
  );
}

export default App;