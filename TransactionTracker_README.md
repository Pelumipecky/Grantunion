# Fake Blockchain Transaction Tracker

A React component that simulates blockchain-style transaction tracking with realistic confirmations, animations, and modern UI design.

## Features

- ✅ **Realistic Transaction IDs**: Generates 0x-prefixed 64-character hexadecimal IDs
- ✅ **Dynamic Status Updates**: Pending → Confirmed with smooth animations
- ✅ **Modern UI**: CSS Modules with gradient backgrounds and glassmorphism effects
- ✅ **Copy Functionality**: One-click copy of transaction IDs to clipboard
- ✅ **Blockchain Explorer**: Dummy explorer links for presentation
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Animated Loaders**: Spinning indicators and checkmark animations

## Files Created

1. `src/components/TransactionTracker.jsx` - Main React component
2. `src/components/TransactionTracker.module.css` - CSS Modules styles
3. `src/pages/transaction-demo.jsx` - Demo page showcasing the component
4. `src/styles/demo.module.css` - Demo page styles
5. `TransactionTracker_Integration_Example.js` - Integration guide

## Usage

### Basic Usage

```jsx
import TransactionTracker from '../components/TransactionTracker';

// Auto-generate transaction ID
<TransactionTracker initialStatus="pending" />

// Use custom transaction ID
<TransactionTracker
  transactionId="0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  initialStatus="confirmed"
/>
```

### Props

- `transactionId` (string, optional): Custom transaction ID. If not provided, one will be auto-generated
- `initialStatus` (string, optional): Initial status - "pending" or "confirmed". Default: "pending"

### Integration Example

```jsx
import { useState } from 'react';
import TransactionTracker from '../components/TransactionTracker';

const MyComponent = () => {
  const [showTracker, setShowTracker] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleTransaction = () => {
    // Generate or receive transaction ID
    const newTxId = generateTransactionId();
    setTransactionId(newTxId);
    setShowTracker(true);
  };

  return (
    <div>
      <button onClick={handleTransaction}>Start Transaction</button>

      {showTracker && (
        <TransactionTracker
          transactionId={transactionId}
          initialStatus="pending"
        />
      )}
    </div>
  );
};
```

## Demo

Visit `/transaction-demo` in your application to see the component in action.

## Styling

The component uses CSS Modules with:
- Gradient backgrounds
- Glassmorphism effects
- Smooth animations
- Responsive breakpoints
- Color-coded status indicators (orange for pending, green for confirmed)

## Technical Details

- **Transaction ID Generation**: Creates realistic 0x-prefixed 64-character hex strings
- **Status Simulation**: 3-second delay for pending → confirmed transition
- **Animations**: CSS keyframes for loaders and status changes
- **Clipboard API**: Modern navigator.clipboard for copying
- **Responsive**: Mobile-first design with breakpoints

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Clipboard API (fallback available for older browsers)
- CSS Modules (requires build tool support)

## Customization

Modify `TransactionTracker.module.css` to customize:
- Colors and gradients
- Animation timings
- Layout and spacing
- Typography

## Security Note

This is a **presentation-only component** for demo purposes. It does not interact with real blockchains or perform actual transactions.