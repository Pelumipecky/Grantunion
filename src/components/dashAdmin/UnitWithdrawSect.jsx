import React, { useState } from 'react';
import { supabaseDb } from "../../database/supabaseUtils";
import { supabase } from "../../database/supabaseConfig";
import Modal from "../Modal";

const UnitWithdrawSect = ({ setProfileState, withdrawData }) => {
    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: '',
        title: '',
        message: '',
        onConfirm: null
    });
    const [copiedField, setCopiedField] = useState(null);

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const showModal = (type, title, message, onConfirm = null) => {
        setModalConfig({
            isOpen: true,
            type,
            title,
            message,
            onConfirm
        });
    };

    const handleCopyToClipboard = async (text, fieldName) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const notificationPush = {
        message: `Your $${withdrawData?.amount} withdrawal transaction has been confirmed. $${withdrawData?.amount} is on its way to your wallet address now`,
        idnum: withdrawData.idnum,
        status: "unseen"
    };

    const handleActiveInvestment = async () => {
        try {
            const response = await fetch('/api/withdrawals/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    withdrawalId: withdrawData?.id,
                    withdrawal: withdrawData
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to approve withdrawal');
            }

            const result = await response.json();
            
            // Send email notification to user
            try {
                // Get user email from userlogs table
                const { data: userData, error: userError } = await supabase
                    .from('userlogs')
                    .select('email, name')
                    .eq('idnum', withdrawData.idnum)
                    .single();

                if (!userError && userData?.email) {
                    const emailSubject = 'Withdrawal Confirmed - Grant Union Investment';
                    const emailMessage = `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #28a745;">💰 Withdrawal Confirmed!</h2>
                        <p>Dear ${userData.name || 'User'},</p>
                        <p>Great news! Your withdrawal request has been processed and confirmed.</p>
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                          <h3 style="margin-top: 0;">Withdrawal Details:</h3>
                          <ul style="list-style: none; padding: 0;">
                            <li><strong>Amount:</strong> $${withdrawData?.amount}</li>
                            <li><strong>Fee:</strong> $${withdrawData?.withdrawal_fee || '0.00'}</li>
                            <li><strong>Payment Method:</strong> ${withdrawData?.paymentoption || withdrawData?.paymentOption || 'N/A'}</li>
                            <li><strong>Wallet Address:</strong> ${withdrawData?.wallet_address}</li>
                          </ul>
                        </div>
                        <p>Your funds are now being processed and will be sent to your wallet shortly. Processing times may vary depending on the payment method.</p>
                        <p>If you have any questions, please contact our support team.</p>
                        <p>Best regards,<br>Grant Union Investment Team</p>
                        <hr>
                        <p style="font-size: 12px; color: #666;">
                          This is an automated message. Please do not reply to this email.
                        </p>
                      </div>
                    `;

                    const emailResponse = await fetch('/api/send-email', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        to: userData.email,
                        subject: emailSubject,
                        message: emailMessage,
                        type: 'withdrawal_confirmation'
                      })
                    });

                    if (emailResponse.ok) {
                      console.log('Withdrawal confirmation email sent successfully');
                    } else {
                      console.error('Failed to send withdrawal confirmation email');
                    }
                }
            } catch (emailError) {
                console.error('Error sending withdrawal confirmation email:', emailError);
                // Don't throw here - email failure shouldn't block withdrawal confirmation
            }

            showModal('success', 'Success', 'Withdrawal confirmed successfully');
            setTimeout(() => {
                setProfileState("Withdrawals");
            }, 1500);
        } catch (error) {
            console.error("Error confirming withdrawal:", error);
            showModal('error', 'Error', error.message || 'Failed to confirm withdrawal');
        }
    };

    const handleRejectWithdrawal = async () => {
        try {
            const response = await fetch('/api/withdrawals/reject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    withdrawalId: withdrawData?.id,
                    withdrawal: withdrawData
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to reject withdrawal');
            }

            const result = await response.json();

            showModal('success', 'Success', 'Withdrawal rejected and amount refunded');
            setTimeout(() => {
                setProfileState("Withdrawals");
            }, 1500);
        } catch (error) {
            console.error("Error rejecting withdrawal:", error);
            showModal('error', 'Error', error.message || 'Failed to reject withdrawal');
        }
    };


  return (
    <div className="profileMainCntn">
      <style>{`
        .unitInputField {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .unitInputField input {
          padding: 10px;
          border: 1px solid var(--text-deco);
          border-radius: 4px;
          background-color: var(--input-bg);
          color: var(--text-clr1);
        }

        .unitInputField label {
          font-weight: 600;
          color: var(--text-clr1);
        }

        @media (max-width: 768px) {
          .unitInputField {
            gap: 6px;
          }

          .unitInputField input,
          button {
            font-size: 14px;
          }

          .theFormField {
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .unitInputField label {
            font-size: 0.95em;
          }

          .unitInputField input {
            font-size: 14px;
            padding: 8px;
          }

          button {
            padding: 6px 10px !important;
            font-size: 0.85em !important;
          }

          .flex-align-jusc {
            flex-wrap: wrap;
            gap: 8px;
          }

          .activateBtn,
          button[type="button"] {
            flex: 1;
            min-width: 120px;
          }
        }
      `}</style>
      <div className="profileEditableDisplay">
          <h2>Withdrawal Details</h2>
          <div className="theFormField">
            <div className="unitInputField">
              <label htmlFor="name">Amount</label>
              <input type="text" disabled value={withdrawData?.amount} />
            </div>
            <div className="unitInputField">
              <label htmlFor="name">Withdrawal Fee</label>
              <input type="text" disabled value={withdrawData?.withdrawal_fee || '$0.00'} />
            </div>
            <div className="unitInputField">
              <label htmlFor="name">Withdrawal Status</label>
              <input type="text" disabled value={withdrawData?.status} />
            </div>
            <div className="unitInputField">
              <label htmlFor="name">Investment Cryptic Id.</label>
              <input type="text" disabled value={withdrawData?.id} />
            </div>
            <div className="unitInputField">
              <label htmlFor="name">Investment Register Id.</label>
              <input type="text" disabled value={withdrawData?.idnum} />
            </div>
            <div className="unitInputField">
              <label htmlFor="name">Payment Option</label>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <input 
                  type="text" 
                  disabled 
                  value={withdrawData?.paymentoption || withdrawData?.paymentOption || 'N/A'}
                  style={{flex: 1}}
                />
                <button
                  onClick={() => handleCopyToClipboard(withdrawData?.paymentoption || withdrawData?.paymentOption || 'N/A', 'paymentOption')}
                  title="Copy payment option"
                  style={{
                    background: copiedField === 'paymentOption' ? '#28a745' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s'
                  }}
                >
                  {copiedField === 'paymentOption' ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>
            {(withdrawData?.paymentoption === 'Bank Transfer' || withdrawData?.paymentOption === 'Bank Transfer') ? (
              <>
                <div className="unitInputField">
                  <label htmlFor="name">Bank Name</label>
                  <input type="text" disabled value={withdrawData?.bank_name || withdrawData?.bankName || 'N/A'} />
                </div>
                <div className="unitInputField">
                  <label htmlFor="name">Account Number</label>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <input 
                      type="text" 
                      disabled 
                      value={withdrawData?.account_number || withdrawData?.bankAccountNumber || 'N/A'} 
                      style={{flex: 1}}
                    />
                    <button
                      onClick={() => handleCopyToClipboard(withdrawData?.account_number || withdrawData?.bankAccountNumber || 'N/A', 'accNum')}
                      title="Copy Account Number"
                      style={{
                        background: copiedField === 'accNum' ? '#28a745' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '0.9em',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.3s'
                      }}
                    >
                      {copiedField === 'accNum' ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                </div>
                <div className="unitInputField">
                  <label htmlFor="name">Account Name</label>
                  <input type="text" disabled value={withdrawData?.account_name || withdrawData?.bankAccountName || 'N/A'} />
                </div>
                {(withdrawData?.routing_number || withdrawData?.bankRoutingSwift) && (
                  <div className="unitInputField">
                    <label htmlFor="name">Routing/Swift</label>
                    <input type="text" disabled value={withdrawData?.routing_number || withdrawData?.bankRoutingSwift} />
                  </div>
                )}
              </>
            ) : (
                <div className="unitInputField">
                  <label htmlFor="name">Wallet Address</label>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <input 
                      type="text" 
                      disabled 
                      value={withdrawData?.wallet_address || 'N/A'}
                      title={withdrawData?.wallet_address}
                      style={{flex: 1, wordBreak: 'break-all'}}
                    />
                    <button
                      onClick={() => handleCopyToClipboard(withdrawData?.wallet_address || 'N/A', 'walletAddress')}
                      title="Copy wallet address"
                      style={{
                        background: copiedField === 'walletAddress' ? '#28a745' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '0.9em',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.3s'
                      }}
                    >
                      {copiedField === 'walletAddress' ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                </div>
            )}
            <div className="unitInputField">
              <label htmlFor="name">Date</label>
              <input type="text" disabled value={(() => {
                const d = new Date(withdrawData?.created_at || withdrawData?.date || 0);
                return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString("en-US", {day: "numeric", month: "short", year: "numeric"});
              })()} />
            </div>
            <div className="unitInputField">
              <label htmlFor="name">Time</label>
              <input type="text" disabled value={(() => {
                const d = new Date(withdrawData?.created_at || withdrawData?.date || 0);
                return isNaN(d.getTime()) ? 'Invalid Time' : new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, }).format(d);
              })()} />
            </div>
            
          </div>

            <div className="flex-align-jusc">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                    {(withdrawData?.status === "Pending" || withdrawData?.status === "pending") ? (
                        <>
                            <button 
                                type="button" 
                                onClick={() => showModal('confirm', 'Confirm Withdrawal', 
                                    `Are you sure you want to confirm this withdrawal of $${withdrawData?.amount}?`,
                                    handleActiveInvestment
                                )} 
                                style={{
                                    padding: '12px 28px',
                                    background: 'linear-gradient(135deg, #2DC194, #1fb086)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(45, 193, 148, 0.3)',
                                    minWidth: '150px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(45, 193, 148, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(45, 193, 148, 0.3)';
                                }}
                            >
                                ✓ Confirm
                            </button>
                            <button 
                                type="button" 
                                onClick={() => showModal('confirm', 'Reject Withdrawal', 
                                    `Are you sure you want to reject this withdrawal of $${withdrawData?.amount}? The amount will be refunded to the user's account.`,
                                    handleRejectWithdrawal
                                )} 
                                style={{
                                    padding: '12px 28px',
                                    background: 'linear-gradient(135deg, #DC1262, #a80d4a)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(220, 18, 98, 0.3)',
                                    minWidth: '150px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(220, 18, 98, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(220, 18, 98, 0.3)';
                                }}
                            >
                                ✕ Reject
                            </button>
                        </>
                    ) : (
                        <p style={{color: 'var(--text-clr1)', marginTop: '10px'}}>Status: <strong>{withdrawData?.status}</strong> - Buttons only available for Pending withdrawals</p>
                    )}
                </div>
            </div>
        </div>

    {/* Modal Component */}
    <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
    >
        {modalConfig.type === 'confirm' ? (
            <div>
                <p style={{color: 'var(--text-clr1)', marginBottom: '20px'}}>{modalConfig.message}</p>
                <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                    <button
                        onClick={closeModal}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '25px',
                            border: '1px solid var(--text-deco)',
                            background: 'transparent',
                            color: 'var(--text-clr1)',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={modalConfig.onConfirm}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '25px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #FFB347, #FF7A18)',
                            color: '#1C0F36',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        ) : (
            <div>
                <p style={{color: 'var(--text-clr1)', marginBottom: '20px'}}>{modalConfig.message}</p>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <button 
                        onClick={closeModal} 
                        style={{
                            padding: '10px 24px',
                            borderRadius: '25px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #FFB347, #FF7A18)',
                            color: '#1C0F36',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        )}
    </Modal>
    </div>
  )
}

export default UnitWithdrawSect
