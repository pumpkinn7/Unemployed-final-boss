import axios from 'axios';
import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import unemployedImage from './assets/1593574682.jfif';
import BackgroundAnimations from './components/BackgroundAnimations';
import FileUpload from './components/FileUpload';
import MusicPlayer from './components/MusicPlayer';
import ResultModal from './components/ResultModal';
import { convertFileToBase64 } from './services/resumeAnalyzer';
import './styles/animations.css';
import { handleApiError } from './utils/errorHandler';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult('');
    setError('');
  };

  const analyzeResume = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const base64Image = await convertFileToBase64(file);
      
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      
      if (!apiKey || apiKey === 'your_api_key_here') {
        // Show popup for API configuration issues
        alert('API Ai หมดอายุ 💩💩\n(ไม่มีงบทำเว็บขนาดนั้น ถ้าอยากให้ทำต่อ โดเนทด้วย👌🏻)');
        return;
      }
      
      const requestData = {
        model: "google/gemini-flash-1.5",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "เขียนเรียงความความด่า resume ยาว 10-15 บรรทัด แบบหยาบคายๆ แบบตรงไปตรงมา ใช้คำพูดแบบเสียดสี เย้ยหยัน ชี้จุดด้อยไม่ต้องสุภาพ (กรุณาใช้ภาษาไทย+ด่าให้สุดๆ แบบไม่ต้องเกรงใจใครนะครับ อยากให้ด่าแบบตรงไปตรงมาเลย ไม่ต้องกลัวเสียความรู้สึก ด่าให้เหมือนตัวละคร Deadpool หรือ Deadpool 2 ที่พูดจาเสียดสีและตรงไปตรงมา)",
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

      console.log('API Response:', response.data);

      if (response.data.choices?.[0]?.message?.content) {
        setResult(response.data.choices[0].message.content);
        setShowModal(true);
      } else if (response.data.error) {
        console.error('API Error in response:', response.data.error);
        alert('API Ai หมดอายุ 💩💩\n(ไม่มีงบทำเว็บขนาดนั้น ถ้าอยากให้ทำต่อ โดเนทด้วย👌🏻)');
      } else {
        console.error('Unexpected response format:', response.data);
        setError('ข้อผิดพลาด: ไม่สามารถรับผลลัพธ์จาก AI ได้ รูปแบบการตอบกลับไม่ถูกต้อง');
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      
      // Show popup for API errors, regular alert for other errors
      if (errorMessage === 'API_ERROR') {
        alert('API Ai หมดอายุ 💩💩\n(ไม่มีงบทำเว็บขนาดนั้น ถ้าอยากให้ทำต่อ โดเนทด้วย👌🏻)');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="main-background">
      <MusicPlayer />
      <BackgroundAnimations />

      <Container style={{ position: 'relative', zIndex: 3, opacity: 0.9 }}>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card style={{ backgroundColor: '#353e43', border: 'none' }}>
              <Card.Header className="text-center" style={{ backgroundColor: '#252525', borderBottom: '1px solid #D8D5DB' }}>
                <h3 style={{ color: '#D8D5DB' }}>Unemployed Final Boss🔥</h3>
                <p style={{ color: '#ADACB5', marginBottom: 0 }}>
                  🥺👉🏻👈🏻 Song for you <a href="https://www.youtube.com/watch?v=2dbR2JZmlWo&t=16s" target="_blank" rel="noopener noreferrer" style={{ color: '#FF5733' }}>Clickk</a>
                </p>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-4">
                  <img 
                    src={unemployedImage} 
                    alt="Unemployed"
                    style={{
                      maxWidth: '300px',
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </div>

                <FileUpload file={file} onFileSelect={handleFileSelect} />

                <div className="text-center">
                  <Button 
                    variant="outline-danger" 
                    size="lg"
                    onClick={analyzeResume}
                    disabled={!file || loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        กำลังวิเคราะห์...รอแป๊บ
                      </>
                    ) : (
                      '🚀 วิเคระห์!'
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
                      🗯️ ผลการวิเคราะห์
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
    </div>
  );
}

export default App;