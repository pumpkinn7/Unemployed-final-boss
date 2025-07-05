import { Button, Modal } from 'react-bootstrap';

interface ResultModalProps {
  show: boolean;
  onHide: () => void;
  result: string;
}

function ResultModal({ show, onHide, result }: ResultModalProps) {
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-light text-dark">
        <Modal.Title>
          <h5 className="mb-0">💀เหตุผลที่ทำให้ไม่มีงานทำ</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div style={{ whiteSpace: 'pre-wrap', fontSize: '16px', lineHeight: '1.6' }}>
          {result}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          ปิด
        </Button>
        <Button 
          variant="white" 
          style={{ border: '1px solid black' }}
          onClick={() => {
            navigator.clipboard.writeText(result);
            alert('ไม่ให้ลอก! 😜');
          }}
        >
          คัดลอก
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResultModal;
