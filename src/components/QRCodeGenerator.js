// src/QRCodeGenerator.jsx
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';

const QRCodeGenerator = () => {
  const [transactionId, setTransactionId] = useState('');
  const [showQR, setShowQR] = useState(false);

  const generateTransactionQR = () => {
    const uniqueTxnId = `TXN-${uuidv4()}`; // e.g., TXN-9f4f81a1-d3ab-4c3a-b3c2-28fc79c4c8d1
    setTransactionId(uniqueTxnId);
    setShowQR(true);
  };

  return (
    <div style={{ textAlign: 'center'}}>
      <button onClick={generateTransactionQR} style={{ padding: '10px 20px' }}>
        Generate Transaction QR
      </button>

      {showQR && (
        <div style={{ marginTop: '10px' }}>
          <p>Transaction ID: <strong>{transactionId}</strong></p>
          <QRCodeCanvas value={transactionId} size={200} />
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
