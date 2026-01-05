import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabaseDb, supabase } from "../../database/supabaseUtils";
import { createWithdrawal } from "../../utils/transactionManager";
import styles from "./WithdrawPayment.module.css";
import Modal from "../Modal";

const WithdrawalPayment = ({setProfileState, withdrawData, bitPrice, ethPrice, currentUser}) => {
    const router = useRouter();
    const [copystate, setCopystate] = useState("Copy");
    const [walletAddress, setWalletAddress] = useState(""); // New state for wallet address
    // const [error, setError] = useState(""); // Replaced by Modal
    const [isVerifying, setIsVerifying] = useState(false);
    
    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: '', // 'confirm', 'success', 'error'
        title: '',
        message: '',
    });

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const showModal = (type, title, message) => {
        setModalConfig({
            isOpen: true,
            type,
            title,
            message
        });
    };

    // Debug prices on mount
    useEffect(() => {
        // Removed console.log for security
    }, [bitPrice, ethPrice]);

    const removeErr = () => {
        setTimeout(() => {
            setCopystate("Copy");
        }, 2500);
    }

    // countdown timer (in seconds) for making payment; default 15 minutes
    const DEFAULT_COUNTDOWN = 15 * 60;
    const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);
    const countdownRef = useRef(null);
    // const [showPopup, setShowPopup] = useState(false); // Replaced by Modal
    // const [successMessage, setSuccessMessage] = useState(""); // Replaced by Modal
    // const [failureMessage, setFailureMessage] = useState(""); // Replaced by Modal
    const [selectedCodeDoc, setSelectedCodeDoc] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const isUserKycVerified = ((currentUser?.kyc_status) || '').toLowerCase() === 'verified';

    useEffect(() => {
        // start countdown when component mounts
        countdownRef.current = setInterval(() => {
            setCountdown((c) => {
                if (c <= 1) {
                    clearInterval(countdownRef.current);
                    return 0;
                }
                return c - 1;
            });
        }, 1000);

        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = Math.floor(secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
          .then(() => {
            setCopystate("Copied");
            removeErr();
          })
          .catch((err) => {
            console.error('Unable to copy text to clipboard', err);
          });
    }

    const handleTransacConfirmation = async () => {
        // Check if user data is properly loaded
        if (!currentUser?.idnum || !currentUser?.id || currentUser.idnum === 101010) {
            console.error('Invalid user data:', {
                idnum: currentUser?.idnum,
                id: currentUser?.id,
                fullUser: currentUser
            });
            showModal('error', 'Error', "User data not loaded properly. Please refresh the page and try again.");
            return;
        }

        // Check KYC status before proceeding
        if (!isUserKycVerified) {
            showModal('error', 'KYC Required', "KYC verification required. Please complete KYC verification before making a withdrawal.");
            return;
        }

        if (countdown === 0) {
            showModal('error', 'Error', "Payment window expired. Please initiate a new withdrawal.");
            return;
        }

        // Validate wallet address for crypto payments
        if (withdrawData?.paymentOption !== 'Bank Transfer' && !walletAddress.trim()) {
            showModal('error', 'Error', 'Please enter your wallet address before confirming');
            return;
        }

        showModal('confirm', 'Confirm Withdrawal', '');
    }

    const handleFinalConfirm = async () => {
        // Check KYC status before processing withdrawal
        if (!isUserKycVerified) {
            showModal('error', 'KYC Required', "KYC verification required. Please complete KYC before withdrawing.");
            setIsProcessing(false);
            return;
        }

        // Check if user data is properly loaded
        console.log('🔍 Checking user data for withdrawal:', {
            currentUser,
            idnum: currentUser?.idnum,
            id: currentUser?.id,
            balance: currentUser?.balance
        });
        if (!currentUser?.idnum || !currentUser?.id || currentUser.idnum === 101010) {
            console.error('❌ Invalid user data for withdrawal:', {
                idnum: currentUser?.idnum,
                id: currentUser?.id,
                fullUser: currentUser
            });
            showModal('error', 'Error', "User data not loaded properly. Please refresh the page and try again.");
            setIsProcessing(false);
            return;
        }

        setIsProcessing(true);

        try {
            const amount = withdrawData?.amount ?? withdrawData?.capital ?? 0;

            // Enforce minimum withdrawal amount at finalization as well
            if (Number.parseFloat(amount) < 200) {
                showModal('error', 'Error', 'Minimum withdrawal amount is $200');
                setIsProcessing(false);
                return;
            }

            // Check if user has sufficient balance
            const currentBalance = parseFloat(currentUser?.balance || 0);
            if (currentBalance < parseFloat(amount)) {
                showModal('error', 'Insufficient Balance', `You have insufficient balance. Available: $${currentBalance}, Required: $${amount}`);
                setIsProcessing(false);
                return;
            }

            // Validate wallet address for crypto payments
            if (withdrawData?.paymentOption !== 'Bank Transfer' && !walletAddress.trim()) {
                showModal('error', 'Error', 'Please enter your wallet address');
                setIsProcessing(false);
                return;
            }

            console.log('Creating withdrawal with data:', {
                amount,
                wallet_address: walletAddress,
                paymentoption: withdrawData?.paymentOption,
                idnum: currentUser?.idnum,
                status: "pending"
            });

            // Create withdrawal record
            const parsedIdnum = parseInt(currentUser?.idnum, 10);
            const withdrawalData = {
                amount: parseFloat(amount), // Ensure it's a number
                wallet_address: walletAddress,
                paymentoption: withdrawData?.paymentOption,
                idnum: parsedIdnum, // Ensure it's a number
                status: "pending" // Use lowercase to match database default
            };

            // Validate withdrawal data before sending
            if (!withdrawalData.idnum || isNaN(withdrawalData.idnum) || withdrawalData.idnum === 101010) {
                console.error('Invalid idnum for withdrawal:', withdrawalData.idnum, 'original:', currentUser?.idnum);
                showModal('error', 'Error', 'Invalid user account. Please log out and log back in.');
                setIsProcessing(false);
                return;
            }

            if (!withdrawalData.amount || withdrawalData.amount < 200) {
                console.error('Invalid amount for withdrawal:', withdrawalData.amount);
                showModal('error', 'Error', 'Invalid withdrawal amount.');
                setIsProcessing(false);
                return;
            }

            const { error: withdrawalError } = await createWithdrawal(withdrawalData);
            if (withdrawalError) {
                console.error('❌ Withdrawal creation error:', withdrawalError);
                console.error('❌ Withdrawal data that failed:', withdrawalData);
                console.error('❌ Full error details:', JSON.stringify(withdrawalError, null, 2));
                throw new Error(`Withdrawal creation failed: ${withdrawalError.message || JSON.stringify(withdrawalError)}`);
            }

            console.log('✅ Withdrawal created successfully');

            console.log('Withdrawal created successfully');

            // Deduct amount from user's available balance (non-blocking)
            try {
                const currentBalance = parseFloat(currentUser?.balance || 0);
                console.log('Current balance:', currentBalance, 'Withdrawal amount:', amount);
                
                const newBalance = Math.max(0, currentBalance - parseFloat(amount));
                console.log('New balance will be:', newBalance);
                
                if (currentUser?.id) {
                    const { error: balanceError } = await supabaseDb.updateUser(currentUser.id, { 
                        balance: newBalance,
                        updated_at: new Date().toISOString()
                    });
                    
                    if (balanceError) {
                        console.warn("Could not update user balance:", balanceError);
                    } else {
                        console.log('Balance updated successfully');
                        // Update sessionStorage to reflect new balance immediately
                        try {
                            const activeUser = JSON.parse(sessionStorage.getItem('activeUser') || '{}');
                            activeUser.balance = newBalance;
                            sessionStorage.setItem('activeUser', JSON.stringify(activeUser));
                        } catch (storageErr) {
                            console.warn('Could not update sessionStorage:', storageErr);
                        }
                    }
                } else {
                    console.warn('No user ID available for balance update');
                }
            } catch (balanceErr) {
                console.warn("Could not update user balance:", balanceErr);
                // Don't fail the withdrawal if balance update fails
            }

            showModal('success', 'Success', "Withdrawal request submitted successfully.");

            // small delay so user can see success message before routing
            setTimeout(() => {
                setProfileState("Withdrawals");
            }, 2000);
        } catch (err) {
            console.error("Finalizing withdrawal failed:", err);
            
            // Extract error message for user-friendly display
            let errorMessage = "Could not complete withdrawal. Please try again later.";
            
            if (err?.message) {
              errorMessage = err.message;
            } else if (typeof err === 'string') {
              errorMessage = err;
            }
            
            showModal('error', 'Error', errorMessage);
        } finally {
            setIsProcessing(false);
        }
    }
  const displayAmount = withdrawData?.amount ?? withdrawData?.capital ?? 0;
  
  // Calculate crypto amounts based on current market price
  const calculateCryptoAmount = (amount, price, crypto) => {
    const numAmount = parseFloat(amount);
    const numPrice = parseFloat(price);
    
    if (!numAmount || !numPrice || numPrice === 0) {
      return '0.00000000';
    }
    
    // Calculate the crypto amount: withdrawal amount / current price
    const cryptoAmount = numAmount / numPrice;
    return cryptoAmount.toFixed(8); // Show up to 8 decimal places for precision
  };

  return (
    <div className={styles.paymentContainer}>
        <h2 className={styles.title}>Confirm Payment</h2>

        {/* KYC Status Warning */}
        {!isUserKycVerified && (
            <div className={styles.kycWarning}>
                <div className={styles.kycWarningContent}>
                    <i className={`icofont-warning ${styles.kycWarningIcon}`}></i>
                    <div>
                        <strong style={{ color: 'var(--danger-clr)', display: 'block', marginBottom: '0.3rem' }}>
                            KYC Verification Required
                        </strong>
                        <span className={styles.kycWarningText}>
                            You must complete KYC verification before you can withdraw funds.
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/kyc')}
                    className={styles.kycButton}
                >
                    Click here to complete your KYC
                </button>
            </div>
        )}
        
        {/* KYC Verified Message */}
        {isUserKycVerified && (
            <div className={styles.kycSuccess}>
                <div className={styles.kycSuccessIcon}>
                    <i className="icofont-check"></i>
                </div>
                <div className={styles.kycSuccessContent}>
                    <h3>
                        ✅ KYC Verified
                    </h3>
                    <p>
                        Your identity has been verified. You can proceed with your withdrawal.
                    </p>
                </div>
            </div>
        )}

        <div className={styles.paymentDetails}>
            {withdrawData?.paymentOption !== 'Bank Transfer' ? (
                <>
                    <h3>Enter your {withdrawData?.paymentOption} Wallet Address</h3>
                    <div className={styles.inputGroup} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '1rem' }}>
                        <input 
                            type="text" 
                            placeholder={`Paste your ${withdrawData?.paymentOption} address here`}
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.2)',
                                color: '#fff',
                                outline: 'none'
                            }}
                        />
                        <button 
                            type="button"
                            title="Scan QR Code"
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #FFB347',
                                background: 'rgba(255, 179, 71, 0.1)',
                                color: '#FFB347',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => showModal('info', 'Coming Soon', 'QR Code Scanner feature coming soon!')}
                        >
                            <i className="icofont-qr-code" style={{ fontSize: '1.2rem' }}></i>
                        </button>
                    </div>
                    <p className={styles.infoText} style={{ marginTop: '0.5rem' }}>
                        Please ensure the address is correct. We are not responsible for funds sent to the wrong address.
                    </p>
                </>
            ) : (
                <>
                    <h3>Bank Transfer Details</h3>
                    <p><strong>Bank:</strong> {withdrawData?.bankName}</p>
                    <p><strong>Account Number:</strong> {withdrawData?.bankAccountNumber}</p>
                    <p><strong>Account Holder:</strong> {withdrawData?.bankAccountName}</p>
                    {withdrawData?.bankRoutingSwift && <p><strong>Routing/Swift Code:</strong> {withdrawData?.bankRoutingSwift}</p>}
                </>
            )}
        </div>

        <p className={styles.infoText}>Confirm the transaction after the specified amount has been transferred while we complete the transaction process.</p>
        <p className={styles.infoText}>The completion of the transaction process might take between couple minutes to several hours. You can check for the status of your withdrawals in the Withdrawal section of your User-Account-Display-Interface.</p>

        <div className={styles.paymentMeta}>
            <p>Payment window: <strong>{formatTime(countdown)}</strong></p>
            <p>Withdrawal amount: <strong>${Number(displayAmount).toLocaleString()}</strong></p>
        </div>

        <div className={styles.actionButtons}>
            <button 
                className={styles.confirmBtn} 
                onClick={handleTransacConfirmation}
                disabled={isProcessing}
                style={{
                    background: '#003459',
                    color: 'white',
                    padding: '14px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                }}
            >
                {isProcessing ? 'Processing...' : 'Confirm Withdrawal'}
            </button>
            <button 
                className={styles.cancelBtn} 
                onClick={() => setProfileState("Withdrawals")}
                disabled={isProcessing}
                style={{
                    background: 'transparent',
                    color: '#fff',
                    padding: '14px 24px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginLeft: '10px'
                }}
            >
                Cancel
            </button>
        </div>

        <Modal
            isOpen={modalConfig.isOpen}
            onClose={closeModal}
            title={modalConfig.title}
        >
            {modalConfig.type === 'confirm' ? (
                <div>
                    <p>Payment type: <strong>{withdrawData?.paymentOption}</strong></p>
                    <p>Amount: <strong>${Number(displayAmount).toLocaleString()}</strong></p>
                    {withdrawData?.paymentOption === 'Bank Transfer' && (
                        <p style={{fontSize: '0.9rem', marginTop: 12}}>
                            <strong>Bank:</strong> {withdrawData?.bankName}<br/>
                            <strong>Account:</strong> {withdrawData?.bankAccountNumber}<br/>
                            <strong>Holder:</strong> {withdrawData?.bankAccountName}
                        </p>
                    )}
                    <p>Withdrawal Code: <strong>N/A</strong></p>
                    <div className={styles.modalActions}>
                        <button type="button" onClick={closeModal} disabled={isProcessing} className={styles.modalCancelBtn}>Cancel</button>
                        <button type="button" onClick={handleFinalConfirm} disabled={isProcessing} className={styles.modalConfirmBtn}>{isProcessing ? 'Processing...' : 'Confirm Transaction'}</button>
                    </div>
                </div>
            ) : (
                <div>
                    <p>{modalConfig.message}</p>
                    <div className={styles.modalActions}>
                        <button onClick={closeModal} className={styles.modalConfirmBtn}>OK</button>
                    </div>
                </div>
            )}
        </Modal>
    </div>
  )
}

export default WithdrawalPayment



{/* <p>{withdrawData?.paymentOption === "Bitcoin" ? "bc1q4d5rfgeuq0su78agvermq3fpqtxjczlzhnttty" : "0x1D2C71bF833Df554A86Ad142f861bc12f3B24c1c"} <span onClick={() => {copyToClipboard(`${withdrawData?.paymentOption === "Bitcoin" ? "bc1q4d5rfgeuq0su78agvermq3fpqtxjczlzhnttty" : "0x1D2C71bF833Df554A86Ad142f861bc12f3B24c1c"}`)}}>{copystate} <i class="icofont-ui-copy"></i></span></p> */}