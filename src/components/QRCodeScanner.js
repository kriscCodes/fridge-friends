// src/QRCodeScanner.jsx
import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';


const QRCodeScanner = () => {
  const [scannedData, setScannedData] = useState('');
  const [isValid, setIsValid] = useState(null);

  const handleScan = (data) => {
    if (data && data[0]) {
      const result = data[0].rawValue;
      setScannedData(result);

      // Example validation logic
      if (result.startsWith('TXN-')) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  };

  const handleError = (error) => {
    console.error('Scanner error:', error);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2>Scan QR Code</h2>
      <div style={{ width: '300px', margin: '0 auto' }}>
        <Scanner
          onScan={handleScan}
          onError={handleError}
          constraints={{ facingMode: 'environment' }}
        />
      </div>

      {scannedData && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>Scanned Transaction ID:</strong></p>
          <p>{scannedData}</p>
          {isValid === true && <p style={{ color: 'green' }}>✅ Valid transaction</p>}
          {isValid === false && <p style={{ color: 'red' }}>❌ Invalid code</p>}
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;