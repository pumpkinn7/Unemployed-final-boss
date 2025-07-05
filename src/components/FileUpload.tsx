import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, onFileSelect }) => {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border border-dashed rounded p-4 text-center mb-3 ${isDragActive ? 'border-primary bg-light' : 'border-secondary'}`}
      style={{ cursor: 'pointer' }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p style={{ color: '#D8D5DB' }}>วางไฟล์ตรงนี้...</p>
      ) : file ? (
        <div>
          <p style={{ color: '#D8D5DB', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {file.name}
          </p>
        </div>
      ) : (
        <div>
          <p style={{ color: '#D8D5DB' }}>ลากไฟล์รูปภาพ resume มาวางที่นี่</p>
          <p style={{ color: '#ADACB5' }}>PNG, JPG, JPEG (🤬ขอไม่เกิน 5MB โอเค??? ไม่มีงบมาทำเยอะขนาดนั้น)</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
