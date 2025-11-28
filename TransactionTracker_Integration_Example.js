// Example integration of TransactionTracker in your dashboard
// Add this import at the top of your dashboard component:
import TransactionTracker from '../components/TransactionTracker';

// Add this state for managing transaction tracking:
const [currentTransactionId, setCurrentTransactionId] = useState('');
const [showTransactionTracker, setShowTransactionTracker] = useState(false);

// Add this function to start tracking a transaction:
const startTransactionTracking = (transactionId) => {
  setCurrentTransactionId(transactionId);
  setShowTransactionTracker(true);
};

// In your JSX, add the TransactionTracker component where you want it to appear:
// (For example, in a modal, sidebar, or main content area)

{showTransactionTracker && (
  <div className={styles.transactionModal}>
    <div className={styles.modalOverlay} onClick={() => setShowTransactionTracker(false)}></div>
    <div className={styles.modalContent}>
      <button
        className={styles.closeButton}
        onClick={() => setShowTransactionTracker(false)}
      >
        ×
      </button>
      <TransactionTracker
        transactionId={currentTransactionId}
        initialStatus="pending"
      />
    </div>
  </div>
)}

// Example usage in your investment or payment functions:
// When a user makes an investment or withdrawal, call:
startTransactionTracking(generatedTransactionId);

// You can also use it without passing a transactionId for auto-generation:
<TransactionTracker initialStatus="pending" />

// CSS for the modal (add to your existing CSS module):
.transactionModal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modalOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
}

.modalContent {
  position: relative;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
}

.closeButton {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: white;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
}

.closeButton:hover {
  background: rgba(255, 255, 255, 0.3);
}