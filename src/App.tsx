import axios from 'axios';
import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const analyzeResume = async () => {
    if (!file || !imagePreview) return;

    setLoading(true);
    setError('');

    try {
      const base64Image = await convertFileToBase64(file);
      
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
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
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': 'Bearer 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',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Resume Roaster',
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });

      if (response.data.choices?.[0]?.message?.content) {
        setResult(response.data.choices[0].message.content);
      } else {
        setError('ไม่สามารถรับผลลัพธ์จาก AI ได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err: any) {
      console.error('API Error:', err.response?.data);
      
      if (err.response?.status === 413 || err.response?.data?.error?.message?.includes('size')) {
        setError('ข้อผิดพลาด: ไฟล์ใหญ่เกินไป กรุณาลดขนาดไฟล์');
      } else if (err.response?.status === 429) {
        setError('ข้อผิดพลาด: ใช้งานเกินขีดจำกัด กรุณารอสักครู่แล้วลองใหม่');
      } else {
        setError('ข้อผิดพลาด: ไม่สามารถวิเคราะห์ได้ กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
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
                <Card className="mt-4">
                  <Card.Header>
                    <h5>🗯️ ผลการวิเคราะห์</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {result}
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;