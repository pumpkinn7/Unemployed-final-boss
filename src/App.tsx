import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import unemployedImage from './assets/1593574682.jfif';
import backgroundMusic from './assets/music/backgroundMusic.mp3';
import BackgroundAnimations from './components/BackgroundAnimations';
import DonateModal from './components/DonateModal';
import FileUpload from './components/FileUpload';
import ResultModal from './components/ResultModal';
import { convertFileToBase64 } from './services/resumeAnalyzer';
import './styles/animations.css';
import './styles/App.css';
import { handleApiError } from './utils/errorHandler';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio when component mounts
  useEffect(() => {
    audioRef.current = new Audio(backgroundMusic);
    audioRef.current.loop = true; // Loop the music
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      if (!isMuted) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Unemployed Final Boss',
          text: 'Check out this Resume Roasting app!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      const url = window.location.href;
      navigator.clipboard.writeText(url)
        .then(() => alert('Link copied to clipboard! Share it with your friends.'))
        .catch(() => alert('Failed to copy link.'));
    }
  };

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
                text: "วิเคราะห์ resume หาจุดด้อยแล้วด่าให้ยับเหมือนหมาแม่ลูกอ่อนโดนรถ 10 ล้อเหยียบ เขียนมาเป็นเรียงความยาวๆ แต่ย่อหน้าเดียว ไม่เว้นวรรค ด่าให้เป็นธรรมชาติ เช่น สวัสดีครับ(💩)  Resume มึงนี่มันเหมือนเอาขี้มาปั้นเป็นรูปคน  ไม่แปลกใจทำไมมึงเขาไม่เอามึง  Project ก็ง่อยสัสๆ  Skill ก็เขียนมาแบบครึ่งๆ กลางๆ ครั้งหน้าลองไปเขียนเรียงความบอกรักแม่ก่อนไป เรียนมากี่ปีวะทำไมได้แค่นี้ นี่มึงเอา resume นี่ไปสมัครงานได้จริงดิ? กูเหลือจะเชื่อจริงๆ  ขอโทษด้วยนะครับ แต่ขออนุญาตแนบอิโมจินี้ให้มึงเลยละกัน 🖕😂 และถ้าวิเคราะห์แล้วไม่ใช่รูป Resume ให้เขียนว่า นี่มึงปัญญาอ่อนมั้ยนิ ให้เอา Resume มาไอ้กรากกกกกกกกก อ่านภาษาไทยออกมั้ย หรือมุดเข้าช่องคลอดมารดาแล้วรอเรียน ป.1 ใหม่ ขอโทษนะครับที่หยาบคาย ครากก ถุ้ย (ตามด้วยด่าเพิ่มอีกสัก 5 ประโยค)",
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
      <BackgroundAnimations />
      
      {/* Top left links */}
      <div className="top-left-links">
        <a href="https://github.com/pumpkinn7/Unemployed-final-boss" target="_blank" rel="noopener noreferrer" className="top-link">
          <i className="bi bi-github"></i> GitHub
        </a>
        <button 
          className="top-link"
          onClick={() => setShowDonateModal(true)}
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <i className="bi bi-cup-hot"></i> Donate
        </button>
      </div>
      
      {/* Top right controls */}
      <div className="top-right-controls">
        <button 
          className="control-button" 
          title={isMuted ? "เปิดเสียงเพลง" : "ปิดเสียงเพลง"} 
          onClick={toggleSound}
        >
          <i className={`bi ${isMuted ? "bi-volume-mute" : "bi-volume-up"}`}></i>
        </button>
        <button 
          className="control-button" 
          title="แชร์" 
          onClick={handleShare}
        >
          <i className="bi bi-share"></i>
        </button>
      </div>

      <Container className="app-container">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="app-card">
              <Card.Header className="text-center app-card-header">
                <h5 className="app-card-title">🔥Unemployed Final Boss🔥</h5>
                <p className="app-card-subtitle">
                  🥺👉🏻👈🏻 Song for you <a href="https://www.youtube.com/watch?v=2dbR2JZmlWo&t=16s" target="_blank" rel="noopener noreferrer">Clickk</a>
                </p>
              </Card.Header>
              <Card.Body className="app-card-body">
                <div className="text-center mb-4">
                  <img 
                    src={unemployedImage} 
                    alt="Unemployed"
                    className="unemployed-image"
                  />
                </div>

                <FileUpload file={file} onFileSelect={handleFileSelect} />

                <div className="text-center">
                  {!result ? (
                    <Button 
                      variant="outline-danger" 
                      size="lg"
                      onClick={analyzeResume}
                      disabled={!file || loading}
                      className={`analyze-button ${loading ? 'loading' : ''}`}
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
                  ) : (
                    <Button 
                      variant="outline-info" 
                      onClick={() => setShowModal(true)}
                      className="result-button"
                    >
                      🗯️ ผลการวิเคราะห์
                    </Button>
                  )}
                </div>

                {error && (
                  <Alert variant="danger" className="mt-3 error-alert">
                    {error}
                  </Alert>
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
        <DonateModal 
          show={showDonateModal}
          onHide={() => setShowDonateModal(false)}
        />
      </Container>
    </div>
  );
}

export default App;