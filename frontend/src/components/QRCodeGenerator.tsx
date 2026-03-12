import React from 'react';

interface QRCodeGeneratorProps {
  data: string;
  size?: number;
  className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ data, size = 200, className = '' }) => {
  // Simple QR code generator using a basic pattern
  // In a real application, you would use a proper QR code library like qrcode.js
  
  const generateQRPattern = (text: string) => {
    // This is a simplified QR-like pattern generator
    // For production, use a proper QR code library
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    canvas.width = size;
    canvas.height = size;
    
    // Create a simple pattern based on the text
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Generate a pattern
    const cellSize = 8;
    const cells = Math.floor(size / cellSize);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#000000';
    
    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        const shouldFill = (i * cells + j + hash) % 3 === 0;
        if (shouldFill) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // Add corner markers (simplified)
    const markerSize = cellSize * 3;
    ctx.fillRect(0, 0, markerSize, markerSize);
    ctx.fillRect(size - markerSize, 0, markerSize, markerSize);
    ctx.fillRect(0, size - markerSize, markerSize, markerSize);
    
    return canvas.toDataURL();
  };

  const qrDataURL = generateQRPattern(data);

  return (
    <div className={`inline-block ${className}`}>
      <img 
        src={qrDataURL} 
        alt="QR Code" 
        width={size} 
        height={size}
        className="border rounded"
      />
    </div>
  );
};

export default QRCodeGenerator;


