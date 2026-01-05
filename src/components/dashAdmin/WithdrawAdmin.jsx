import React, { useState } from 'react';
import { supabaseDb } from "../../database/supabaseUtils";
import { supabase } from "../../database/supabaseConfig";

const WithdrawAdmin = ({ withdrawals, activeUsers, setProfileState, setWithdrawData}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loadingId, setLoadingId] = useState(null);

    // Calculate withdrawal stats
    const withdrawalStats = {
        totalAmount: withdrawals.reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
        pendingAmount: withdrawals.filter(w => w.status === 'Pending')
            .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
        completedAmount: withdrawals.filter(w => w.status === 'Active')
            .reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
        totalFees: withdrawals.reduce((sum, w) => sum + (parseFloat(w.withdrawalFee) || 0), 0)
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
            await supabaseDb.updateWithdrawal(withdrawal.id, {
                status: "Active",
                date: new Date().toISOString(),
                authStatus: "seen"
            });

            // Create notification for user
            const notificationPush = {
                message: `Your $${withdrawal.amount} withdrawal transaction has been confirmed. $${withdrawal.amount} is on its way to your wallet address now`,
                idnum: withdrawal.idnum,
                status: "unseen"
            };
            await supabaseDb.createNotification(notificationPush);

            // Send email notification
            try {
                const { data: userData } = await supabase
                    .from('userlogs')
                    .select('email, name')
                    .eq('idnum', withdrawal.idnum)
                    .single();

                if (userData?.email) {
                    const emailSubject = 'Withdrawal Confirmed - Grant Union Investment';
                    const emailMessage = `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #28a745;">💰 Withdrawal Confirmed!</h2>
                        <p>Dear ${userData.name || 'User'},</p>
                        <p>Great news! Your withdrawal request has been processed and confirmed.</p>
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                          <h3 style="margin-top: 0;">Withdrawal Details:</h3>
                          <ul style="list-style: none; padding: 0;">
                            <li><strong>Amount:</strong> $${withdrawal.amount}</li>
                            <li><strong>Fee:</strong> $${withdrawal.widthrawalFee}</li>
                            <li><strong>Payment Method:</strong> ${withdrawal.paymentOption}</li>
                          </ul>
                        </div>
                        <p>Your funds are now being processed and will be sent to your wallet shortly.</p>
                        <p>Best regards,<br>Grant Union Investment Team</p>
                      </div>
                    `;

                    await fetch('/api/send-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        to: userData.email,
                        subject: emailSubject,
                        message: emailMessage,
                        type: 'withdrawal_confirmation'
                      })
                    });
                }
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }

            alert('Withdrawal approved successfully!');
        } catch (error) {
            console.error("Error approving withdrawal:", error);
            alert('Failed to approve withdrawal');
        } finally {
            setLoadingId(null);
        }
    };

    const handleRejectWithdrawal = async (withdrawal) => {
        if (!window.confirm(`Reject this withdrawal of $${withdrawal.amount}? Amount will be refunded to user.`)) return;
        
        setLoadingId(withdrawal.id);
        try {
            await supabaseDb.updateWithdrawal(withdrawal.id, {
                status: "Rejected",
                date: new Date().toISOString(),
                authStatus: "seen"
            });

            // Refund the user's balance
            const { data: userData } = await supabase
                .from('userlogs')
                .select('balance')
                .eq('idnum', withdrawal.idnum)
                .single();

            if (userData) {
                const currentBalance = parseFloat(userData.balance || 0);
                const refundAmount = parseFloat(withdrawal.amount || 0);
                await supabase
                    .from('userlogs')
                    .update({ balance: currentBalance + refundAmount, updated_at: new Date().toISOString() })
                    .eq('idnum', withdrawal.idnum);
            }

            // Send rejection notification
            const rejectionNotification = {
                message: `Your $${withdrawal.amount} withdrawal request has been rejected. The amount has been refunded to your account.`,
                idnum: withdrawal.idnum,
                status: "unseen"
            };
            await supabaseDb.createNotification(rejectionNotification);

            alert('Withdrawal rejected and amount refunded!');
        } catch (error) {
            console.error("Error rejecting withdrawal:", error);
            alert('Failed to reject withdrawal');
        } finally {
            setLoadingId(null);
        }
    };
    
    return (
    <div className="investmentMainCntn">
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
              <div className="historyTable">
                  <div className="investmentTablehead header">
                      <div className="unitheadsect">S/N</div>
                      <div className="unitheadsect">Amount</div>
                      <div className="unitheadsect">Transaction ID</div>
                      <div className="unitheadsect">User ID</div>
                      <div className="unitheadsect">Status</div>
                      <div className="unitheadsect">Made On</div>
                      <div className="unitheadsect">Actions</div>
                  </div>
                  {
                      withdrawals.sort((a, b) => {
                          const dateA = new Date(a.date || 0);
                          const dateB = new Date(b.date || 0);
                          
                          const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
                          const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
                        
                          return timeB - timeA;
                      }).map((elem, idx) => {
                          const elemDate = new Date(elem?.date || 0);
                          const isValidDate = !isNaN(elemDate.getTime());
                          const isPending = elem?.status === "Pending";
                          return (
                          <div className="investmentTablehead" key={`${elem.idnum}-UWithdraw_${idx}`} style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', alignItems: 'center'}}>
                              <div className="unitheadsect">{idx + 1}</div>
                              <div className="unitheadsect">${elem?.amount}</div>
                              <div className="unitheadsect" title={elem?.id}>{elem?.id?.substring(0, 8)}...</div>
                              <div className="unitheadsect">{elem?.idnum}</div>
                              <div className="unitheadsect"><span style={{color: `${elem?.status === "Pending" ? "#F9F871" : elem?.status === "Rejected" ? "#DC1262" : elem?.status === "Expired" ? "#DC1262" : "#2DC194"}`}}>{elem?.status}</span></div>
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
