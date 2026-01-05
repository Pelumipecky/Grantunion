import React, { useState } from 'react';

const WithdrawAdmin = ({ withdrawals, activeUsers, setProfileState, setWithdrawData}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loadingId, setLoadingId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    // Calculate withdrawal stats
    const withdrawalStats = {
        totalAmount: withdrawals.reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
        pendingAmount: withdrawals.filter(w => w.status === 'Pending')
            .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
        completedAmount: withdrawals.filter(w => w.status === 'Active')
            .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
        totalFees: withdrawals.reduce((sum, w) => sum + (parseFloat(w.withdrawal_fee) || 0), 0)
    };

    // Filter withdrawals
    const filteredWithdrawals = withdrawals.filter(withdrawal => {
        const matchesStatus = filterStatus === 'all' || withdrawal.status === filterStatus;
        const matchesSearch = !searchTerm || 
            withdrawal.idnum.toString().includes(searchTerm) ||
            withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleApproveWithdrawal = async (withdrawal) => {
        setLoadingId(withdrawal.id);
        try {
            // Call server-side API endpoint
            const response = await fetch('/api/withdrawals/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    withdrawalId: withdrawal.id,
                    withdrawal: withdrawal
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to approve withdrawal');
            }

            alert('Withdrawal approved successfully!');
            // Withdrawal list will be refreshed by the parent component
        } catch (error) {
            console.error("Error approving withdrawal:", error);
            alert('Failed to approve withdrawal: ' + error.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleRejectWithdrawal = async (withdrawal) => {
        if (!window.confirm(`Reject this withdrawal of $${withdrawal.amount}? Amount will be refunded to user.`)) return;
        
        setLoadingId(withdrawal.id);
        try {
            // Call server-side API endpoint
            const response = await fetch('/api/withdrawals/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    withdrawalId: withdrawal.id,
                    withdrawal: withdrawal
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reject withdrawal');
            }

            alert('Withdrawal rejected and amount refunded!');
            // Withdrawal list will be refreshed by the parent component
        } catch (error) {
            console.error("Error rejecting withdrawal:", error);
            alert('Failed to reject withdrawal: ' + error.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleCopyPaymentMethod = async (paymentMethod, withdrawalId) => {
        try {
            await navigator.clipboard.writeText(paymentMethod);
            setCopiedId(withdrawalId);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    
    return (
    <div className="investmentMainCntn">
      <style>{`
        @media (max-width: 1024px) {
          .historyTable {
            font-size: 0.85em;
          }
          .investmentTablehead {
            gap: 8px !important;
          }
          .unitheadsect {
            padding: 8px 4px !important;
            word-break: break-word;
          }
          button {
            padding: 4px 8px !important;
            font-size: 0.75em !important;
          }
        }

        @media (max-width: 768px) {
          .historyTable {
            font-size: 0.8em;
            overflow-x: scroll;
            -webkit-overflow-scrolling: touch;
          }
          .investmentTablehead {
            gap: 5px !important;
          }
          .unitheadsect {
            padding: 6px 2px !important;
            min-width: 55px;
            text-align: center;
          }
          .investmentTablehead.header {
            position: sticky;
            top: 0;
            background-color: var(--bg-clr);
            z-index: 10;
            border-bottom: 2px solid var(--text-deco);
          }
          button {
            padding: 3px 6px !important;
            font-size: 0.7em !important;
          }
        }

        @media (max-width: 480px) {
          .statusFilter {
            flex-wrap: wrap !important;
            gap: 6px !important;
          }
          .statusFilter button {
            padding: 6px 10px !important;
            font-size: 0.85em !important;
          }
          .searchBox input {
            font-size: 14px !important;
          }
          .historyTable {
            font-size: 0.75em;
          }
          .unitheadsect {
            padding: 4px 2px !important;
            min-width: 45px;
          }
          button {
            padding: 2px 4px !important;
            font-size: 0.65em !important;
          }
        }
      `}</style>
      <div className="overviewSection">
        <div className="dashboardStats">
          <div className="statCard">
            <h3>Total Withdrawals</h3>
            <h2>${withdrawalStats.totalAmount.toLocaleString()}</h2>
          </div>
          <div className="statCard">
            <h3>Pending Amount</h3>
            <h2>${withdrawalStats.pendingAmount.toLocaleString()}</h2>
          </div>
          <div className="statCard">
            <h3>Completed Amount</h3>
            <h2>${withdrawalStats.completedAmount.toLocaleString()}</h2>
          </div>
          <div className="statCard">
            <h3>Total Fees</h3>
            <h2>${withdrawalStats.totalFees.toLocaleString()}</h2>
          </div>
        </div>
        <div className="filterSection">
          <div className="searchBox">
            <input 
              type="text" 
              placeholder="Search by transaction or user ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="statusFilter">
            <button 
              className={filterStatus === 'all' ? 'active' : ''} 
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button 
              className={filterStatus === 'Active' ? 'active' : ''} 
              onClick={() => setFilterStatus('Active')}
            >
              Completed
            </button>
            <button 
              className={filterStatus === 'Pending' ? 'active' : ''} 
              onClick={() => setFilterStatus('Pending')}
            >
              Pending
            </button>
            <button 
              className={filterStatus === 'Rejected' ? 'active' : ''} 
              onClick={() => setFilterStatus('Rejected')}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>
      <div className="myinvestmentSection">
        <h2>Withdrawals Stack ({filteredWithdrawals.length})</h2>
      {
          withdrawals.length > 0 ? (
              <div className="historyTable" style={{overflowX: 'auto'}}>
                  <div className="investmentTablehead header" style={{display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '10px', alignItems: 'center', minWidth: '1200px'}}>
                      <div className="unitheadsect">S/N</div>
                      <div className="unitheadsect">Amount</div>
                      <div className="unitheadsect">Transaction ID</div>
                      <div className="unitheadsect">User ID</div>
                      <div className="unitheadsect">Payment Method</div>
                      <div className="unitheadsect">Payment Account</div>
                      <div className="unitheadsect">Status</div>
                      <div className="unitheadsect">Made On</div>
                      <div className="unitheadsect">Actions</div>
                  </div>
                  {
                      withdrawals.sort((a, b) => {
                          const dateA = new Date(a.created_at || a.date || 0);
                          const dateB = new Date(b.created_at || b.date || 0);
                          
                          const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
                          const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
                        
                          return timeB - timeA;
                      }).map((elem, idx) => {
                          const elemDate = new Date(elem?.created_at || elem?.date || 0);
                          const isValidDate = !isNaN(elemDate.getTime());
                          const isPending = (elem?.status || '').toLowerCase() === "pending";
                          const paymentMethod = elem?.paymentoption || elem?.paymentOption || 'N/A';
                          const walletAddress = elem?.wallet_address || 'N/A';
                          return (
                          <div className="investmentTablehead" key={`${elem.idnum}-UWithdraw_${idx}`} style={{display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '10px', alignItems: 'center', minWidth: '1200px'}}>
                              <div className="unitheadsect">{idx + 1}</div>
                              <div className="unitheadsect">${elem?.amount}</div>
                              <div className="unitheadsect" title={elem?.id}>{elem?.id?.substring(0, 8)}...</div>
                              <div className="unitheadsect">{elem?.idnum}</div>
                              <div className="unitheadsect" style={{display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center'}}>
                                <span title={paymentMethod}>{paymentMethod.substring(0, 12)}{paymentMethod.length > 12 ? '...' : ''}</span>
                                <button
                                  onClick={() => handleCopyPaymentMethod(paymentMethod, `method-${elem?.id}`)}
                                  title="Copy payment method"
                                  style={{
                                    background: copiedId === `method-${elem?.id}` ? '#28a745' : 'transparent',
                                    border: '1px solid #ccc',
                                    borderRadius: '3px',
                                    padding: '2px 6px',
                                    cursor: 'pointer',
                                    fontSize: '0.75em',
                                    transition: 'all 0.3s',
                                    color: copiedId === `method-${elem?.id}` ? 'white' : '#666'
                                  }}
                                >
                                  {copiedId === `method-${elem?.id}` ? '✓' : '📋'}
                                </button>
                              </div>
                              <div className="unitheadsect" style={{display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', minWidth: '120px'}}>
                                <span title={walletAddress} style={{fontSize: '0.85em'}}>{walletAddress.substring(0, 12)}{walletAddress.length > 12 ? '...' : ''}</span>
                                <button
                                  onClick={() => handleCopyPaymentMethod(walletAddress, `wallet-${elem?.id}`)}
                                  title="Copy wallet address"
                                  style={{
                                    background: copiedId === `wallet-${elem?.id}` ? '#28a745' : 'transparent',
                                    border: '1px solid #ccc',
                                    borderRadius: '3px',
                                    padding: '2px 6px',
                                    cursor: 'pointer',
                                    fontSize: '0.75em',
                                    transition: 'all 0.3s',
                                    color: copiedId === `wallet-${elem?.id}` ? 'white' : '#666'
                                  }}
                                >
                                  {copiedId === `wallet-${elem?.id}` ? '✓' : '📋'}
                                </button>
                              </div>
                              <div className="unitheadsect"><span style={{color: `${(elem?.status || '').toLowerCase() === "pending" ? "#F9F871" : (elem?.status || '').toLowerCase() === "rejected" ? "#DC1262" : (elem?.status || '').toLowerCase() === "expired" ? "#DC1262" : "#2DC194"}`}}>{elem?.status}</span></div>
                              <div className="unitheadsect">{isValidDate ? `${elemDate.toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}` : 'Invalid Date'}</div>
                              <div className="unitheadsect" style={{display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center'}}>
                                {isPending ? (
                                  <>
                                    <button 
                                      onClick={() => handleApproveWithdrawal(elem)}
                                      disabled={loadingId === elem.id}
                                      style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: loadingId === elem.id ? 'not-allowed' : 'pointer',
                                        fontSize: '0.8em',
                                        opacity: loadingId === elem.id ? 0.6 : 1,
                                        transition: 'all 0.3s'
                                      }}
                                    >
                                      {loadingId === elem.id ? 'Processing...' : 'Approve'}
                                    </button>
                                    <button 
                                      onClick={() => handleRejectWithdrawal(elem)}
                                      disabled={loadingId === elem.id}
                                      style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: loadingId === elem.id ? 'not-allowed' : 'pointer',
                                        fontSize: '0.8em',
                                        opacity: loadingId === elem.id ? 0.6 : 1,
                                        transition: 'all 0.3s'
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <button 
                                    onClick={() => {setWithdrawData(elem); setProfileState("Edit Withdraw")}}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#007bff',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '0.8em'
                                    }}
                                  >
                                    View
                                  </button>
                                )}
                              </div>
                          </div>
                          );
                      })
                  }
              </div>

          ) : (

              <div className="emptyTable">
                  <i className="icofont-exclamation-tringle"></i>
                  <p>
                      You currently have no data in your withdrawal stack.
                  </p>
              </div>
          )
      }
    </div>
  </div>
  )
}

export default WithdrawAdmin
