import React, { useState } from 'react';
import TransactionTracker from '../components/TransactionTracker';
import styles from '../styles/demo.module.css';

const TransactionDemo = () => {
  const [showTracker, setShowTracker] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const startNewTransaction = () => {
    // Generate a new transaction ID
    const hexChars = '0123456789abcdef';
    let id = '0x';
    for (let i = 0; i < 64; i++) {
      id += hexChars[Math.floor(Math.random() * hexChars.length)];
    }
    setTransactionId(id);
    setShowTracker(true);
  };

  const resetDemo = () => {
    setShowTracker(false);
    setTransactionId('');
  };

  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoHeader}>
        <h1>Blockchain Transaction Tracker Demo</h1>
        <p>Experience simulated blockchain transaction tracking with realistic confirmations.</p>
      </div>

      {!showTracker ? (
        <div className={styles.demoActions}>
          <button
            className={styles.startButton}
            onClick={startNewTransaction}
          >
            🚀 Start New Transaction
          </button>
          <p className={styles.instructions}>
            Click the button above to simulate a blockchain transaction and watch it get confirmed!
          </p>
        </div>
      ) : (
        <div className={styles.trackerContainer}>
          <TransactionTracker
            transactionId={transactionId}
            initialStatus="pending"
          />
          <div className={styles.demoActions}>
            <button
              className={styles.resetButton}
              onClick={resetDemo}
            >
              🔄 Try Another Transaction
            </button>
          </div>
        </div>
      )}

      <div className={styles.features}>
        <h2>Features Demonstrated:</h2>
        <ul>
          <li>✅ Realistic blockchain-style transaction IDs (0x + 64 hex chars)</li>
          <li>✅ Dynamic status changes: Pending → Confirmed</li>
          <li>✅ Animated loading indicators</li>
          <li>✅ Copy-to-clipboard functionality</li>
          <li>✅ Blockchain explorer integration (dummy URL)</li>
          <li>✅ Modern CSS Modules styling</li>
          <li>✅ Responsive design</li>
        </ul>
      </div>
    </div>
  );
};

export default TransactionDemo;