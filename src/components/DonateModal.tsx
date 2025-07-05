import { Modal } from 'react-bootstrap';
import donateImage from '../assets/45442422424.png';

interface DonateModalProps {
  show: boolean;
  onHide: () => void;
}
const DonateModal = ({ show, onHide }: DonateModalProps) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>i'm broke give me money</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img 
          src={donateImage} 
          alt="Donate QR Code" 
          style={{ maxWidth: '100%', height: 'auto' }} 
        />
        <p className="mt-3">ขอขอบคุณ สำหรับค่ากาแฟ (และเบียร์)</p>
      </Modal.Body>
    </Modal>
  );
};

export default DonateModal;
