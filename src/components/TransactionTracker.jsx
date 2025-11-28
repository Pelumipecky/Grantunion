import React, { useState, useEffect } from 'react';
import styles from './TransactionTracker.module.css';

const TransactionTracker = ({ transactionId: propTransactionId, initialStatus = 'pending' }) => {
  const [transactionId, setTransactionId] = useState(propTransactionId || '');
  const [status, setStatus] = useState(initialStatus);
  const [timestamp, setTimestamp] = useState(new Date());
  const [network] = useState('Ethereum TestNet');
  const [isLoading, setIsLoading] = useState(initialStatus === 'pending');
  const [copied, setCopied] = useState(false);

  // Generate a fake blockchain-style transaction ID
  const generateTransactionId = () => {
    const hexChars = '0123456789abcdef';
    let id = '0x';
    for (let i = 0; i < 64; i++) {
      id += hexChars[Math.floor(Math.random() * hexChars.length)];
    }
    return id;
  };

  // Initialize transaction ID if not provided
  useEffect(() => {
    if (!transactionId) {
      const newId = generateTransactionId();
      setTransactionId(newId);
      setTimestamp(new Date());
    }
  }, []);

  // Simulate blockchain confirmation
  useEffect(() => {
    if (status === 'pending') {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setStatus('confirmed');
      }, 3000); // 3 seconds for demo

      return () => clearTimeout(timer);
    }
  }, [status]);

  // Copy transaction ID to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Open dummy blockchain explorer
  const viewOnExplorer = () => {
    const explorerUrl = `https://blockchain.example.com/tx/${transactionId}`;
    window.open(explorerUrl, '_blank');
  };

  const formatTimestamp = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className={styles.transactionTracker}>
      <div className={styles.header}>
        <h3>Transaction Tracker</h3>
        <div className={styles.networkBadge}>
          {network}
        </div>
      </div>

      <div className={styles.transactionCard}>
        <div className={styles.transactionId}>
          <span className={styles.label}>Transaction ID:</span>
          <div className={styles.idContainer}>
            <code className={styles.txId}>{transactionId}</code>
            <button
              className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
              onClick={copyToClipboard}
              title="Copy Transaction ID"
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
        </div>

        <div className={styles.transactionDetails}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Status:</span>
            <div className={styles.statusContainer}>
              {isLoading && <div className={styles.loader}></div>}
              <span className={`${styles.status} ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Timestamp:</span>
            <span className={styles.timestamp}>
              {formatTimestamp(timestamp)}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Network:</span>
            <span className={styles.network}>
              {network}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.explorerButton}
            onClick={viewOnExplorer}
            disabled={status === 'pending'}
          >
            View on Blockchain Explorer
          </button>
        </div>
      </div>

      {status === 'pending' && (
        <div className={styles.pendingMessage}>
          <div className={styles.pendingLoader}></div>
          <p>Transaction is being processed on the blockchain...</p>
        </div>
      )}

      {status === 'confirmed' && (
        <div className={styles.confirmedMessage}>
          <div className={styles.checkmark}>✓</div>
          <p>Transaction confirmed on the blockchain!</p>
        </div>
      )}
    </div>
  );
};

export default TransactionTracker;