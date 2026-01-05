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
        .historyTable {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        .investmentTablehead {
          display: grid;
          gap: 12px;
          align-items: center;
          padding: 0 10px;
        }

        .investmentTablehead.header {
          background-color: var(--bg-clr);
          border-bottom: 2px solid var(--text-deco);
          position: sticky;
          top: 0;
          z-index: 10;
          padding: 10px;
          min-width: 100%;
        }

        .unitheadsect {
          padding: 10px 8px;
          text-align: left;
          word-break: break-word;
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 80px;
        }

        /* Desktop - show all 9 columns */
        @media (min-width: 1401px) {
          .investmentTablehead {
            grid-template-columns: repeat(9, 1fr);
            min-width: 1300px;
          }
        }

        /* Laptop - all columns with reduced spacing */
        @media (max-width: 1400px) and (min-width: 1025px) {
          .historyTable {
            overflow-x: auto;
          }
          .investmentTablehead {
            grid-template-columns: repeat(9, minmax(100px, 1fr));
            gap: 10px;
            padding: 8px;
            min-width: auto;
          }
          .unitheadsect {
            padding: 8px 6px;
            font-size: 0.95em;
            min-width: auto;
          }
        }

        /* Tablet landscape - all columns, compact */
        @media (max-width: 1024px) and (min-width: 768px) {
          .investmentTablehead {
            grid-template-columns: repeat(9, minmax(80px, 1fr));
            gap: 8px;
            padding: 6px;
            min-width: auto;
          }
          .unitheadsect {
            padding: 6px 4px;
            font-size: 0.9em;
            min-width: auto;
          }
          button {
            padding: 4px 8px !important;
            font-size: 0.8em !important;
          }
        }

        /* Tablet portrait - hide some columns */
        @media (max-width: 768px) and (min-width: 641px) {
          .historyTable {
            font-size: 0.85em;
            overflow-x: auto;
          }
          .investmentTablehead {
            grid-template-columns: repeat(7, minmax(70px, 1fr));
            gap: 6px;
            min-width: auto;
            padding: 6px;
          }
          .unitheadsect {
            padding: 5px 3px;
            font-size: 0.85em;
            min-width: auto;
          }
          .unitheadsect:nth-child(3),
          .unitheadsect:nth-child(12),
          .unitheadsect:nth-child(21),
          .unitheadsect:nth-child(30) {
            display: none;
          }
          button {
            padding: 3px 6px !important;
            font-size: 0.75em !important;
          }
        }

        /* Mobile - hide columns, show essential info */
        @media (max-width: 640px) {
          .historyTable {
            font-size: 0.8em;
            padding: 0;
            margin: 0 -16px;
            width: calc(100% + 32px);
          }
          .investmentTablehead {
            grid-template-columns: 1fr auto auto;
            gap: 8px;
            padding: 8px 12px;
            min-width: 100%;
            border-bottom: 1px solid var(--text-deco);
          }
          .investmentTablehead.header {
            padding: 10px 12px;
            gap: 12px;
            font-weight: 600;
          }
          .unitheadsect {
            padding: 8px 0;
            min-width: auto;
            font-size: 0.9em;
          }
          /* Column layout: Amount | Status | Actions */
          .unitheadsect:nth-child(1),
          .unitheadsect:nth-child(2),
          .unitheadsect:nth-child(3),
          .unitheadsect:nth-child(4),
          .unitheadsect:nth-child(5),
          .unitheadsect:nth-child(6),
          .unitheadsect:nth-child(8) {
            display: none;
          }
          .investmentTablehead:not(.header) .unitheadsect:nth-child(1) {
            display: flex;
          }
          .investmentTablehead:not(.header) .unitheadsect:nth-child(2) {
            display: flex;
            font-weight: 600;
            min-width: 70px;
          }
          .investmentTablehead:not(.header) .unitheadsect:nth-child(7) {
            display: flex;
          }
          .investmentTablehead:not(.header) .unitheadsect:nth-child(9) {
            display: flex;
          }
          button {
            padding: 4px 8px !important;
            font-size: 0.8em !important;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .historyTable {
            font-size: 0.75em;
          }
          .investmentTablehead {
            gap: 6px;
            padding: 6px 10px;
          }
          .unitheadsect {
            padding: 6px 0;
          }
          button {
            padding: 3px 6px !important;
            font-size: 0.7em !important;
          }
          .statusFilter {
            flex-wrap: wrap !important;
            gap: 6px !important;
          }
          .statusFilter button {
            padding: 6px 10px !important;
            font-size: 0.8em !important;
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
              <>
                {/* Desktop Table View */}
                <div className="withdrawalTableWrapper">
                  <table className="withdrawalTable">
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>Amount</th>
                        <th>Transaction ID</th>
                        <th>User ID</th>
                        <th>Payment Method</th>
                        <th>Payment Account</th>
                        <th>Status</th>
                        <th>Made On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
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
                          const statusColor = (elem?.status || '').toLowerCase() === "pending" ? "#F9F871" : 
                                            (elem?.status || '').toLowerCase() === "rejected" ? "#DC1262" : 
                                            (elem?.status || '').toLowerCase() === "expired" ? "#DC1262" : "#2DC194";
                          
                          return (
                            <tr key={`${elem.idnum}-UWithdraw_${idx}`}>
                              <td>{idx + 1}</td>
                              <td>${elem?.amount}</td>
                              <td title={elem?.id}>{elem?.id?.substring(0, 8)}...</td>
                              <td>{elem?.idnum}</td>
                              <td>
                                <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                  <span title={paymentMethod}>{paymentMethod}</span>
                                  <button
                                    className={`copyButtonSmall ${copiedId === `method-${elem?.id}` ? 'copied' : ''}`}
                                    onClick={() => handleCopyPaymentMethod(paymentMethod, `method-${elem?.id}`)}
                                    title="Copy payment method"
                                  >
                                    {copiedId === `method-${elem?.id}` ? '✓' : '📋'}
                                  </button>
                                </div>
                              </td>
                              <td>
                                <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                  <span title={walletAddress} style={{maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis'}}>{walletAddress.substring(0, 15)}{walletAddress.length > 15 ? '...' : ''}</span>
                                  <button
                                    className={`copyButtonSmall ${copiedId === `wallet-${elem?.id}` ? 'copied' : ''}`}
                                    onClick={() => handleCopyPaymentMethod(walletAddress, `wallet-${elem?.id}`)}
                                    title="Copy wallet address"
                                  >
                                    {copiedId === `wallet-${elem?.id}` ? '✓' : '📋'}
                                  </button>
                                </div>
                              </td>
                              <td><span className="statusBadge" style={{color: statusColor, borderLeft: `3px solid ${statusColor}`}}>{elem?.status}</span></td>
                              <td>{isValidDate ? `${elemDate.toLocaleDateString("en-US", {day: "numeric", month: "short", year: "numeric"})}` : 'Invalid Date'}</td>
                              <td>
                                <div className="actionButtonsCell">
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
                                          fontSize: '0.85em',
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
                                          fontSize: '0.85em',
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
                                        fontSize: '0.85em'
                                      }}
                                    >
                                      View
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                      })
                    }
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="withdrawalCardsContainer">
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
                        const statusColor = (elem?.status || '').toLowerCase() === "pending" ? "#F9F871" : 
                                          (elem?.status || '').toLowerCase() === "rejected" ? "#DC1262" : 
                                          (elem?.status || '').toLowerCase() === "expired" ? "#DC1262" : "#2DC194";

                        return (
                          <div className="withdrawalCard" key={`${elem.idnum}-card-${idx}`}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--text-deco)', paddingBottom: '12px'}}>
                              <h3 style={{margin: 0, fontSize: '1em'}}>Withdrawal #{idx + 1}</h3>
                              <span className="statusBadgeMobile" style={{backgroundColor: statusColor, color: '#fff'}}>{elem?.status}</span>
                            </div>

                            <div className="cardRow">
                              <span className="cardLabel">Amount:</span>
                              <span className="cardValue" style={{fontWeight: '600', fontSize: '1.1em'}}>${elem?.amount}</span>
                            </div>

                            <div className="cardRow">
                              <span className="cardLabel">User ID:</span>
                              <span className="cardValue">{elem?.idnum}</span>
                            </div>

                            <div className="cardRow">
                              <span className="cardLabel">Transaction:</span>
                              <span className="cardValue" title={elem?.id} style={{fontSize: '0.85em'}}>{elem?.id?.substring(0, 12)}...</span>
                            </div>

                            <div className="cardRow">
                              <span className="cardLabel">Payment Method:</span>
                              <span className="cardValue">
                                <span>{paymentMethod}</span>
                                <button
                                  className={`copyButtonSmall ${copiedId === `method-${elem?.id}` ? 'copied' : ''}`}
                                  onClick={() => handleCopyPaymentMethod(paymentMethod, `method-${elem?.id}`)}
                                  style={{marginLeft: '4px'}}
                                >
                                  {copiedId === `method-${elem?.id}` ? '✓' : '📋'}
                                </button>
                              </span>
                            </div>

                            <div className="cardRow">
                              <span className="cardLabel">Account:</span>
                              <span className="cardValue">
                                <span title={walletAddress} style={{fontSize: '0.85em', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis'}}>{walletAddress.substring(0, 15)}{walletAddress.length > 15 ? '...' : ''}</span>
                                <button
                                  className={`copyButtonSmall ${copiedId === `wallet-${elem?.id}` ? 'copied' : ''}`}
                                  onClick={() => handleCopyPaymentMethod(walletAddress, `wallet-${elem?.id}`)}
                                  style={{marginLeft: '4px'}}
                                >
                                  {copiedId === `wallet-${elem?.id}` ? '✓' : '📋'}
                                </button>
                              </span>
                            </div>

                            <div className="cardRow">
                              <span className="cardLabel">Date:</span>
                              <span className="cardValue">{isValidDate ? elemDate.toLocaleDateString("en-US", {day: "numeric", month: "short", year: "numeric"}) : 'Invalid'}</span>
                            </div>

                            <div className="cardActions">
                              {isPending ? (
                                <>
                                  <button 
                                    onClick={() => handleApproveWithdrawal(elem)}
                                    disabled={loadingId === elem.id}
                                    style={{
                                      backgroundColor: '#28a745',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: loadingId === elem.id ? 'not-allowed' : 'pointer',
                                      opacity: loadingId === elem.id ? 0.6 : 1
                                    }}
                                  >
                                    {loadingId === elem.id ? 'Processing...' : 'Approve'}
                                  </button>
                                  <button 
                                    onClick={() => handleRejectWithdrawal(elem)}
                                    disabled={loadingId === elem.id}
                                    style={{
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: loadingId === elem.id ? 'not-allowed' : 'pointer',
                                      opacity: loadingId === elem.id ? 0.6 : 1
                                    }}
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => {setWithdrawData(elem); setProfileState("Edit Withdraw")}}
                                  style={{
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  View Details
                                </button>
                              )}
                            </div>
                          </div>
                        );
                    })
                  }
                </div>
              </>
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
