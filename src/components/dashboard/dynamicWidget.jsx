import {useEffect, useState} from "react";
import { supabaseDb, supabaseRealtime } from "../../database/supabaseUtils";
import { useRouter } from 'next/router';
import { PLAN_CONFIG, getPlanByName, formatPercent } from "../../utils/planConfig";


const DynamicWidget = ({widgetState, setWidgetState, currentUser, setCurrentUser, investData, setInvestData, setProfileState, withdrawData, setWithdrawData, totalBonus, totalCapital, totaROI}) => {
    const [investments, setInvestments] = useState([]);
    const [error, setError] = useState(""); // Add error state

    const router = useRouter();
    const handlewidgetClose = () => {
        setWidgetState({...widgetState, state: false});
        setError(""); // Clear error on close
    };

    const handleProceed = (e) => {
        e.preventDefault();
        handlewidgetClose();
        setProfileState("Payments");
    };

    const handleProceedWithdraw = (e) => {
        e.preventDefault();
        handlewidgetClose();
        setProfileState("Withdrawal Payment");
    };

    useEffect(() => {
        let channel = null;

        if (currentUser?.idnum) {
            try {
                channel = supabaseRealtime.subscribeToInvestments(currentUser.idnum,
                    (payload) => {
                        // Refresh investments data when there's a change
                        supabaseDb.getInvestmentsByIdnum(currentUser.idnum).then(({ data, error }) => {
                            if (!error && data) {
                                setInvestments(data);
                            }
                        });
                    }
                );
            } catch (error) {
                console.error("Error setting up investment listener:", error);
            }
        }

        // Cleanup subscription on unmount
        return () => {
            if (channel && typeof channel.unsubscribe === 'function') {
                channel.unsubscribe();
            }
        };
    }, [currentUser?.idnum]);

    const handleAccoutDelete = async () => {
        if (!currentUser?.id) {
            console.error('No user ID found for deletion');
            return;
        }

        try {
            await supabaseDb.deleteUser(currentUser.id);
            router.push("/signup");
        } catch (error) {
            console.error("Error deleting account:", error);
            // You might want to show an error message to the user here
        }
    }

    const selectedPlan = getPlanByName(investData?.plan);

    const handlePlanChange = (value) => {
        const plan = getPlanByName(value);
        setInvestData((prev) => ({
            ...prev,
            plan: plan.name,
            duration: plan.durationDays,
            capital: Math.max(plan.minCapital, Number(prev?.capital) || 0)
        }));
    };

    return (
        <div className="absoluteDynamicWidget">
            {
                widgetState.type === "avatar" && (
                    <div className="avatarSection">
                        <span type="button" onClick={handlewidgetClose}><i className="icofont-close-line"></i></span>
                        <h2>Select Avatar</h2>
                        <div className="avatars">
                            <button className="unitAvatar" onClick={() => {setCurrentUser({...currentUser, avatar: "avatar_1"})}}><span></span></button>
                            <button className="unitAvatar" onClick={() => {setCurrentUser({...currentUser, avatar: "avatar_2"})}}><span></span></button>
                        </div>
                        <button type="button" onClick={handlewidgetClose}>Select</button>
                    </div>

                )
            } 
            {
                widgetState.type === "invest" && (
                    <div className="avatarSection investwidgetSection">
                        <span type="button" onClick={handlewidgetClose}><i className="icofont-close-line"></i></span>
                        <h2>Initiate Investment</h2>
                        <p>You are about to invest in the <span>{selectedPlan?.name}</span> package which takes a period of <span>{selectedPlan?.durationLabel}</span></p>
                        <div className="investMinmax">
                            Minimum deposit ${selectedPlan?.minCapital.toLocaleString()} | {formatPercent(selectedPlan?.dailyRate || 0)} daily | Withdraw after {selectedPlan?.durationLabel}
                        </div>
                        <form className='widgetInvestForm' onSubmit={handleProceed}>
                            <div className="unitInputField">
                                <label htmlFor="name">Amount to Invest</label>
                                <input type="text" required value={investData?.capital} onChange={(e) => {setInvestData({...investData, capital: parseInt(e.target.value !== ""? e.target.value : "0")})}}/>
                            </div>
                            <div className="unitInputField">
                                <label htmlFor="name">Investment Plan</label>
                                <select required value={investData?.plan} onChange={(e) => handlePlanChange(e.target.value)}>
                                    {PLAN_CONFIG.map((plan) => (
                                        <option key={plan.id} value={plan.name}>{plan.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="unitInputField">
                                <label htmlFor="name">Payment Option</label>
                                <select required value={investData?.paymentOption} onChange={(e) => {setInvestData({...investData, paymentOption: e.target.value})}}>
                                    <option value="Bitcoin">Bitcoin</option>
                                    <option value="Ethereum">Ethereum</option>
                                    <option value="USDT">USDT</option>
                                </select>
                            </div>
                            <div className="bottomBtnCntn">
                                <button type="submit">Proceed</button>
                                <button type='button' onClick={handlewidgetClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )
            }
            {
                widgetState.type === "withdraw-code" && (
                    <div className="avatarSection investwidgetSection" style={{maxWidth: '500px', width: '90%'}}>
                        <span type="button" onClick={handlewidgetClose} style={{cursor: 'pointer'}}><i className="icofont-close-line"></i></span>
                        <h2 style={{marginBottom: '8px', fontSize: '1.5rem'}}>Enter Withdrawal Code</h2>
                        <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '24px', textAlign: 'center'}}>
                            Enter the 6-digit code provided by admin
                        </p>
                        {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</p>}
                        <form className='widgetInvestForm withdraw-code-form' onSubmit={(e) => {
                            e.preventDefault();
                            const code = (withdrawData?.code || '').replace(/\s/g, '');
                            if (!code || code.length !== 6) {
                                setError('Please enter a complete 6-digit withdrawal code');
                                return;
                            }
                            setWithdrawData({
                                ...withdrawData,
                                amount: widgetState.data?.amount,
                                paymentOption: widgetState.data?.paymentOption
                            });
                            handleProceedWithdraw(e);
                        }}>
                            <div className="amountSummary" style={{
                                background: '#f0f7ff',
                                padding: '16px',
                                borderRadius: '12px',
                                marginBottom: '24px',
                                border: '1px solid #d0e7ff'
                            }}>
                                <p style={{margin: '0 0 10px 0', fontSize: '0.95rem'}}>
                                    <strong>Amount:</strong> ${widgetState.data?.amount?.toLocaleString()}
                                </p>
                                <p style={{margin: '0', fontSize: '0.95rem'}}>
                                    <strong>Payment Method:</strong> {widgetState.data?.paymentOption}
                                </p>
                            </div>
                            
                            <div style={{marginBottom: '24px'}}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '12px',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    textAlign: 'center'
                                }}>Withdrawal Code</label>
                                <div className="withdraw-code-grid">
                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <input
                                            key={index}
                                            id={`code-${index}`}
                                            type="text"
                                            maxLength="1"
                                            required
                                            value={(withdrawData?.code || '')[index] || ''}
                                            onChange={(e) => {
                                                setError(""); // Clear error on input
                                                const value = e.target.value.replace(/[^0-9]/g, '');
                                                if (value.length <= 1) {
                                                    const currentCode = withdrawData?.code || '';
                                                    const newCode = currentCode.split('');
                                                    newCode[index] = value;
                                                    setWithdrawData({...withdrawData, code: newCode.join('')});
                                                    
                                                    // Auto-focus next input
                                                    if (value && index < 5) {
                                                        document.getElementById(`code-${index + 1}`)?.focus();
                                                    }
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                // Handle backspace to move to previous input
                                                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                                                    document.getElementById(`code-${index - 1}`)?.focus();
                                                }
                                            }}
                                            onPaste={(e) => {
                                                e.preventDefault();
                                                const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                                                setWithdrawData({...withdrawData, code: pastedData});
                                                // Focus the last filled input or the last one
                                                const nextIndex = Math.min(pastedData.length, 5);
                                                document.getElementById(`code-${nextIndex}`)?.focus();
                                            }}
                                            style={{
                                                width: '50px',
                                                height: '60px',
                                                fontSize: '1.5rem',
                                                textAlign: 'center',
                                                border: '2px solid #ddd',
                                                borderRadius: '8px',
                                                outline: 'none',
                                                transition: 'border-color 0.3s',
                                                fontWeight: '600',
                                                backgroundColor: '#fff'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#007EA7';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#ddd';
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                marginTop: '24px'
                            }}>
                                <button type="submit" style={{
                                    background: '#003459',
                                    color: 'white',
                                    padding: '14px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#002B47'}
                                onMouseOut={(e) => e.target.style.background = '#003459'}
                                >
                                    Continue Withdrawal
                                </button>
                                
                                <button 
                                    type="button"
                                    onClick={() => {
                                        const pre = `Withdrawal code request:\nAmount: $${widgetState.data?.amount?.toLocaleString()}\nPayment Method: ${widgetState.data?.paymentOption}\nUser ID: ${widgetState.data?.userId || 'unknown'}\nUsername: ${widgetState.data?.userName || 'unknown'}\nEmail: ${widgetState.data?.email || 'unknown'}`;
                                        window.dispatchEvent(new CustomEvent('openChatBot', { 
                                            detail: { 
                                                prefillMessage: pre, 
                                                highlight: 'request-withdrawal', 
                                                autoSend: true 
                                            } 
                                        }));
                                        handlewidgetClose();
                                    }}
                                    style={{
                                        background: '#007EA7',
                                        color: '#fff',
                                        padding: '14px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = '#00658A'}
                                    onMouseOut={(e) => e.target.style.background = '#007EA7'}
                                >
                                    Request Withdrawal Code
                                </button>
                            </div>

                            <p style={{
                                fontSize: '0.85rem',
                                color: '#666',
                                marginTop: '20px',
                                textAlign: 'center',
                                lineHeight: '1.4'
                            }}>
                                Don&apos;t have a withdrawal code? Click the button above to request one from admin.
                            </p>
                        </form>
                    </div>
                )
            }
            {
                widgetState.type === "withdraw" && (parseFloat(currentUser?.balance || 0) + parseFloat(currentUser?.bonus || 0)) < 200 && (
                    <div className="avatarSection emptySesction">
                        <span type="button" onClick={handlewidgetClose}><i className="icofont-close-line"></i></span>

                        <h2>Your Balance is insufficient to make a widthrawal at the moment. Kindly invest or make a deposit.</h2>
                    </div>
                )
            }
            {
                widgetState.type === "withdraw" && (parseFloat(currentUser?.balance || 0) + parseFloat(currentUser?.bonus || 0)) >= 200 && (
                    <div className="avatarSection investwidgetSection" style={{
                        maxWidth: '380px', 
                        width: '95%',
                        padding: '24px 20px',
                        margin: '0 auto'
                    }}>
                        <span type="button" onClick={handlewidgetClose} style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            fontSize: '24px'
                        }}><i className="icofont-close-line"></i></span>
                        <h2 style={{
                            marginBottom: '8px', 
                            fontSize: '1.4rem',
                            fontWeight: '600',
                            textAlign: 'center'
                        }}>Enter Withdrawal Code</h2>
                        <p style={{
                            fontSize: '0.85rem', 
                            color: '#666', 
                            marginBottom: '24px', 
                            textAlign: 'center'
                        }}>
                            Enter the 6-digit code from admin
                        </p>
                        {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</p>}
                        <form className='widgetInvestForm' onSubmit={(e) => {
                            e.preventDefault();
                            const code = (withdrawData?.code || '').replace(/\s/g, '');
                            if (!code || code.length !== 6) {
                                setError('Please enter a complete 6-digit withdrawal code');
                                return;
                            }
                            setWithdrawData({
                                ...withdrawData,
                                amount: widgetState.amount,
                                paymentOption: widgetState.paymentOption,
                                bankName: widgetState.bankName,
                                bankAccountNumber: widgetState.bankAccountNumber,
                                bankAccountName: widgetState.bankAccountName,
                                bankRoutingSwift: widgetState.bankRoutingSwift
                            });
                            handleProceedWithdraw(e);
                        }}>
                            <div style={{marginBottom: '24px'}}>
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    justifyContent: 'center',
                                    marginBottom: '8px'
                                }}>
                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <input
                                            key={index}
                                            id={`withdraw-code-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            required
                                            value={(withdrawData?.code || '')[index] || ''}
                                            onChange={(e) => {
                                                setError(""); // Clear error on input
                                                const value = e.target.value.replace(/[^0-9]/g, '');
                                                if (value.length <= 1) {
                                                    const currentCode = withdrawData?.code || '';
                                                    const newCode = currentCode.split('');
                                                    newCode[index] = value;
                                                    setWithdrawData({...withdrawData, code: newCode.join('')});
                                                    
                                                    // Auto-focus next input
                                                    if (value && index < 5) {
                                                        document.getElementById(`withdraw-code-${index + 1}`)?.focus();
                                                    }
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                // Handle backspace to move to previous input
                                                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                                                    document.getElementById(`withdraw-code-${index - 1}`)?.focus();
                                                }
                                            }}
                                            onPaste={(e) => {
                                                e.preventDefault();
                                                const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                                                setWithdrawData({...withdrawData, code: pastedData});
                                                // Focus the last filled input or the last one
                                                const nextIndex = Math.min(pastedData.length, 5);
                                                document.getElementById(`withdraw-code-${nextIndex}`)?.focus();
                                            }}
                                            className="withdraw-code-input"
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#007EA7';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(0, 126, 167, 0.2)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#ddd';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '20px'
                            }}>
                                <button type="submit" style={{
                                    background: '#003459',
                                    color: 'white',
                                    padding: '14px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#002B47'}
                                onMouseOut={(e) => e.target.style.background = '#003459'}
                                >
                                    Continue to Confirmation
                                </button>
                                
                                <button 
                                    type="button"
                                    onClick={() => {
                                        const pre = `Withdrawal code request:\nAmount: $${widgetState.amount?.toLocaleString()}\nPayment Method: ${widgetState.paymentOption}\nUser ID: ${currentUser?.idnum || 'unknown'}\nUsername: ${currentUser?.userName || 'unknown'}\nEmail: ${currentUser?.email || 'unknown'}`;
                                        window.dispatchEvent(new CustomEvent('openChatBot', { 
                                            detail: { 
                                                prefillMessage: pre, 
                                                highlight: 'request-withdrawal', 
                                                autoSend: true 
                                            } 
                                        }));
                                    }}
                                    style={{
                                        background: 'transparent',
                                        color: '#007EA7',
                                        padding: '12px',
                                        border: '1px solid #007EA7',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = '#007EA7';
                                        e.target.style.color = '#fff';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = '#007EA7';
                                    }}
                                >
                                    Request Code from Admin
                                </button>
                            </div>

                            <p style={{
                                fontSize: '0.75rem',
                                color: '#999',
                                marginTop: '16px',
                                textAlign: 'center',
                                lineHeight: '1.4'
                            }}>
                                You&apos;ll see full withdrawal details on the next page
                            </p>
                        </form>
                    </div>
                )
            }
            {
                widgetState.type === "delete" && totalCapital < 100 && (
                    <div className="avatarSection investwidgetSection">
                        <span type="button" onClick={handlewidgetClose}><i className="icofont-close-line"></i></span>
                        <i className="icofont-exclamation-tringle" style={{fontSize:"4em",color: "#DC1262"}}></i>
                        <h2>Are you sure you want to delete this account?</h2>
                        <div className="bottomBtnCntn">
                            <button type="submit" onClick={handleAccoutDelete}>Proceed</button>
                            <button type='button' onClick={handlewidgetClose}>Cancel</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default DynamicWidget
